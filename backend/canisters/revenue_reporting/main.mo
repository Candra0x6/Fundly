// Revenue Reporting Canister
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import MSMECanister "canister:msme_registration";
import NFTCanister "canister:nft_canister";
import TokenCanister "canister:token_canister";
import Types "../../types";
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
        document : Types.Document;
    };

    public type DistributionTx = {
        tokenId : Nat;
        recipient : Account;
        amount : Nat;
        timestamp : Time.Time;
        txId : ?Nat;
        category : Text;
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

    public type Memo = Blob;
    public type TokenTransferArgs = {
        from_subaccount : ?Subaccount;
        to : {
            owner : Principal;
            subaccount : ?Subaccount;
        };
        from : Account;
        amount : Nat;
        fee : ?Nat;
        memo : ?Memo;
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

    public type TransactionWithRevenue = {
        transaction : DistributionTx;
        revenue : Revenue;
    };

    // State variables
    private var revenues = HashMap.HashMap<Text, Revenue>(0, Text.equal, Text.hash);
    private var msmeToRevenues = HashMap.HashMap<Text, [Text]>(0, Text.equal, Text.hash);
    private stable var nextRevenueId : Nat = 0;
    private stable var admin : Principal = Principal.fromText("aaaaa-aa"); // Will be set to proper admin principal

    // Report new revenue
    public shared (msg) func reportRevenue(
        msmeId : Text,
        amount : Nat,
        description : Text,
        document : Types.Document,
    ) : async Result.Result<Text, RevenueError> {
        // Verify the caller is the MSME owner
        try {
            let msmeOpt = await MSMECanister.getMSME(msmeId);
            switch (msmeOpt) {
                case (#ok(msme)) {
                    if (msme.details.owner != msg.caller) {
                        return #err(#Unauthorized);
                    };
                };
                case (#err(_e)) {
                    return #err(#MSMENotFound);
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
            document = document;
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
    public query func getMSMERevenues(msmeId : Text) : async [Revenue] {
        let revenueIds = switch (msmeToRevenues.get(msmeId)) {
            case (null) { [] };
            case (?ids) { ids };
        };

        let revenueBuffer = Buffer.Buffer<Revenue>(revenueIds.size());

        for (id in revenueIds.vals()) {
            switch (revenues.get(id)) {
                case (null) {}; // Skip if not found
                case (?revenue) {
                    revenueBuffer.add(revenue);
                };
            };
        };

        return Buffer.toArray(revenueBuffer);
    };

    // Distribute revenue to token holders based on ICRC-7 token ownership
    public shared (_msg) func distributeRevenue(revenueId : Text) : async Result.Result<Revenue, RevenueError> {
        switch (revenues.get(revenueId)) {
            case (null) { return #err(#NotFound) };
            case (?revenue) {
                if (revenue.distributed) {
                    return #ok(revenue); // Already distributed
                };

                // Get all tokens for this MSME
                let tokensResult = try {
                    await NFTCanister.getNFTsByMSME(revenue.msmeId);
                } catch (e) {
                    return #err(#ValidationError);
                };

                let tokens = switch (tokensResult) {
                    case (#ok(ids)) {
                        if (ids.size() == 0) {
                            return #err(#NoTokensFound);
                        };
                        ids // Return the unwrapped array
                    };
                    case (#err(_error)) {
                        return #err(#ValidationError);
                    };
                };

                // Calculate total revenue shares
                var totalShares = 0;
                let tokenShares = Buffer.Buffer<(Nat, Nat)>(tokens.size());

                for (token in tokens.vals()) {
                    let shareOpt = try {
                        await NFTCanister.getRevenueShare(token.id);
                    } catch (_e) {
                        return #err(#ValidationError);
                    };

                    switch (shareOpt) {
                        case (null) {};
                        case (?share) {
                            totalShares += share;
                            tokenShares.add((token.id, share));
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
                    Debug.print("revenue Amount: " # Nat.toText(revenue.amount) # " share: " # Nat.toText(share) # " totalShare: " # Nat.toText(totalShares));
                    let amount = (revenue.amount * share) / 10000;
                    Debug.print("Amount to distribute: " # Nat.toText(amount));
                    let msmeOpt = await MSMECanister.getMSME(revenue.msmeId);
                    let msmeOwner = switch (msmeOpt) {
                        case (#ok(msme)) { msme.details.owner };
                        case (#err(_)) { return #err(#MSMENotFound) };
                    };
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
                                Debug.print("Owner: " # Principal.toText(owner.owner));
                                Debug.print("MSME Owner: " # Principal.toText(msmeOwner));
                                Debug.print("Amount: " # Nat.toText(amount));
                                // Transfer tokens to the owner
                                try {
                                    let transferArgs : TokenTransferArgs = {
                                        from_subaccount = null;
                                        to = owner;
                                        from = {
                                            owner = msmeOwner;
                                            subaccount = null;
                                        };
                                        amount = amount;
                                        fee = null;
                                        memo = ?Text.encodeUtf8("Revenue distribution for MSME: " # revenue.msmeId);
                                        created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
                                    };

                                    let transferResult = await TokenCanister.icrc_spesific_transfer(transferArgs);
                                    Debug.print("Transferring... " # debug_show (transferResult));

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
                                                            category = "distributionTx";
                                                        });
                                                        Debug.print("Transfer Success");
                                                    };
                                                    case (#err(e)) {
                                                        // We still proceed even if recording fails
                                                        distributionTxs.add({
                                                            tokenId = tokenId;
                                                            recipient = owner;
                                                            amount = amount;
                                                            timestamp = Time.now();
                                                            txId = ?txId;
                                                            category = "distributionTx";
                                                        });
                                                        Debug.print("Transfer Def Recorded: " # Nat.toText(txId));
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
                                                    category = "distributionTx";
                                                });

                                                Debug.print("Transfer Failed: " # Error.message(e));
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
                                                category = "distributionTx";
                                            });
                                            Debug.print("Transfer Failed Recorded: " # debug_show (e));
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
                                        category = "distributionTx";
                                    });
                                    Debug.print("Transfer Faile sad: " # Error.message(e));
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
                    document = revenue.document;
                };
                revenues.put(revenueId, updatedRevenue);
                return #ok(updatedRevenue);
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

    // Get all transactions where owner is the recipient
    public query func getTransactionsByOwner(owner : Principal) : async [DistributionTx] {
        let buffer = Buffer.Buffer<DistributionTx>(0);

        // Iterate through all revenues to find transactions for this owner
        for ((_, revenue) in revenues.entries()) {
            for (tx in revenue.distributionTxs.vals()) {
                if (tx.recipient.owner == owner) {
                    buffer.add(tx);
                };
            };
        };

        return Buffer.toArray(buffer);
    };

    public query func getTransactionsWithRevenueByOwner(owner : Principal) : async [TransactionWithRevenue] {
        let buffer = Buffer.Buffer<TransactionWithRevenue>(0);

        // Iterate through all revenues to find transactions for this owner
        for ((id, revenue) in revenues.entries()) {
            for (tx in revenue.distributionTxs.vals()) {
                if (tx.recipient.owner == owner) {
                    buffer.add({
                        transaction = tx;
                        revenue = revenue;
                    });
                };
            };
        };

        return Buffer.toArray(buffer);
    };
    // Admin functions
    public shared (msg) func setAdminPrincipal(newAdmin : Principal) : async Result.Result<(), RevenueError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        admin := newAdmin;
        return #ok();
    };

};
