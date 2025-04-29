# Token Canister Documentation

## Overview

The Token Canister implements the ICRC-1 and ICRC-2 token standards to provide a fungible token called Fundly Token (FND). This token is used throughout the platform for utility purposes including transaction fees and revenue distribution to investors.

## Standards Implementation

- **ICRC-1**: Basic token functionality (transfers, balances)
- **ICRC-2**: Allowance functionality (approve, transferFrom)

## Key Features

- Fungible token with 8 decimal places
- Transaction fees (0.0001 FND default)
- Approval system for delegated transfers
- Transaction history tracking
- Minting and burning capabilities (admin only)

## Data Models

### Account

```motoko
public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
};
```

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

### Allowance

```motoko
public type Allowance = {
    allowance : Nat;
    expires_at : ?Nat64;
};
```

## Public API Methods

### ICRC-1 Standard Methods

#### Token Metadata

```motoko
icrc1_name() : async Text
icrc1_symbol() : async Text
icrc1_decimals() : async Nat8
icrc1_fee() : async Nat
icrc1_metadata() : async [(Text, Value)]
icrc1_total_supply() : async Nat
icrc1_minter() : async Principal
```

#### Balance

```motoko
icrc1_balance_of(account : Account) : async Nat
```

#### Transfer

```motoko
icrc1_transfer(args : TransferArgs) : async Result.Result<Nat, TransferError>
```

### ICRC-2 Standard Methods

#### Allowance

```motoko
icrc2_allowance(args : { account : Account; spender : Account }) : async Allowance
```

#### Approve

```motoko
icrc2_approve(args : ApproveArgs) : async Result.Result<Nat, ApproveError>
```

#### Transfer From

```motoko
icrc2_transfer_from(args : TransferFromArgs) : async Result.Result<Nat, TransferError>
```

### Additional Methods

#### Mint Tokens

```motoko
mint(to : Account, amount : Nat) : async Result.Result<Nat, Text>
```

#### Burn Tokens

```motoko
burn(from : Account, amount : Nat) : async Result.Result<Nat, Text>
```

#### Transaction History

```motoko
getTransaction(id : Nat) : async ?Transaction
getRecentTransactions(limit : Nat) : async [Transaction]
```

#### Admin Functions

```motoko
setMinter(newMinter : Principal) : async Result.Result<(), Text>
setFee(newFee : Nat) : async Result.Result<(), Text>
```

## Usage Examples

### Initializing the Token

```motoko
// Called by the minter to set up the initial token supply
await FNDToken.initialize();
```

### Transferring Tokens

```motoko
let result = await FNDToken.icrc1_transfer({
    from_subaccount = null;
    to = { owner = recipient; subaccount = null };
    amount = 100_000_000; // 1 FND with 8 decimal places
    fee = null; // Use default fee
    memo = ?Text.encodeUtf8("Payment for services");
    created_at_time = null;
});
```

### Approving a Spender

```motoko
let result = await FNDToken.icrc2_approve({
    from_subaccount = null;
    spender = { owner = spenderPrincipal; subaccount = null };
    amount = 50_000_000; // 0.5 FND
    expected_allowance = null;
    expires_at = ?Nat64.fromNat(Int.abs(Time.now() + 86_400_000_000_000)); // 1 day
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Transferring From Another Account

```motoko
let result = await FNDToken.icrc2_transfer_from({
    spender_subaccount = null;
    from = { owner = fromPrincipal; subaccount = null };
    to = { owner = toPrincipal; subaccount = null };
    amount = 25_000_000; // 0.25 FND
    fee = null;
    memo = null;
    created_at_time = null;
});
```

## Implementation Details

### Storage

The token state is stored in three main data structures:

- `balances`: Maps accounts to their token balances
- `allowances`: Maps (owner, spender) pairs to allowance amounts
- `transactions`: Records all transaction history

### Error Handling

All operations that can fail return a `Result` type with appropriate error information:

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

### Security Considerations

- Only the designated minter can mint or burn tokens
- Only the minter can change the fee or assign a new minter
- Expired allowances are automatically invalidated
- Fees are collected on transfers and approvals

## Canister Interactions

The Token canister interacts with:

- **Revenue Reporting Canister**: For distributing revenue to NFT holders
- **Authentication Canister**: For verifying user permissions
- **Frontend**: For user-initiated token operations
