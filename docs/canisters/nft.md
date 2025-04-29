# NFT Canister Documentation

## Overview

The NFT Canister implements the ICRC-7 standard to provide non-fungible tokens representing revenue share agreements with MSMEs. These NFTs allow investors to purchase a percentage of future revenue from MSMEs on the platform.

## Standards Implementation

- **ICRC-7**: Non-fungible token standard for the Internet Computer

## Key Features

- Revenue-sharing NFTs with specified revenue percentages
- Royalties on secondary sales (default 5%)
- Token metadata including MSME information
- Ownership and transfer management
- Revenue distribution tracking

## Data Models

### Account

```motoko
public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
};
```

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
    royalties : ?Nat;
    image : ?Text;
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

## Public API Methods

### ICRC-7 Standard Methods

#### Token Metadata

```motoko
icrc7_name() : async Text
icrc7_symbol() : async Text
icrc7_total_supply() : async Nat
icrc7_description() : async ?Text
icrc7_logo() : async ?Text
icrc7_metadata() : async [(Text, Text)]
```

#### Token Information

```motoko
icrc7_token_metadata(token_id : TokenId) : async ?ICRC7TokenMetadata
icrc7_owner_of(token_id : TokenId) : async ?Account
icrc7_balance_of(account : Account) : async Nat
```

#### Transfer

```motoko
icrc7_transfer(args : TransferArgs) : async Result.Result<TransactionId, TransferError>
```

### Custom Methods

#### Mint NFT

```motoko
mintRevenueShareNFT(
    name : Text,
    description : Text,
    msmeId : Text,
    revenueShare : Nat,
    image : ?Text,
) : async Result.Result<TokenId, Text>
```

#### Revenue Share Management

```motoko
getTokensByMSME(msmeId : Text) : async [TokenId]
getRevenueShare(tokenId : TokenId) : async ?Nat
```

#### Distribution Tracking

```motoko
recordDistribution(
    tokenId : TokenId,
    amount : Nat,
    msmeId : Text
) : async Result.Result<(), Text>

getDistributionHistory(tokenId : TokenId) : async [DistributionRecord]
getTotalDistributed(tokenId : TokenId) : async Nat
```

#### Admin Functions

```motoko
setCanisterOwner(newOwner : Principal) : async Result.Result<(), Text>
```

## Usage Examples

### Minting a Revenue Share NFT

```motoko
// Only authorized MSMEs can mint NFTs
let result = await RevenueShareNFT.mintRevenueShareNFT(
    "Coffee Shop Revenue Share",
    "5% revenue share from Downtown Coffee House",
    "MSME123456",
    500, // 5% revenue share (in basis points)
    ?"https://example.com/nft-image.png"
);

switch (result) {
    case (#ok(tokenId)) {
        // NFT minted successfully, tokenId contains the new NFT ID
    };
    case (#err(errorMessage)) {
        // Error occurred during minting
    };
}
```

### Transferring an NFT

```motoko
let transferResult = await RevenueShareNFT.icrc7_transfer({
    token_id = 123;
    from_subaccount = null;
    to = { owner = recipientPrincipal; subaccount = null };
    memo = ?Text.encodeUtf8("Gift");
    created_at_time = null;
});
```

### Recording Revenue Distribution

```motoko
// Called by the revenue distribution system
let recordResult = await RevenueShareNFT.recordDistribution(
    123, // tokenId
    1_000_000_000, // amount in token base units
    "MSME123456" // msmeId
);
```

### Getting Distribution History

```motoko
// Get all distributions for a specific token
let distributions = await RevenueShareNFT.getDistributionHistory(123);

// Get total amount distributed for a token
let totalDistributed = await RevenueShareNFT.getTotalDistributed(123);
```

## Implementation Details

### Storage

The NFT state is stored in several data structures:

- `tokens`: Maps token IDs to NFT objects
- `ownerships`: Maps principals to arrays of token IDs they own
- `transactions`: Records transfer transactions
- `msmeToTokens`: Maps MSME IDs to arrays of token IDs they've issued
- `distributionRecords`: Maps token IDs to arrays of distribution records

### Revenue Share Calculation

The revenue share is specified in basis points (1/100th of a percent):

- 100 basis points = 1%
- 10000 basis points = 100%

For example, a 5% revenue share would be stored as 500 basis points.

### Security Considerations

- Only the canister owner can mint new NFTs
- Revenue distribution recording is restricted to authorized calls
- Token transfers require ownership verification
- MSMEs can only issue tokens with valid revenue share percentages

## Canister Interactions

The NFT canister interacts with:

- **Revenue Reporting Canister**: For recording distributions
- **MSME Registration Canister**: For verifying MSMEs
- **Authentication Canister**: For verifying user permissions
- **Frontend**: For user-initiated NFT operations
