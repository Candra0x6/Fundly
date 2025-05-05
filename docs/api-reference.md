# API Reference

This document provides a concise reference to the main public functions of each canister in the ImpactInvest platform.

## Authentication Canister

### User Management
- `registerUser(username : Text, email : Text, initialRole : UserRole) : async Result.Result<UserProfile, AuthError>`
- `getMyProfile() : async Result.Result<UserProfile, AuthError>`
- `updateProfile(username : Text, email : Text, image : ?Types.Document) : async Result.Result<UserProfile, AuthError>`

### Session Management
- `login(email : Text) : async Result.Result<Text, AuthError>`
- `logout(sessionId : Text) : async Result.Result<(), AuthError>`
- `validateSession(sessionId : Text) : async Result.Result<Principal, AuthError>`

### Role Management
- `addRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError>`
- `removeRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError>`
- `hasRole(principal : Principal, role : UserRole) : async Bool`
- `isAdmin(principal : Principal) : async Bool`
- `isMSME(principal : Principal) : async Bool`
- `isInvestor(principal : Principal) : async Bool`
- `isVerifier(principal : Principal) : async Bool`

## MSME Registration Canister

### Registration and Profile
- `registerMSME(args : MSMERegistrationArgs, role : Types.UserRole) : async Result.Result<Text, Types.MSMEError>`
- `getMSME(id : Text) : async Result.Result<Types.MSME, Types.MSMEError>`
- `getOwnedMSMEs(owner : Principal) : async [Text]`
- `updateMSMEProfile(id : Text, args : MSMEUpdateArgs) : async Result.Result<(), Types.MSMEError>`

### Document Management
- `addDocument(msmeId : Text, name : Text, docType : Types.DocumentType, assetId : Text) : async Result.Result<Text, Types.MSMEError>`
- `updatedDocumentVerified(msmeId : Text, documentId : Text, verified : Bool) : async Result.Result<(), Types.MSMEError>`

### Verification
- `requestVerification(msmeId : Text) : async Result.Result<(), Types.MSMEError>`
- `updateVerificationStatus(msmeId : Text, status : Types.VerificationStatus) : async Result.Result<(), Types.MSMEError>`

### Admin Functions
- `registerVerifier(verifier : Principal, name : Text, specialization : [Text], verificationLevel : Nat) : async Result.Result<(), Types.MSMEError>`
- `setAssetCanisterId(canisterId : Text) : async Result.Result<(), Types.MSMEError>`
- `setVerificationCanisterId(canisterId : Text) : async Result.Result<(), Types.MSMEError>`

## NFT Canister

### ICRC-7 Standard Functions
- `icrc7_name() : async Text`
- `icrc7_symbol() : async Text`
- `icrc7_total_supply() : async Nat`
- `icrc7_token_metadata(token_id : TokenId) : async ?ICRC7TokenMetadata`
- `icrc7_owner_of(token_id : TokenId) : async ?Account`
- `icrc7_balance_of(account : Account) : async Nat`
- `icrc7_transfer(args : TransferArgs) : async Result.Result<TransactionId, TransferError>`

### Revenue Share NFT Functions
- `mintRevenueShareNFT(name : Text, description : Text, msmeId : Text, revenueShare : Nat, image : Types.Document, role : Types.UserRole, price : Nat) : async Result.Result<TokenId, Text>`
- `getNFTsByMSME(msmeId : Text) : async Result.Result<[NFT], Types.Error>`
- `recordDistribution(tokenId : TokenId, amount : Nat, msmeId : Text) : async Result.Result<(), Text>`
- `getDistributionHistory(tokenId : TokenId) : async [DistributionRecord]`
- `getRevenueShare(tokenId : TokenId) : async ?Nat`

### Marketplace Functions
- `getAllListingsIds() : async [(TokenId, Nat)]`
- `cancelListing(tokenId : TokenId) : async Result.Result<(), Text>`
- `getListingPrice(tokenId : TokenId) : async ?Nat`
- `buyNFT(tokenId : TokenId) : async Result.Result<TransactionId, Text>`
- `getAllListingsWithDetails() : async [{ tokenId : TokenId; price : Nat; nft : NFT; msmeData : ?Types.MSME }]`

## Token Canister

### ICRC-1 Standard Functions
- `icrc1_name() : async Text`
- `icrc1_symbol() : async Text`
- `icrc1_decimals() : async Nat8`
- `icrc1_fee() : async Nat`
- `icrc1_total_supply() : async Nat`
- `icrc1_balance_of(account : Account) : async Nat`
- `icrc1_transfer(args : TransferArgs) : async Result.Result<Nat, TransferError>`

### ICRC-2 Standard Functions
- `icrc2_approve(args : ApproveArgs) : async Result.Result<Nat, ApproveError>`
- `icrc2_allowance(args : { account : Account; spender : Account }) : async Allowance`
- `icrc2_transfer_from(args : TransferFromArgs) : async Result.Result<Nat, TransferError>`

### Custom Functions
- `mint(to : Account, amount : Nat) : async Result.Result<Nat, Text>`
- `burn(from : Account, amount : Nat) : async Result.Result<Nat, Text>`
- `getTransationByOwner(owner : Principal) : async [TokenTx]`
- `getRecentTransactions(limit : Nat) : async [TokenTx]`

## Revenue Reporting Canister

### Revenue Management
- `reportRevenue(msmeId : Text, amount : Nat, description : Text, document : Types.Document) : async Result.Result<Text, RevenueError>`
- `getRevenue(id : Text) : async ?Revenue`
- `getMSMERevenues(msmeId : Text) : async [Revenue]`

### Distribution Functions
- `distributeRevenue(revenueId : Text) : async Result.Result<Revenue, RevenueError>`
- `getDistributionDetails(revenueId : Text) : async Result.Result<[DistributionTx], RevenueError>`
- `getTransactionsByOwner(owner : Principal) : async [DistributionTx]`
- `getTransactionsWithRevenueByOwner(owner : Principal) : async [TransactionWithRevenue]`

## Verification Workflow Canister

### Officer Management
- `addVerificationOfficer(officerId : Principal, name : Text, department : Text) : async Result.Result<(), Error>`
- `removeVerificationOfficer(officerId : Principal) : async Result.Result<(), Error>`
- `getVerificationOfficers() : async [VerificationOfficer]`

### Verification Requests
- `createVerificationRequest(msmeId : MSMEID, documents : [Types.Document]) : async Result.Result<Text, Error>`
- `assignRequest(requestId : Text, officerId : Principal) : async Result.Result<(), Error>`
- `reviewDocument(requestId : Text, documentId : Text, status : Types.DocumentStatus) : async Result.Result<(), Error>`
- `updateVerificationStatus(requestId : Text, status : VerificationStatus, docStatus : Bool, documentId : Text) : async Result.Result<(), Error>`

### Query Functions
- `getVerificationRequest(requestId : Text) : async Result.Result<VerificationRequest, Error>`
- `getPendingVerificationRequests() : async [VerificationRequest]`
- `getRequestsAssignedToOfficer(officerId : Principal) : async [VerificationRequest]`
- `getRequestsForMSME(msmeId : MSMEID) : async [VerificationRequest]`
- `getAllRequestsWithMSMEDetails() : async [RequestWithMSMEDetails]` 