# Data Models

This document provides an overview of the key data models used throughout the Fundly platform. Understanding these data structures is essential for developers working with the platform's canisters.

## Core Data Types

### Account

Used across multiple canisters to represent a user account:

```motoko
public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
};

public type Subaccount = Blob;
```

The `Principal` represents a user's Internet Computer identity, and the optional `Subaccount` allows for multiple accounts under the same principal.

## User & Authentication Models

### UserRole

```motoko
public type UserRole = {
    #Admin;
    #MSME;
    #Investor;
    #Verifier;
};
```

### UserProfile

```motoko
public type UserProfile = {
    principal : Principal;
    roles : [UserRole];
    username : ?Text;
    email : ?Text;
    createdAt : Time.Time;
    lastLogin : ?Time.Time;
};
```

### SessionData

```motoko
public type SessionData = {
    principal : Principal;
    expiresAt : Time.Time;
    createdAt : Time.Time;
};
```

## MSME Models

### MSMEProfile

```motoko
public type MSMEProfile = {
    id : MSMEID;
    owner : Principal;
    name : Text;
    description : Text;
    registrationNumber : Text;
    contactInfo : ContactInfo;
    socialLinks : ?[SocialLink];
    industry : Text;
    establishmentDate : ?Time.Time;
    location : Location;
    teamSize : Nat;
    msmeType : MSMEType;
    verificationStatus : VerificationStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
};
```

### Supporting MSME Types

```motoko
public type ContactInfo = {
    email : Text;
    phone : Text;
    website : ?Text;
};

public type SocialLink = {
    platform : Text;
    url : Text;
};

public type Location = {
    address : Text;
    city : Text;
    state : Text;
    country : Text;
    postalCode : Text;
};

public type MSMEType = {
    #Micro;
    #Small;
    #Medium;
};

public type VerificationStatus = {
    #Unverified;
    #PendingVerification;
    #Verified;
    #Rejected;
};
```

## Token Models (ICRC-1/ICRC-2)

### Transaction

```motoko
public type Transaction = {
    id : Nat;
    from : Account;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Memo;
    timestamp : Timestamp;
    operation : Text; // "transfer", "mint", "burn", "approve", "transferFrom"
};
```

### Transfer Arguments

```motoko
public type TransferArgs = {
    from_subaccount : ?Subaccount;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Memo;
    created_at_time : ?Timestamp;
};
```

### Approval Models

```motoko
public type ApproveArgs = {
    from_subaccount : ?Subaccount;
    spender : Account;
    amount : Nat;
    expected_allowance : ?Nat;
    expires_at : ?Nat64;
    fee : ?Nat;
    memo : ?Memo;
    created_at_time : ?Timestamp;
};

public type Allowance = {
    allowance : Nat;
    expires_at : ?Nat64;
};
```

## NFT Models (ICRC-7)

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

### NFT Transfer Arguments

```motoko
public type TransferArgs = {
    token_id : TokenId;
    from_subaccount : ?Subaccount;
    to : Account;
    memo : ?Blob;
    created_at_time : ?Nat64;
};
```

### Distribution Record

```motoko
public type DistributionRecord = {
    tokenId : TokenId;
    amount : Nat;
    timestamp : Time.Time;
    msmeId : Text;
};
```

## Revenue Models

### Revenue

```motoko
public type Revenue = {
    id : Text;
    msmeId : Text;
    amount : Nat;
    description : Text;
    reportDate : Time.Time;
    distributed : Bool;
    distributionTxs : [DistributionTx];
};
```

### DistributionTx

```motoko
public type DistributionTx = {
    tokenId : Nat;
    recipient : Account;
    amount : Nat;
    timestamp : Time.Time;
    txId : ?Nat;
};
```

## Verification Models

### VerificationRequest

```motoko
public type VerificationRequest = {
    id : Text;
    msmeId : MSMEID;
    status : VerificationStatus;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    assignedTo : ?Principal;
    comments : [VerificationComment];
    documents : [Document];
    requiredDocuments : [Text];
};
```

### VerificationComment

```motoko
public type VerificationComment = {
    id : Text;
    author : Principal;
    text : Text;
    timestamp : Time.Time;
    isInternal : Bool; // True if visible only to verification officers
};
```

### Document

```motoko
public type Document = {
    id : Text;
    name : Text;
    documentType : Text;
    fileUrl : Text; // Could be asset canister reference
    uploadedAt : Time.Time;
    uploadedBy : Principal;
    status : DocumentStatus;
    reviewComments : ?Text;
};

public type DocumentStatus = {
    #Pending;
    #Approved;
    #Rejected;
};
```

## Asset Storage Models

### Asset

```motoko
public type Asset = {
    id : Text;
    contentType : Text;
    data : Blob;
    owner : Principal;
    createdAt : Time.Time;
    relatedEntity : ?{
        entityType : Text; // "MSME" or "NFT"
        entityId : Text;
    };
};
```

### ChunkedAsset

For larger files that need to be uploaded in chunks:

```motoko
public type ChunkedAsset = {
    id : AssetId;
    contentType : Text;
    chunkIds : [ChunkId];
    totalSize : Nat;
    owner : Principal;
    createdAt : Time.Time;
    relatedEntity : ?{
        entityType : Text;
        entityId : Text;
    };
};
```

## Error Models

Most canisters define specific error types for their operations:

### AuthError

```motoko
public type AuthError = {
    #NotAuthorized;
    #ProfileNotFound;
    #AlreadyExists;
    #SessionExpired;
    #InvalidToken;
    #OperationFailed;
};
```

### TransferError

```motoko
public type TransferError = {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Timestamp };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
};
```

### NFT TransferError

```motoko
public type TransferError = {
    #NonExistingTokenId : TokenId;
    #Unauthorized;
    #InvalidRecipient;
    #Rejected;
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
};
```

## Relationships Between Models

- **User Profiles** are linked to **MSMEs** via the owner Principal
- **MSMEs** are linked to **NFTs** via the msmeId in the NFT metadata
- **NFTs** are linked to **Revenue Distributions** via the tokenId
- **Verification Requests** are linked to **MSMEs** via the msmeId
- **Assets** can be linked to various entities via the relatedEntity field

## Best Practices for Working with Data Models

1. **Type Safety**: Always use the defined types for function parameters and returns
2. **Optional Fields**: Handle optional fields properly with pattern matching
3. **Result Types**: Most functions return Result types for proper error handling
4. **Time Values**: Use the Time module for timestamp handling
5. **Principal Handling**: Be careful with Principal comparison and conversion
