# Revenue Reporting Canister

## Overview

The Revenue Reporting Canister manages the process of reporting and distributing revenue from MSMEs to NFT holders based on their revenue share tokens. It serves as the central component for the revenue sharing functionality of the Fundly platform.

## Key Features

- Revenue reporting by MSMEs
- Automatic calculation of distribution amounts
- Distribution of funds to NFT holders
- Record-keeping of all distributions
- Integration with NFT and Token canisters

## Data Models

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

### RevenueError

```motoko
public type RevenueError = {
    #NotFound;
    #Unauthorized;
    #ValidationError;
    #DistributionFailed;
    #MSMENotFound;
    #NoTokensFound;
    #TransferError : Text;
};
```

## Public API Methods

### Report Revenue

```motoko
reportRevenue(
    msmeId : Text,
    amount : Nat,
    description : Text,
) : async Result.Result<Text, RevenueError>
```

Allows an MSME to report revenue. The caller must be the MSME owner. Returns the revenue ID on success.

### Get Revenue

```motoko
getRevenue(id : Text) : async ?Revenue
```

Retrieves a revenue report by ID. Returns null if not found.

### Get MSME Revenues

```motoko
getMSMERevenues(msmeId : Text) : async [Text]
```

Returns all revenue IDs associated with a specific MSME.

### Distribute Revenue

```motoko
distributeRevenue(revenueId : Text) : async Result.Result<(), RevenueError>
```

Initiates the distribution of reported revenue to NFT holders. Only the admin can call this method.

### Get Distribution Details

```motoko
getDistributionDetails(revenueId : Text) : async Result.Result<[DistributionTx], RevenueError>
```

Retrieves the distribution transactions for a specific revenue report.

### Admin Functions

```motoko
setAdminPrincipal(newAdmin : Principal) : async Result.Result<(), RevenueError>
```

Sets a new admin principal. Only the current admin can call this method.

```motoko
updateCanisterReferences(
    msmeCanisterId : Text,
    nftCanisterId : Text,
    tokenCanisterId : Text,
) : async Result.Result<(), RevenueError>
```

Updates the references to other canisters. Only the admin can call this method.

## Usage Examples

### Reporting Revenue

```motoko
// MSME reports monthly revenue
let reportResult = await RevenueReporting.reportRevenue(
    "MSME123",
    1_000_000_000, // 10 FND tokens with 8 decimals
    "March 2023 Revenue"
);

switch (reportResult) {
    case (#ok(revenueId)) {
        // Revenue reported successfully
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Distributing Revenue

```motoko
// Admin distributes the reported revenue
let distributeResult = await RevenueReporting.distributeRevenue("revenue123");

switch (distributeResult) {
    case (#ok(_)) {
        // Distribution successful
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Retrieving Distribution Details

```motoko
// View the distribution transactions
let detailsResult = await RevenueReporting.getDistributionDetails("revenue123");

switch (detailsResult) {
    case (#ok(distributions)) {
        // Process distribution details
        for (dist in distributions.vals()) {
            // dist.tokenId - The NFT token ID
            // dist.recipient - The NFT owner
            // dist.amount - The amount distributed
            // dist.txId - The transaction ID (if successful)
        };
    };
    case (#err(error)) {
        // Handle error
    };
}
```

## Implementation Details

### Distribution Algorithm

The revenue distribution process follows these steps:

1. **Token Identification**:

   - Identify all NFTs associated with the MSME
   - Query each token's revenue share percentage

2. **Share Calculation**:

   - Calculate the total shares (sum of all token revenue share percentages)
   - For each token, calculate its distribution amount:
     ```
     distributionAmount = (revenueAmount * tokenShare) / totalShares
     ```

3. **Transfer Execution**:

   - For each token, transfer the calculated amount to the token owner
   - Record each transfer, including successful and failed ones

4. **Record Keeping**:
   - Update the revenue record with distribution status and details
   - Store all transactions for auditing purposes

### Inter-canister Communication

The Revenue Reporting canister communicates with:

- **MSME Registration Canister**: To verify MSME ownership
- **NFT Canister**: To get token information, ownership, and record distributions
- **Token Canister**: To execute token transfers to NFT owners

### Storage

The canister uses two main storage structures:

- `revenues`: Maps revenue IDs to Revenue objects
- `msmeToRevenues`: Maps MSME IDs to arrays of revenue IDs

## Security Considerations

- **Ownership Verification**: Only the MSME owner can report revenue
- **Admin Control**: Only the admin can initiate distributions
- **Failed Transfer Handling**: The system records failed transfers for manual review
- **Authentication**: All methods verify caller permissions before execution

## Best Practices

### For MSMEs

1. **Regular Reporting**:

   - Report revenue on a consistent schedule (monthly is recommended)
   - Provide clear descriptions for each revenue report

2. **Accurate Amounts**:
   - Ensure revenue amounts are accurate and in the correct denomination
   - Remember that amounts use the FND token's 8 decimal places (e.g., 100_000_000 = 1 FND)

### For Developers

1. **Error Handling**:

   - Always check for errors when calling methods that return Result types
   - Handle distribution failures appropriately

2. **Transaction Monitoring**:
   - Monitor distribution transactions, especially failed ones
   - Implement retry mechanisms for failed distributions

## Common Scenarios

### Example: Revenue Distribution Calculation

If an MSME has issued 3 NFTs with the following revenue shares:

- Token 1: 500 basis points (5%)
- Token 2: 1000 basis points (10%)
- Token 3: 1500 basis points (15%)

The total share is 30%. When the MSME reports 1000 FND in revenue:

- Token 1 owner receives: 5% of 1000 FND = 50 FND
- Token 2 owner receives: 10% of 1000 FND = 100 FND
- Token 3 owner receives: 15% of 1000 FND = 150 FND

The MSME retains the remaining 70% (700 FND).
