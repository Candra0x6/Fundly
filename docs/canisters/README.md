# Canisters Overview

## Introduction

Fundly is built with a modular architecture using multiple canisters on the Internet Computer Protocol. Each canister serves a specific purpose in the overall system, providing domain-specific functionality.

## Canister Structure

The system consists of the following canisters:

| Canister                                          | Description                         | Main Functionality                                              |
| ------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------- |
| [Token](token.md)                                 | ICRC-1/ICRC-2 Token Canister        | Manages the $FND utility token for the platform                 |
| [NFT](nft.md)                                     | ICRC-7 Revenue Share NFT Canister   | Handles revenue-sharing NFTs that represent investment in MSMEs |
| [Authentication](authentication.md)               | User Authentication & Authorization | Manages user profiles, roles, and sessions                      |
| [MSME Registration](msme.md)                      | MSME Profile Management             | Handles MSME registration and profile data                      |
| [Asset Storage](asset_storage.md)                 | File & Asset Management             | Stores and retrieves digital assets                             |
| [Revenue Reporting](revenue_reporting.md)         | Revenue Processing                  | Manages revenue reports and distribution to NFT holders         |
| [Verification Workflow](verification_workflow.md) | MSME Verification                   | Manages the verification process for MSMEs                      |

## Canister Interactions

The canisters interact with each other to provide the complete platform functionality:

```
[Authentication] ──────▶ [All Other Canisters]
                         (Provides authorization)

[MSME Registration] ───▶ [Verification Workflow]
                         (Verification process)

[MSME Registration] ───▶ [NFT Canister]
                         (Minting revenue share tokens)

[Revenue Reporting] ◀──▶ [NFT Canister]
                         (Getting token ownership & recording distributions)

[Revenue Reporting] ───▶ [Token Canister]
                         (Distributing revenue to token holders)

[All Canisters] ◀─────▶ [Asset Storage]
                         (Storing and retrieving assets)
```

## Deployment Structure

All canisters are defined in the `dfx.json` file, which specifies:

- The canister's main source file
- The canister type (Motoko, Rust, or custom)
- Any additional deployment parameters

```json
{
  "canisters": {
    "nft_canister": {
      "main": "src/fundly_backend/canisters/nft/main.mo",
      "type": "motoko"
    },
    "token_canister": {
      "main": "src/fundly_backend/canisters/token/main.mo",
      "type": "motoko"
    }
    // Other canisters...
  }
}
```

## Inter-Canister Calls

Canisters communicate with each other through well-defined interfaces:

```motoko
// Example of an inter-canister call in Revenue Reporting
private let NFTCanister = actor "aaaaa-aa" : actor {
    getTokensByMSME : (msmeId : Text) -> async [Nat];
    icrc7_owner_of : (tokenId : Nat) -> async ?Account;
    getRevenueShare : (tokenId : Nat) -> async ?Nat;
    recordDistribution : (tokenId : Nat, amount : Nat, msmeId : Text) -> async Result.Result<(), Text>;
};
```

In production, the placeholder principal IDs (`aaaaa-aa`) are replaced with actual canister IDs after deployment.

## Development Patterns

Each canister follows similar patterns:

1. **Type Definitions**: Data structures related to the canister's domain
2. **State Variables**: Storage for canister state
3. **Public API Methods**: Functions exposed for external calls
4. **Private Helper Functions**: Internal utility functions
5. **Stable Variables**: Data preserved during canister upgrades
6. **System Functions**: Special functions like `preupgrade` and `postupgrade`

## Detailed Documentation

For detailed information about each canister, including its API, data models, and implementation details, refer to the individual canister documentation:

- [Token Canister](token.md)
- [NFT Canister](nft.md)
- [Authentication Canister](authentication.md)
- [MSME Registration Canister](msme.md)
- [Asset Storage Canister](asset_storage.md)
- [Revenue Reporting Canister](revenue_reporting.md)
- [Verification Workflow Canister](verification_workflow.md)
