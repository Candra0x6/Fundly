// ICRC-7 NFT Canister for Revenue Share Tokens
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor RevenueShareNFT {
    // ICRC-7 Types
    public type Account = {
        owner : Principal;
        subaccount : ?Subaccount;
    };

    public type Subaccount = Blob;

    public type TokenId = Nat;

    public type Metadata = {
        name : Text;
        description : Text;
        symbol : Text;
        royalties : ?Nat; // Percentage in basis points (e.g., 500 = 5%)
        image : ?Text; // URL/Asset canister reference
    };

    public type ICRC7TokenMetadata = {
        name : Text;
        description : Text;
        symbol : Text;
        royalties : ?Nat;
        image : ?Text;
        // Additional custom fields for revenue share NFTs
        msmeId : Text;
        revenueShare : Nat; // Percentage of revenue in basis points (100 = 1%)
    };

    public type TransactionId = Nat;

    public type Transaction = {
        id : TransactionId;
        timestamp : Time.Time;
        tokenId : TokenId;
        from : Account;
        to : Account;
        memo : ?Blob;
    };

    public type TransferArgs = {
        token_id : TokenId;
        from_subaccount : ?Subaccount;
        to : Account;
        memo : ?Blob;
        created_at_time : ?Nat64;
    };

    public type TransferError = {
        #NonExistingTokenId : TokenId;
        #Unauthorized;
        #InvalidRecipient;
        #Rejected;
        #TooOld;
        #CreatedInFuture : { ledger_time : Nat64 };
    };

    // Custom NFT type with revenue sharing information
    public type NFT = {
        id : TokenId;
        owner : Account;
        metadata : ICRC7TokenMetadata;
        minted_at : Time.Time;
        last_transferred_at : ?Time.Time;
    };

    // Token distribution types for revenue sharing
    public type DistributionRecord = {
        tokenId : TokenId;
        amount : Nat;
        timestamp : Time.Time;
        msmeId : Text;
    };

    // State variables
    private stable var nextTokenId : TokenId = 0;
    private stable var nextTransactionId : TransactionId = 0;
    private stable var owner : Principal = Principal.fromText("aaaaa-aa"); // Will be set to proper admin principal
    private stable var totalMinted : Nat = 0;
    private stable var totalSupply : Nat = 0;
    private stable var name : Text = "ImpactInvest Revenue Share";
    private stable var symbol : Text = "IRS";

    // Storage
    private var tokens = HashMap.HashMap<TokenId, NFT>(0, Nat.equal, Hash.hash);
    private var ownerships = HashMap.HashMap<Principal, [TokenId]>(0, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<TransactionId, Transaction>(0, Nat.equal, Hash.hash);
    private var msmeToTokens = HashMap.HashMap<Text, [TokenId]>(0, Text.equal, Text.hash);
    private var distributionRecords = HashMap.HashMap<TokenId, [DistributionRecord]>(0, Nat.equal, Hash.hash);

    // ICRC-7 Standard functions
    public query func icrc7_name() : async Text {
        return name;
    };

    public query func icrc7_symbol() : async Text {
        return symbol;
    };

    public query func icrc7_total_supply() : async Nat {
        return totalSupply;
    };

    public query func icrc7_description() : async ?Text {
        return ?"Revenue Sharing NFTs for MSMEs on the ImpactInvest Platform";
    };

    public query func icrc7_logo() : async ?Text {
        return ?"https://example.com/logo.png"; // Placeholder to be updated
    };

    public query func icrc7_metadata() : async [(Text, Text)] {
        return [
            ("name", name),
            ("symbol", symbol),
            ("description", "Revenue Sharing NFTs for MSMEs on the ImpactInvest Platform"),
            ("standard", "ICRC-7"),
        ];
    };

    // Get full token metadata
    public query func icrc7_token_metadata(token_id : TokenId) : async ?ICRC7TokenMetadata {
        switch (tokens.get(token_id)) {
            case (?token) { return ?token.metadata };
            case null { return null };
        };
    };

    // Get token owner
    public query func icrc7_owner_of(token_id : TokenId) : async ?Account {
        switch (tokens.get(token_id)) {
            case (?token) { return ?token.owner };
            case null { return null };
        };
    };

    // Get tokens owned by account
    public query func icrc7_balance_of(account : Account) : async Nat {
        let ownerTokens = switch (ownerships.get(account.owner)) {
            case (?tokenIds) { tokenIds };
            case null { [] };
        };
        return ownerTokens.size();
    };

    // Transfer token
    public shared (msg) func icrc7_transfer(args : TransferArgs) : async Result.Result<TransactionId, TransferError> {
        let from = { owner = msg.caller; subaccount = args.from_subaccount };

        // Check token exists
        switch (tokens.get(args.token_id)) {
            case null { return #err(#NonExistingTokenId(args.token_id)) };
            case (?token) {
                // Verify ownership
                if (not _isAuthorized(token.owner, from)) {
                    return #err(#Unauthorized);
                };

                // Check valid recipient
                if (Principal.isAnonymous(args.to.owner)) {
                    return #err(#InvalidRecipient);
                };

                // Update token ownership
                let updatedToken : NFT = {
                    id = token.id;
                    owner = args.to;
                    metadata = token.metadata;
                    minted_at = token.minted_at;
                    last_transferred_at = ?Time.now();
                };

                tokens.put(args.token_id, updatedToken);

                // Update ownerships
                _removeTokenFromOwner(token.owner.owner, args.token_id);
                _addTokenToOwner(args.to.owner, args.token_id);

                // Record transaction
                let txId = nextTransactionId;
                let transaction : Transaction = {
                    id = txId;
                    timestamp = Time.now();
                    tokenId = args.token_id;
                    from = from;
                    to = args.to;
                    memo = args.memo;
                };

                transactions.put(txId, transaction);
                nextTransactionId += 1;

                return #ok(txId);
            };
        };
    };

    // ImpactInvest specific functions

    // Mint a new revenue share NFT
    public shared (msg) func mintRevenueShareNFT(
        name : Text,
        description : Text,
        msmeId : Text,
        revenueShare : Nat,
        image : ?Text,
    ) : async Result.Result<TokenId, Text> {
        // Only allow authorized minting (can be expanded with more complex permissions)
        if (msg.caller != owner) {
            return #err("Unauthorized: Only the canister owner can mint tokens");
        };

        if (revenueShare > 10000) {
            // Max 100% (10000 basis points)
            return #err("Invalid revenue share percentage: must be between 0 and 10000 (100%)");
        };

        let tokenId = nextTokenId;

        let metadata : ICRC7TokenMetadata = {
            name = name;
            description = description;
            symbol = symbol;
            royalties = ?500; // 5% royalty on secondary sales
            image = image;
            msmeId = msmeId;
            revenueShare = revenueShare;
        };

        let ownerAccount : Account = {
            owner = msg.caller;
            subaccount = null;
        };

        let token : NFT = {
            id = tokenId;
            owner = ownerAccount;
            metadata = metadata;
            minted_at = Time.now();
            last_transferred_at = null;
        };

        // Store token
        tokens.put(tokenId, token);
        nextTokenId += 1;
        totalMinted += 1;
        totalSupply += 1;

        // Update ownership
        _addTokenToOwner(msg.caller, tokenId);

        // Track tokens by MSME
        _addTokenToMSME(msmeId, tokenId);

        return #ok(tokenId);
    };

    // Get all tokens associated with an MSME
    public query func getTokensByMSME(msmeId : Text) : async [TokenId] {
        switch (msmeToTokens.get(msmeId)) {
            case (?tokenIds) { return tokenIds };
            case null { return [] };
        };
    };

    // Record revenue distribution for a token
    public shared (msg) func recordDistribution(
        tokenId : TokenId,
        amount : Nat,
        msmeId : Text,
    ) : async Result.Result<(), Text> {
        // Verify caller is authorized (this should be restricted to the revenue distribution canister)
        if (msg.caller != owner) {
            return #err("Unauthorized");
        };

        // Check token exists
        switch (tokens.get(tokenId)) {
            case null { return #err("Token does not exist") };
            case (?token) {
                // Verify MSME ID matches
                if (token.metadata.msmeId != msmeId) {
                    return #err("MSME ID mismatch");
                };

                let record : DistributionRecord = {
                    tokenId = tokenId;
                    amount = amount;
                    timestamp = Time.now();
                    msmeId = msmeId;
                };

                // Add to distribution records
                switch (distributionRecords.get(tokenId)) {
                    case (?records) {
                        let newRecords = Array.append(records, [record]);
                        distributionRecords.put(tokenId, newRecords);
                    };
                    case null {
                        distributionRecords.put(tokenId, [record]);
                    };
                };

                return #ok();
            };
        };
    };

    // Get distribution history for a token
    public query func getDistributionHistory(tokenId : TokenId) : async [DistributionRecord] {
        switch (distributionRecords.get(tokenId)) {
            case (?records) { return records };
            case null { return [] };
        };
    };

    // Calculate total distributions for a token
    public query func getTotalDistributed(tokenId : TokenId) : async Nat {
        var total = 0;
        switch (distributionRecords.get(tokenId)) {
            case (?records) {
                for (record in records.vals()) {
                    total += record.amount;
                };
            };
            case null {};
        };
        return total;
    };

    // Helper function to check revenue share for a token
    public query func getRevenueShare(tokenId : TokenId) : async ?Nat {
        switch (tokens.get(tokenId)) {
            case (?token) { return ?token.metadata.revenueShare };
            case null { return null };
        };
    };

    // Helper functions
    private func _isAuthorized(tokenOwner : Account, caller : Account) : Bool {
        if (tokenOwner.owner == caller.owner) {
            // Handle subaccounts if necessary
            switch (tokenOwner.subaccount, caller.subaccount) {
                case (null, _) { return true };
                case (_, null) { return false };
                case (?t_subaccount, ?c_subaccount) {
                    return t_subaccount == c_subaccount;
                };
            };
        };
        return false;
    };

    private func _addTokenToOwner(owner : Principal, tokenId : TokenId) {
        switch (ownerships.get(owner)) {
            case (?tokenIds) {
                let newTokenIds = Array.append(tokenIds, [tokenId]);
                ownerships.put(owner, newTokenIds);
            };
            case null {
                ownerships.put(owner, [tokenId]);
            };
        };
    };

    private func _removeTokenFromOwner(owner : Principal, tokenId : TokenId) {
        switch (ownerships.get(owner)) {
            case (?tokenIds) {
                let newTokenIds = Array.filter(tokenIds, func(id : TokenId) : Bool { id != tokenId });
                ownerships.put(owner, newTokenIds);
            };
            case null {};
        };
    };

    private func _addTokenToMSME(msmeId : Text, tokenId : TokenId) {
        switch (msmeToTokens.get(msmeId)) {
            case (?tokenIds) {
                let newTokenIds = Array.append(tokenIds, [tokenId]);
                msmeToTokens.put(msmeId, newTokenIds);
            };
            case null {
                msmeToTokens.put(msmeId, [tokenId]);
            };
        };
    };

    // Admin functions
    public shared (msg) func setCanisterOwner(newOwner : Principal) : async Result.Result<(), Text> {
        if (msg.caller != owner) {
            return #err("Unauthorized");
        };

        owner := newOwner;
        return #ok();
    };

    // System functions for canister management
    system func preupgrade() {
        // Save state before upgrade if needed
    };

    system func postupgrade() {
        // Restore state after upgrade if needed
    };
};
