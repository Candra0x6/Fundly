// Revenue Reporting Canister
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Int "mo:base/Int";

actor RevenueReporting {
    // Types
    public type Revenue = {
        id : Text;
        msmeId : Text;
        amount : Nat;
        description : Text;
        reportDate : Time.Time;
        distributed : Bool;
        distributionTxs : [DistributionTx];
    };

    public type DistributionTx = {
        tokenId : Nat;
        recipient : Account;
        amount : Nat;
        timestamp : Time.Time;
        txId : ?Nat;
    };

    public type RevenueError = {
        #NotFound;
        #Unauthorized;
        #ValidationError;
        #DistributionFailed;
        #MSMENotFound;
        #NoTokensFound;
        #TransferError : Text;
    };

    // ICRC Types
    public type Account = {
        owner : Principal;
        subaccount : ?Subaccount;
    };

    public type Subaccount = Blob;

    public type TransferArgs = {
        from_subaccount : ?Subaccount;
        to : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Blob;
        created_at_time : ?Nat64;
    };

    public type TransferError = {
        #BadFee : { expected_fee : Nat };
        #BadBurn : { min_burn_amount : Nat };
        #InsufficientFunds : { balance : Nat };
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
        #Duplicate : { duplicate_of : Nat };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
    };

    // State variables
    private var revenues = HashMap.HashMap<Text, Revenue>(0, Text.equal, Text.hash);
    private var msmeToRevenues = HashMap.HashMap<Text, [Text]>(0, Text.equal, Text.hash);
    private stable var nextRevenueId : Nat = 0;
    private stable var admin : Principal = Principal.fromText("aaaaa-aa"); // Will be set to proper admin principal

    // External interfaces (will be replaced with actual canister IDs)
    private let MSMECanister = actor "aaaaa-aa" : actor {
        getMSME : (id : Text) -> async ?{ owner : Principal };
    };

    // Updated interface for ICRC-7 NFT Canister
    private let NFTCanister = actor "aaaaa-aa" : actor {
        getTokensByMSME : (msmeId : Text) -> async [Nat];
        icrc7_owner_of : (tokenId : Nat) -> async ?Account;
        getRevenueShare : (tokenId : Nat) -> async ?Nat;
        recordDistribution : (tokenId : Nat, amount : Nat, msmeId : Text) -> async Result.Result<(), Text>;
    };

    // Updated interface for ICRC-1 Token Canister
    private let TokenCanister = actor "aaaaa-aa" : actor {
        icrc1_transfer : (args : TransferArgs) -> async Result.Result<Nat, TransferError>;
    };

    // Report new revenue
    public shared (msg) func reportRevenue(
        msmeId : Text,
        amount : Nat,
        description : Text,
    ) : async Result.Result<Text, RevenueError> {
        // Verify the caller is the MSME owner
        try {
            let msmeOpt = await MSMECanister.getMSME(msmeId);
            switch (msmeOpt) {
                case (null) { return #err(#MSMENotFound) };
                case (?msme) {
                    if (msme.owner != msg.caller) {
                        return #err(#Unauthorized);
                    };
                };
            };
        } catch (e) {
            return #err(#ValidationError);
        };

        let revenueId = nextRevenueId;
        let idText = Nat.toText(revenueId);

        // Create revenue record
        let revenue : Revenue = {
            id = idText;
            msmeId = msmeId;
            amount = amount;
            description = description;
            reportDate = Time.now();
            distributed = false;
            distributionTxs = [];
        };

        // Store the revenue
        revenues.put(idText, revenue);

        // Update MSME's revenue list
        switch (msmeToRevenues.get(msmeId)) {
            case (null) {
                msmeToRevenues.put(msmeId, [idText]);
            };
            case (?existingIds) {
                msmeToRevenues.put(msmeId, Array.append(existingIds, [idText]));
            };
        };

        nextRevenueId += 1;
        return #ok(idText);
    };

    // Get revenue by ID
    public query func getRevenue(id : Text) : async ?Revenue {
        return revenues.get(id);
    };

    // Get all revenues for an MSME
    public query func getMSMERevenues(msmeId : Text) : async [Text] {
        switch (msmeToRevenues.get(msmeId)) {
            case (null) { return [] };
            case (?ids) { return ids };
        };
    };

    // Distribute revenue to token holders based on ICRC-7 token ownership
    public shared (msg) func distributeRevenue(revenueId : Text) : async Result.Result<(), RevenueError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        switch (revenues.get(revenueId)) {
            case (null) { return #err(#NotFound) };
            case (?revenue) {
                if (revenue.distributed) {
                    return #ok(); // Already distributed
                };

                // Get all tokens for this MSME
                let tokenIds = try {
                    await NFTCanister.getTokensByMSME(revenue.msmeId);
                } catch (e) {
                    return #err(#ValidationError);
                };

                if (tokenIds.size() == 0) {
                    return #err(#NoTokensFound);
                };

                // Calculate total revenue shares
                var totalShares = 0;
                let tokenShares = Buffer.Buffer<(Nat, Nat)>(tokenIds.size());

                for (tokenId in tokenIds.vals()) {
                    let shareOpt = try {
                        await NFTCanister.getRevenueShare(tokenId);
                    } catch (e) {
                        return #err(#ValidationError);
                    };

                    switch (shareOpt) {
                        case (null) {};
                        case (?share) {
                            totalShares += share;
                            tokenShares.add((tokenId, share));
                        };
                    };
                };

                if (totalShares == 0) {
                    return #err(#ValidationError);
                };

                // Create distribution transactions
                let distributionTxs = Buffer.Buffer<DistributionTx>(tokenShares.size());

                for ((tokenId, share) in tokenShares.vals()) {
                    // Calculate amount to distribute to this token
                    let amount = (revenue.amount * share) / totalShares;

                    if (amount > 0) {
                        // Get token owner
                        let ownerOpt = try {
                            await NFTCanister.icrc7_owner_of(tokenId);
                        } catch (e) {
                            return #err(#ValidationError);
                        };

                        switch (ownerOpt) {
                            case (null) {};
                            case (?owner) {
                                // Transfer tokens to the owner
                                try {
                                    let transferArgs : TransferArgs = {
                                        from_subaccount = null;
                                        to = owner;
                                        amount = amount;
                                        fee = null;
                                        memo = ?Text.encodeUtf8("Revenue distribution for MSME: " # revenue.msmeId);
                                        created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
                                    };

                                    let transferResult = await TokenCanister.icrc1_transfer(transferArgs);

                                    switch (transferResult) {
                                        case (#ok(txId)) {
                                            // Record distribution in the NFT
                                            try {
                                                let recordResult = await NFTCanister.recordDistribution(tokenId, amount, revenue.msmeId);
                                                switch (recordResult) {
                                                    case (#ok(_)) {
                                                        // Add to distribution transactions
                                                        distributionTxs.add({
                                                            tokenId = tokenId;
                                                            recipient = owner;
                                                            amount = amount;
                                                            timestamp = Time.now();
                                                            txId = ?txId;
                                                        });
                                                    };
                                                    case (#err(e)) {
                                                        // We still proceed even if recording fails
                                                        distributionTxs.add({
                                                            tokenId = tokenId;
                                                            recipient = owner;
                                                            amount = amount;
                                                            timestamp = Time.now();
                                                            txId = ?txId;
                                                        });
                                                    };
                                                };
                                            } catch (e) {
                                                // Continue even if recording fails
                                                distributionTxs.add({
                                                    tokenId = tokenId;
                                                    recipient = owner;
                                                    amount = amount;
                                                    timestamp = Time.now();
                                                    txId = ?txId;
                                                });
                                            };
                                        };
                                        case (#err(e)) {
                                            // Record the failed transfer
                                            distributionTxs.add({
                                                tokenId = tokenId;
                                                recipient = owner;
                                                amount = amount;
                                                timestamp = Time.now();
                                                txId = null;
                                            });
                                        };
                                    };
                                } catch (e) {
                                    // Record the failed transfer
                                    distributionTxs.add({
                                        tokenId = tokenId;
                                        recipient = owner;
                                        amount = amount;
                                        timestamp = Time.now();
                                        txId = null;
                                    });
                                };
                            };
                        };
                    };
                };

                // Mark as distributed
                let updatedRevenue : Revenue = {
                    id = revenue.id;
                    msmeId = revenue.msmeId;
                    amount = revenue.amount;
                    description = revenue.description;
                    reportDate = revenue.reportDate;
                    distributed = true;
                    distributionTxs = Buffer.toArray(distributionTxs);
                };
                revenues.put(revenueId, updatedRevenue);

                return #ok();
            };
        };
    };

    // Get distribution details for a revenue
    public query func getDistributionDetails(revenueId : Text) : async Result.Result<[DistributionTx], RevenueError> {
        switch (revenues.get(revenueId)) {
            case (null) { return #err(#NotFound) };
            case (?revenue) {
                return #ok(revenue.distributionTxs);
            };
        };
    };

    // Admin functions
    public shared (msg) func setAdminPrincipal(newAdmin : Principal) : async Result.Result<(), RevenueError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        admin := newAdmin;
        return #ok();
    };

    // Update canister references (for when actual canisters are deployed)
    public shared (msg) func updateCanisterReferences(
        msmeCanisterId : Text,
        nftCanisterId : Text,
        tokenCanisterId : Text,
    ) : async Result.Result<(), RevenueError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        // This would update the actor references in a real implementation
        // For this demo, we'll just return success
        return #ok();
    };
};
