# Token Canister

## Overview

The Token Canister implements the ICRC-1 and ICRC-2 standards for fungible tokens, providing the $FND token functionality for the ImpactInvest platform. This token serves as the primary currency for purchasing NFTs and distributing revenue.

## Key Features

- **ICRC-1 Compliance**: Implements the standard interface for fungible tokens
- **ICRC-2 Compliance**: Implements token approval and transfer-from functionality
- **Transaction History**: Records and provides access to transaction history
- **Minting/Burning**: Controlled token supply management

## Types

### Account

```motoko
public type Account = {
    owner : Principal;
    subaccount : ?Subaccount;
};
```

### TransferArgs

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

### SpesificTransferArgs
```motoko
public type SpesificTransferArgs = {
    from_subaccount : ?Subaccount;
    from : Account;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Memo;
    created_at_time : ?Timestamp;
};
```

### ApproveArgs

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
```

### TokenTx

```motoko
public type TokenTx = {
    tokenId : Nat;
    from : Account;
    to : Account;
    amount : Nat;
    category : Text;
    fee : ?Nat;
    memo : ?Memo;
    timestamp : Timestamp;
    operation : Text; // "transfer", "mint", "burn", "approve", "transferFrom"
};
```

## Public Functions

### ICRC-1 Standard Functions

- `icrc1_name() : async Text`
- `icrc1_symbol() : async Text`
- `icrc1_decimals() : async Nat8`
- `icrc1_fee() : async Nat`
- `icrc1_metadata() : async [(Text, Value)]`
- `icrc1_total_supply() : async Nat`
- `icrc1_minter() : async Principal`
- `icrc1_balance_of(account : Account) : async Nat`
- `icrc1_transfer(args : TransferArgs) : async Result.Result<Nat, TransferError>`

### ICRC-2 Standard Functions

- `icrc2_approve(args : ApproveArgs) : async Result.Result<Nat, ApproveError>`
- `icrc2_allowance(args : { account : Account; spender : Account }) : async Allowance`
- `icrc2_transfer_from(args : TransferFromArgs) : async Result.Result<Nat, TransferError>`

### Custom Functions

- `initialize() : async ()`
- `mint(to : Account, amount : Nat) : async Result.Result<Nat, Text>`
- `burn(from : Account, amount : Nat) : async Result.Result<Nat, Text>`
- `getTransationByOwner(owner : Principal) : async [TokenTx]`
- `getRecentTransactions(limit : Nat) : async [TokenTx]`
- `setMinter(newMinter : Principal) : async Result.Result<(), Text>`
- `setFee(newFee : Nat) : async Result.Result<(), Text>`
- `icrc_spesific_transfer(args : SpesificTransferArgs) : async Result.Result<Nat, TransferError>`

## State Management

The Token Canister uses the following data structures for state management:

- `balances`: A TrieMap that tracks token balances for each account
- `allowances`: A TrieMap that tracks approved token allowances
- `transactions`: A TrieMap that stores transaction history

## Configuration

The token has the following configuration:

- **Name**: Fundly Token
- **Symbol**: FND
- **Decimals**: 8
- **Default Fee**: 10,000 (0.0001 FND with 8 decimals)
- **Total Supply**: 1,000,000,000 FND (1 billion tokens)

## Security Model

- The minter principal has special privileges for minting and burning tokens
- Fee deduction on transfers ensures network sustainability
- Approval mechanism allows for delegated transfers with optional expiry

## Examples

### Transferring Tokens

```motoko
let result = await TokenCanister.icrc1_transfer({
    from_subaccount = null;
    to = { owner = recipient; subaccount = null };
    amount = 100_00000000; // 100 FND with 8 decimals
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Approving Token Spending

```motoko
let result = await TokenCanister.icrc2_approve({
    from_subaccount = null;
    spender = { owner = spender; subaccount = null };
    amount = 50_00000000; // 50 FND
    expected_allowance = null;
    expires_at = null;
    fee = null;
    memo = null;
    created_at_time = null;
});
```

### Minting New Tokens

```motoko
let result = await TokenCanister.mint(
    { owner = recipient; subaccount = null },
    1000_00000000 // 1000 FND
);
```

### Specific Transfer for Revenue Distribution 

```motoko
let transferArgs = {
    from_subaccount = null;
    to = { owner = nftOwner; subaccount = null };
    from = { owner = msmeOwner; subaccount = null };
    amount = 100_00000000; // 100 FND
    fee = null;
    memo = ?Text.encodeUtf8("Revenue distribution");
    created_at_time = null;
};

let result = await TokenCanister.icrc_spesific_transfer(transferArgs);
``` 