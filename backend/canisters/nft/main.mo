// ICRC-7 NFT Canister for Revenue Share Tokens
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "../../types/lib";
import Buffer "mo:base/Buffer";
// Import canister for token interaction
import IC "mo:base/ExperimentalInternetComputer";
import Debug "mo:base/Debug";
import MSMECanister "canister:msme_registration";
import TokenCanister "canister:token_canister";
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
        royalties : Nat; // Percentage in basis points (e.g., 500 = 5%)
        image : Types.Document; // URL/Asset canister reference
        price : Nat;
    };

    public type ICRC7TokenMetadata = {
        name : Text;
        description : Text;
        symbol : Text;
        royalties : Nat;
        image : Types.Document;
        price : Nat;
        // Additional custom fields for revenue share NFTs
        msmeId : Text;
        revenueShare : Nat; // Percentage of revenue in basis points (100 = 1%)
    };

    public type TransactionId = Nat;

    public type NftTx = {
        id : TransactionId;
        timestamp : Time.Time;
        tokenId : TokenId;
        from : Account;
        to : Account;
        memo : ?Blob;
        category : Text;
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

    // Marketplace related types
    public type TokenCanisterActor = actor {
        icrc1_transfer : shared (TokenTransferArgs) -> async Result.Result<Nat, TokenTransferError>;
    };

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

    public type Memo = Blob;

    public type TokenTransferError = {
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
    private stable var nextTokenId : TokenId = 0;
    private stable var nextTransactionId : TransactionId = 0;
    private stable var totalMinted : Nat = 0;
    private stable var totalSupply : Nat = 0;
    private stable var name : Text = "ImpactInvest Revenue Share";
    private stable var symbol : Text = "IRS";

    // Storage
    private var tokens = HashMap.HashMap<TokenId, NFT>(0, Nat.equal, Hash.hash);
    private var ownerships = HashMap.HashMap<Principal, [TokenId]>(0, Principal.equal, Principal.hash);
    private var transactions = HashMap.HashMap<TransactionId, NftTx>(0, Nat.equal, Hash.hash);
    private var msmeToTokens = HashMap.HashMap<Text, [TokenId]>(0, Text.equal, Text.hash);
    private var distributionRecords = HashMap.HashMap<TokenId, [DistributionRecord]>(0, Nat.equal, Hash.hash);

    // NFT Marketplace Data Structure
    private var listings = HashMap.HashMap<TokenId, Nat>(0, Nat.equal, Hash.hash); // TokenId -> Price

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
                let transaction : NftTx = {
                    id = txId;
                    timestamp = Time.now();
                    tokenId = args.token_id;
                    from = from;
                    to = args.to;
                    memo = args.memo;
                    category = "nftTx";
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
        image : Types.Document,
        role : Types.UserRole,
        price : Nat,
    ) : async Result.Result<TokenId, Text> {

        if (role != #MSME) {
            return #err("Only MSME can mint revenue share NFTs");
        };

        if (revenueShare > 3000) {
            // Max 30% (3000 basis points)
            return #err("Invalid revenue share percentage: must be between 0 and 3000 (30%)");
        };

        let tokenId = nextTokenId;

        let metadata : ICRC7TokenMetadata = {
            name = name;
            description = description;
            symbol = symbol;
            royalties = 500; // 5% royalty on secondary sales
            image = image;
            msmeId = msmeId;
            revenueShare = revenueShare;
            price = price;
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

        // List NFT for sale
        listings.put(tokenId, price);

        return #ok(tokenId);
    };

    // Get all tokens associated with an MSME
    public query func getNFTsByMSME(msmeId : Text) : async Result.Result<[NFT], Types.Error> {
        switch (msmeToTokens.get(msmeId)) {
            case (?tokenIds) {
                let nfts = Buffer.Buffer<NFT>(tokenIds.size());
                for (tokenId in tokenIds.vals()) {
                    switch (tokens.get(tokenId)) {
                        case (?token) {
                            nfts.add(token);
                        };
                        case null {};
                    };
                };
                return #ok(Buffer.toArray(nfts));
            };
            case null { return #err(#NotFound) };
        };
    };
    public query func getMSMEIdByTokenId(tokenId : TokenId) : async Result.Result<Text, Text> {
        switch (tokens.get(tokenId)) {
            case (?token) { return #ok(token.metadata.msmeId) };
            case null { return #err("Token does not exist") };
        };
    };

    public query func getAllListingsIds() : async [(TokenId, Nat)] {
        return Iter.toArray(listings.entries());
    };
    // Record revenue distribution for a token
    public shared (msg) func recordDistribution(
        tokenId : TokenId,
        amount : Nat,
        msmeId : Text,
    ) : async Result.Result<(), Text> {

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

    // System functions for canister management
    system func preupgrade() {
        // Save state before upgrade if needed
    };

    system func postupgrade() {
        // Restore state after upgrade if needed
    };

    // Remove NFT from sale listings
    public shared (msg) func cancelListing(tokenId : TokenId) : async Result.Result<(), Text> {
        // Check token exists and caller is owner
        switch (tokens.get(tokenId)) {
            case null { return #err("Token does not exist") };
            case (?token) {
                if (token.owner.owner != msg.caller) {
                    return #err("Only the owner can cancel the listing");
                };

                // Remove from listings
                listings.delete(tokenId);
                return #ok();
            };
        };
    };

    // Get NFT listing price
    public query func getListingPrice(tokenId : TokenId) : async ?Nat {
        return listings.get(tokenId);
    };
    // Get all MSME NFTs with their metadata
    // Define the MSME canister actor interface if not already defined

    // Get all NFTs with their corresponding MSME data
    // Similarly, refactor getAllMSMENFTsWithMSMEData
    public func getAllMSMENFTsWithMSMEData() : async [{
        nft : NFT;
        msmeData : ?Types.MSME;
    }] {
        let buffer = Buffer.Buffer<{ nft : NFT; msmeData : ?Types.MSME }>(tokens.size());

        // Collect all unique MSME IDs
        let msmeIds = HashMap.HashMap<Text, Bool>(32, Text.equal, Text.hash);

        for ((_, token) in tokens.entries()) {
            msmeIds.put(token.metadata.msmeId, true);
        };

        // Fetch all MSME data in advance
        let msmeDataMap = HashMap.HashMap<Text, Types.MSME>(32, Text.equal, Text.hash);

        for ((msmeId, _) in msmeIds.entries()) {
            try {
                let result = await MSMECanister.getMSME(msmeId);
                switch (result) {
                    case (#ok(msmeData)) {
                        msmeDataMap.put(msmeId, msmeData);
                    };
                    case (#err(_)) {
                        // Continue if MSME not found
                    };
                };
            } catch (_) {
                // Continue if call fails
            };
        };

        // Now combine NFTs with their MSME data
        for ((_, token) in tokens.entries()) {
            let msmeData = msmeDataMap.get(token.metadata.msmeId);
            buffer.add({
                nft = token;
                msmeData = msmeData;
            });
        };

        return Buffer.toArray(buffer);
    };

    // Get NFTs for a specific MSME with MSME data
    public func getNFTsWithMSMEData(msmeId : Text) : async Result.Result<{ nfts : [NFT]; msmeData : Types.MSME }, Text> {
        // First get all NFTs for this MSME ID
        switch (msmeToTokens.get(msmeId)) {
            case null {
                return #err("No NFTs found for the specified MSME");
            };
            case (?tokenIds) {
                let nfts = Buffer.Buffer<NFT>(tokenIds.size());
                for (tokenId in tokenIds.vals()) {
                    switch (tokens.get(tokenId)) {
                        case (?token) {
                            nfts.add(token);
                        };
                        case null {};
                    };
                };

                // Get the MSME data
                try {
                    let msmeResult = await MSMECanister.getMSME(msmeId);

                    switch (msmeResult) {
                        case (#ok(msmeData)) {
                            return #ok({
                                nfts = Buffer.toArray(nfts);
                                msmeData = msmeData;
                            });
                        };
                        case (#err(error)) {
                            return #err("Error retrieving MSME data: " # debug_show (error));
                        };
                    };
                } catch (e) {
                    return #err("Inter-canister call failed: " # Error.message(e));
                };
            };
        };
    };
    // Get all listed NFTs
    // Get all listed NFTs with full details and MSME data
    // Improved version of getAllListingsWithDetails with better error handling
    public func getAllListingsWithDetails() : async [{
        tokenId : TokenId;
        price : Nat;
        nft : NFT;
        msmeData : ?Types.MSME;
    }] {
        let buffer = Buffer.Buffer<{ tokenId : TokenId; price : Nat; nft : NFT; msmeData : ?Types.MSME }>(listings.size());

        // Debug: print listings size
        Debug.print("Listings size: " # debug_show (listings.size()));

        // If there are no listings, return empty array early
        if (listings.size() == 0) {
            Debug.print("No listings found");
            return [];
        };

        // Collect all unique MSME IDs from listed tokens
        let msmeIds = HashMap.HashMap<Text, Bool>(32, Text.equal, Text.hash);

        for ((tokenId, price) in listings.entries()) {
            switch (tokens.get(tokenId)) {
                case (?token) {
                    Debug.print("Found token: " # debug_show (tokenId));
                    msmeIds.put(token.metadata.msmeId, true);
                };
                case null {
                    Debug.print("Token not found for listing: " # debug_show (tokenId));
                };
            };
        };

        // Debug: print unique MSME IDs
        Debug.print("Unique MSME IDs: " # debug_show (msmeIds.size()));

        // Fetch all MSME data in advance
        let msmeDataMap = HashMap.HashMap<Text, Types.MSME>(32, Text.equal, Text.hash);

        for ((msmeId, _) in msmeIds.entries()) {
            Debug.print("Fetching MSME data for: " # msmeId);
            try {
                let result = await MSMECanister.getMSME(msmeId);
                switch (result) {
                    case (#ok(msmeData)) {
                        Debug.print("MSME data found for: " # msmeId);
                        msmeDataMap.put(msmeId, msmeData);
                    };
                    case (#err(error)) {
                        Debug.print("MSME not found: " # msmeId # ", error: " # debug_show (error));
                    };
                };
            } catch (e) {
                Debug.print("Error calling MSME canister: " # Error.message(e));
            };
        };

        // Combine listing info, NFT details, and MSME data
        for ((tokenId, price) in listings.entries()) {
            switch (tokens.get(tokenId)) {
                case (?token) {
                    let msmeData = msmeDataMap.get(token.metadata.msmeId);
                    buffer.add({
                        tokenId = tokenId;
                        price = price;
                        nft = token;
                        msmeData = msmeData;
                    });
                    Debug.print("Added listing to result: " # debug_show (tokenId));
                };
                case null {
                    Debug.print("Skipping listing with missing token: " # debug_show (tokenId));
                };
            };
        };

        Debug.print("Final buffer size: " # debug_show (buffer.size()));
        return Buffer.toArray(buffer);
    };
    // Buy NFT with token transfer
    public shared (msg) func buyNFT(
        tokenId : TokenId
    ) : async Result.Result<TransactionId, Text> {
        // Check token exists and is listed
        switch (tokens.get(tokenId)) {
            case null { return #err("Token does not exist") };
            case (?token) {
                switch (listings.get(tokenId)) {
                    case null { return #err("Token is not listed for sale") };
                    case (?price) {
                        // Prepare accounts
                        let buyer : Account = {
                            owner = msg.caller;
                            subaccount = null;
                        };

                        let seller : Account = token.owner;

                        // Create token canister actor

                        // Prepare token transfer arguments
                        let transferArgs : TokenTransferArgs = {
                            from_subaccount = null;
                            to = seller;
                            from = buyer;
                            amount = price;
                            fee = null;
                            memo = null;
                            created_at_time = null;
                        };

                        // Transfer tokens from buyer to seller
                        try {
                            let transferResult = await TokenCanister.icrc_spesific_transfer(transferArgs);

                            switch (transferResult) {
                                case (#err(e)) {
                                    return #err("Token transfer failed: " # debug_show (e));
                                };
                                case (#ok(_)) {
                                    // Token transfer succeeded, now transfer NFT ownership
                                    // Use existing transfer function with caller override
                                    // The transfer has to be initiated by the seller (current owner)
                                    let nftTransferArgs : TransferArgs = {
                                        token_id = tokenId;
                                        from_subaccount = null;
                                        to = buyer;
                                        memo = null;
                                        created_at_time = null;
                                    };

                                    // We need to manually transfer the NFT since icrc7_transfer requires
                                    // the caller to be the token owner (which would be the seller)
                                    switch (tokens.get(tokenId)) {
                                        case null {
                                            return #err("Token no longer exists");
                                        };
                                        case (?nft) {
                                            if (nft.owner.owner != seller.owner) {
                                                return #err("Seller no longer owns the NFT");
                                            };

                                            // Update token ownership
                                            let updatedToken : NFT = {
                                                id = nft.id;
                                                owner = buyer;
                                                metadata = nft.metadata;
                                                minted_at = nft.minted_at;
                                                last_transferred_at = ?Time.now();
                                            };

                                            tokens.put(tokenId, updatedToken);

                                            // Update ownerships
                                            _removeTokenFromOwner(seller.owner, tokenId);
                                            _addTokenToOwner(buyer.owner, tokenId);

                                            // Record transaction
                                            let txId = nextTransactionId;
                                            let transaction : NftTx = {
                                                id = txId;
                                                timestamp = Time.now();
                                                tokenId = tokenId;
                                                from = seller;
                                                to = buyer;
                                                memo = null;
                                                category = "nftTx";
                                            };

                                            transactions.put(txId, transaction);
                                            nextTransactionId += 1;

                                            // Remove from listings
                                            listings.delete(tokenId);

                                            return #ok(txId);
                                        };
                                    };
                                };
                            };
                        } catch (e) {
                            return #err("Error calling token canister: " # Error.message(e));
                        };
                    };
                };
            };
        };
    };

    public func getTransactionsByOwner(owner : Principal) : async [{
        transaction : NftTx;
    }] {
        let buffer = Buffer.Buffer<{ transaction : NftTx }>(transactions.size());
        for ((_, transaction) in transactions.entries()) {
            if (transaction.from.owner == owner) {
                buffer.add({ transaction = transaction });
            };
        };
        return Buffer.toArray(buffer);
    };

    // Get all NFTs owned by a specific user with MSME data
    public func getNFTsByOwnerWithMSMEData(owner : Principal) : async [{
        nft : NFT;
        msmeData : ?Types.MSME;
    }] {
        // Get all tokens owned by this user
        let ownerTokens = switch (ownerships.get(owner)) {
            case (?tokenIds) { tokenIds };
            case null { [] };
        };

        let buffer = Buffer.Buffer<{ nft : NFT; msmeData : ?Types.MSME }>(ownerTokens.size());

        // Collect unique MSME IDs for batch fetching
        let msmeIds = HashMap.HashMap<Text, Bool>(32, Text.equal, Text.hash);

        for (tokenId in ownerTokens.vals()) {
            switch (tokens.get(tokenId)) {
                case (?token) {
                    msmeIds.put(token.metadata.msmeId, true);
                };
                case null {};
            };
        };

        // Fetch all MSME data in advance
        let msmeDataMap = HashMap.HashMap<Text, Types.MSME>(32, Text.equal, Text.hash);

        for ((msmeId, _) in msmeIds.entries()) {
            try {
                let result = await MSMECanister.getMSME(msmeId);
                switch (result) {
                    case (#ok(msmeData)) {
                        msmeDataMap.put(msmeId, msmeData);
                    };
                    case (#err(_)) {
                        // Continue if MSME not found
                    };
                };
            } catch (_) {
                // Continue if call fails
            };
        };

        // Now combine NFTs with their MSME data
        for (tokenId in ownerTokens.vals()) {
            switch (tokens.get(tokenId)) {
                case (?token) {
                    let msmeData = msmeDataMap.get(token.metadata.msmeId);
                    buffer.add({
                        nft = token;
                        msmeData = msmeData;
                    });
                };
                case null {};
            };
        };

        return Buffer.toArray(buffer);
    };
    // Helper function to convert token error to text
    private func _tokenErrorToText(e : TokenTransferError) : Text {
        switch (e) {
            case (#BadFee(_)) { "Incorrect fee" };
            case (#BadBurn(_)) { "Invalid burn amount" };
            case (#InsufficientFunds(_)) { "Insufficient funds" };
            case (#TooOld) { "Transaction too old" };
            case (#CreatedInFuture(_)) { "Transaction created in future" };
            case (#Duplicate(_)) { "Duplicate transaction" };
            case (#TemporarilyUnavailable) { "Service temporarily unavailable" };
            case (#GenericError(e)) { e.message };
        };
    };

    // Helper function to convert NFT error to text
    private func _nftErrorToText(e : TransferError) : Text {
        switch (e) {
            case (#NonExistingTokenId(_)) { "Token does not exist" };
            case (#Unauthorized) { "Unauthorized transfer" };
            case (#InvalidRecipient) { "Invalid recipient" };
            case (#Rejected) { "Transfer rejected" };
            case (#TooOld) { "Transaction too old" };
            case (#CreatedInFuture(_)) { "Transaction created in future" };
        };
    };
};
