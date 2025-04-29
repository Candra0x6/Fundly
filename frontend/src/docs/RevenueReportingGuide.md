# Revenue Reporting Hooks Documentation

This documentation provides guidance on how to use the Revenue Reporting hooks in your frontend application to interact with the Motoko Revenue Reporting canister.

## Overview

The Revenue Reporting system allows MSMEs (Micro, Small, and Medium Enterprises) to report their revenue and distribute it to token holders. The frontend hooks provide a convenient way to interact with the Motoko canister from your React application.

## Installation

No additional installation is needed as the hooks are part of the codebase.

## Hooks Usage

### `useRevenueReporting`

This is the main hook that provides access to all the Revenue Reporting canister functions.

```tsx
import { useRevenueReporting } from '../hooks/useRevenueReporting';

function MyComponent() {
  const {
    loading,
    error,
    reportRevenue,
    getRevenue,
    getMSMERevenues,
    distributeRevenue,
    getDistributionDetails,
    setAdminPrincipal,
    updateCanisterReferences
  } = useRevenueReporting();

  // Use these functions in your component
}
```

## Functions

### `reportRevenue`

Report new revenue for an MSME.

```tsx
const { reportRevenue } = useRevenueReporting();

// Usage
async function handleReportRevenue() {
  const msmeId = "your-msme-id";
  const amount = BigInt(1000); // Amount in token units
  const description = "Sales revenue for June 2023";
  
  const result = await reportRevenue(msmeId, amount, description);
  
  if ('ok' in result) {
    console.log("Revenue reported successfully with ID:", result.ok);
  } else {
    console.error("Error reporting revenue:", result.err);
  }
}
```

### `getRevenue`

Retrieve revenue details by ID.

```tsx
const { getRevenue } = useRevenueReporting();

// Usage
async function fetchRevenueDetails(id: string) {
  const revenue = await getRevenue(id);
  
  if (revenue) {
    console.log("Revenue details:", {
      id: revenue.id,
      msmeId: revenue.msmeId,
      amount: revenue.amount.toString(),
      description: revenue.description,
      reportDate: new Date(Number(revenue.reportDate) / 1_000_000), // Convert to JavaScript Date
      distributed: revenue.distributed
    });
  } else {
    console.log("Revenue not found");
  }
}
```

### `getMSMERevenues`

Get a list of all revenue IDs for a specific MSME.

```tsx
const { getMSMERevenues } = useRevenueReporting();

// Usage
async function fetchMSMERevenues(msmeId: string) {
  const revenueIds = await getMSMERevenues(msmeId);
  console.log("MSME Revenue IDs:", revenueIds);
}
```

### `distributeRevenue`

Distribute revenue to token holders (admin only).

```tsx
const { distributeRevenue } = useRevenueReporting();

// Usage
async function handleDistribution(revenueId: string) {
  const result = await distributeRevenue(revenueId);
  
  if ('ok' in result) {
    console.log("Revenue distributed successfully");
  } else {
    console.error("Error distributing revenue:", result.err);
  }
}
```

### `getDistributionDetails`

Get details about how revenue was distributed.

```tsx
const { getDistributionDetails } = useRevenueReporting();

// Usage
async function fetchDistributionDetails(revenueId: string) {
  const result = await getDistributionDetails(revenueId);
  
  if ('ok' in result) {
    console.log("Distribution transactions:", result.ok.map(tx => ({
      tokenId: tx.tokenId.toString(),
      recipientOwner: tx.recipient.owner.toString(),
      amount: tx.amount.toString(),
      timestamp: new Date(Number(tx.timestamp) / 1_000_000)
    })));
  } else {
    console.error("Error fetching distribution details:", result.err);
  }
}
```

### Admin Functions

The following functions are restricted to admin users only:

#### `setAdminPrincipal`

Update the admin principal for the canister.

```tsx
const { setAdminPrincipal } = useRevenueReporting();

// Usage
import { Principal } from '@dfinity/principal';

async function updateAdmin(principalId: string) {
  const principal = Principal.fromText(principalId);
  const result = await setAdminPrincipal(principal);
  
  if ('ok' in result) {
    console.log("Admin principal updated successfully");
  } else {
    console.error("Error updating admin principal:", result.err);
  }
}
```

#### `updateCanisterReferences`

Update the canister references for external canisters.

```tsx
const { updateCanisterReferences } = useRevenueReporting();

// Usage
async function updateReferences() {
  const msmeCanisterId = "aaaaa-aa";
  const nftCanisterId = "bbbbb-bb";
  const tokenCanisterId = "ccccc-cc";
  
  const result = await updateCanisterReferences(
    msmeCanisterId,
    nftCanisterId,
    tokenCanisterId
  );
  
  if ('ok' in result) {
    console.log("Canister references updated successfully");
  } else {
    console.error("Error updating canister references:", result.err);
  }
}
```

## Complete Example: Revenue Reporting Dashboard

```tsx
import React, { useState } from 'react';
import { useRevenueReporting } from '../hooks/useRevenueReporting';

const RevenueReportingDashboard = () => {
  const { 
    reportRevenue, 
    getRevenue,
    loading, 
    error 
  } = useRevenueReporting();
  const [msmeId, setMsmeId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [revenueId, setRevenueId] = useState('');
  const [revenue, setRevenue] = useState(null);
  const [result, setResult] = useState('');

  // Report new revenue
  const handleReportRevenue = async (e) => {
    e.preventDefault();
    try {
      const bigintAmount = BigInt(amount);
      const response = await reportRevenue(msmeId, bigintAmount, description);
      
      if ('ok' in response) {
        setResult(`Revenue reported with ID: ${response.ok}`);
        setRevenueId(response.ok);
      } else {
        setResult(`Error: ${JSON.stringify(response.err)}`);
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  // Fetch revenue details
  const handleGetRevenue = async () => {
    try {
      const data = await getRevenue(revenueId);
      setRevenue(data);
      if (!data) {
        setResult('Revenue not found');
      } else {
        setResult('Revenue details fetched successfully');
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Revenue Reporting Dashboard</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && <div style={{ margin: '10px 0' }}>{result}</div>}
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Report Revenue Form */}
        <div style={{ flex: 1 }}>
          <h2>Report Revenue</h2>
          <form onSubmit={handleReportRevenue}>
            <div>
              <label>MSME ID:</label>
              <input
                type="text"
                value={msmeId}
                onChange={(e) => setMsmeId(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Report Revenue'}
            </button>
          </form>
        </div>
        
        {/* Get Revenue Details */}
        <div style={{ flex: 1 }}>
          <h2>Revenue Details</h2>
          <div>
            <label>Revenue ID:</label>
            <input
              type="text"
              value={revenueId}
              onChange={(e) => setRevenueId(e.target.value)}
            />
            <button onClick={handleGetRevenue} disabled={loading || !revenueId}>
              {loading ? 'Loading...' : 'Get Details'}
            </button>
          </div>
          
          {revenue && (
            <div style={{ marginTop: '20px' }}>
              <h3>Details:</h3>
              <p>ID: {revenue.id}</p>
              <p>MSME ID: {revenue.msmeId}</p>
              <p>Amount: {revenue.amount.toString()}</p>
              <p>Description: {revenue.description}</p>
              <p>Report Date: {new Date(Number(revenue.reportDate) / 1_000_000).toLocaleString()}</p>
              <p>Distributed: {revenue.distributed ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueReportingDashboard;
```

## Type Definitions

The hook provides TypeScript types for all the data structures:

```typescript
// Revenue record
export type Revenue = {
  id: string;
  msmeId: string;
  amount: bigint;
  description: string;
  reportDate: bigint;
  distributed: boolean;
  distributionTxs: DistributionTx[];
};

// Distribution transaction
export type DistributionTx = {
  tokenId: bigint;
  recipient: Account;
  amount: bigint;
  timestamp: bigint;
  txId: [bigint] | [];
};

// Account structure (for token owner)
export type Account = {
  owner: Principal;
  subaccount: [] | [Uint8Array];
};

// Error types
export type RevenueError = 
  | { NotFound: null }
  | { Unauthorized: null }
  | { ValidationError: null }
  | { DistributionFailed: null }
  | { MSMENotFound: null }
  | { NoTokensFound: null }
  | { TransferError: string };

// Result type
export type Result<T, E> = { ok: T } | { err: E };
```

## Tips for Working with Internet Computer Data Types

- **BigInt**: Numbers from the Motoko canister are represented as BigInt in JavaScript. Use `.toString()` when displaying them.
- **Timestamps**: Timestamps from the canister are represented in nanoseconds. Divide by 1,000,000 to convert to JavaScript milliseconds.
- **Principal IDs**: Use the `Principal` class from `@dfinity/principal` to work with principal IDs.
- **Optional values**: Optional values from Motoko are represented as arrays with 0 or 1 elements.

## Error Handling

Each function returns a `Result` type that can be either an `ok` or an `err`. Use pattern matching to handle these:

```typescript
const result = await reportRevenue(msmeId, amount, description);

if ('ok' in result) {
  // Success path
  console.log("Success:", result.ok);
} else {
  // Error path
  console.error("Error:", result.err);
}
``` 