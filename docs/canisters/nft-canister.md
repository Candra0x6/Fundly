# NFT Canister

## Overview

The NFT Canister implements the ICRC-7 standard for non-fungible tokens with additional functionality for revenue sharing. It enables MSMEs to create, manage, and sell NFTs that represent a percentage of their future revenue.

## Key Features

- **ICRC-7 Compliance**: Implements the standard interface for non-fungible tokens
- **Revenue Share Definition**: NFTs include metadata for revenue share percentages
- **NFT Marketplace**: Built-in functionality for listing and selling NFTs
- **Revenue Distribution Tracking**: Records of revenue distribution to token holders
- **MSME Integration**: Links NFTs to MSME profiles

## Types

### NFT

```motoko
public type NFT = {
    id : TokenId;
    owner : Account;
    metadata : ICRC7TokenMetadata;
    minted_at : Time.Time;
    last_transferred_at : ?Time.Time;
};
```

### ICRC7TokenMetadata

```motoko
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
```

### DistributionRecord

```motoko
public type DistributionRecord = {
    tokenId : TokenId;
    amount : Nat;
    timestamp : Time.Time;
    msmeId : Text;
};
```

## Public Functions

### ICRC-7 Standard Functions

- `icrc7_name() : async Text`
- `icrc7_symbol() : async Text`
- `icrc7_total_supply() : async Nat`
- `icrc7_description() : async ?Text`
- `icrc7_logo() : async ?Text`
- `icrc7_metadata() : async [(Text, Text)]`
- `icrc7_token_metadata(token_id : TokenId) : async ?ICRC7TokenMetadata`
- `icrc7_owner_of(token_id : TokenId) : async ?Account`
- `icrc7_balance_of(account : Account) : async Nat`
- `icrc7_transfer(args : TransferArgs) : async Result.Result<TransactionId, TransferError>`

### Revenue Share NFT Functions

- `mintRevenueShareNFT(name : Text, description : Text, msmeId : Text, revenueShare : Nat, image : Types.Document, role : Types.UserRole, price : Nat) : async Result.Result<TokenId, Text>`
- `getNFTsByMSME(msmeId : Text) : async Result.Result<[NFT], Types.Error>`
- `getMSMEIdByTokenId(tokenId : TokenId) : async Result.Result<Text, Text>`
- `recordDistribution(tokenId : TokenId, amount : Nat, msmeId : Text) : async Result.Result<(), Text>`
- `getDistributionHistory(tokenId : TokenId) : async [DistributionRecord]`
- `getRevenueShare(tokenId : TokenId) : async ?Nat`

### Marketplace Functions

- `getAllListingsIds() : async [(TokenId, Nat)]`
- `cancelListing(tokenId : TokenId) : async Result.Result<(), Text>`
- `getListingPrice(tokenId : TokenId) : async ?Nat`
- `buyNFT(tokenId : TokenId) : async Result.Result<TransactionId, Text>`
- `getAllListingsWithDetails() : async [{ tokenId : TokenId; price : Nat; nft : NFT; msmeData : ?Types.MSME }]`

## State Management

The NFT Canister uses several hashmap data structures to manage its state:

- `tokens`: Maps token IDs to NFT objects
- `ownerships`: Maps principals to arrays of token IDs they own
- `transactions`: Maps transaction IDs to transaction records
- `msmeToTokens`: Maps MSME IDs to arrays of token IDs they created
- `distributionRecords`: Maps token IDs to arrays of distribution records
- `listings`: Maps token IDs to their listing prices (marketplace)

## Inter-Canister Communication

The NFT Canister interacts with:

- **MSME Registration Canister**: To fetch MSME details for NFT metadata
- **Token Canister**: To handle token transfers when NFTs are bought and sold

## Examples

### Minting a Revenue Share NFT

```motoko
let result = await NFTCanister.mintRevenueShareNFT(
    "Coffee Shop Revenue Share", 
    "5% of monthly revenue from Downtown Coffee Shop",
    "MSME-42",
    500, // 5% in basis points
    { id = "img1", ... }, // image document
    #MSME, // user role
    10_000, // price in tokens
);
```

### Buying an NFT

```motoko
let result = await NFTCanister.buyNFT(42);
```

### Recording Revenue Distribution

```motoko
let result = await NFTCanister.recordDistribution(
    42, // tokenId
    1000, // amount of tokens distributed
    "MSME-42" // MSME ID
);
``` 