# Verification Workflow Hooks Documentation

This documentation provides guidance on how to use the Verification Workflow hooks in your frontend application to interact with the Motoko Verification Workflow canister.

## Overview

The Verification Workflow system allows managing the verification process for MSMEs (Micro, Small, and Medium Enterprises). It handles verification requests, documents, status updates, and officer management. The frontend hooks provide a convenient way to interact with the Motoko canister from your React application.

## Hooks Usage

### `useVerificationWorkflow`

This is the main hook that provides access to all the Verification Workflow canister functions.

```tsx
import { useVerificationWorkflow } from '../hooks/useVerificationWorkflow';

function MyComponent() {
  const {
    loading,
    error,
    createVerificationRequest,
    getVerificationRequest,
    assignRequest,
    addComment,
    uploadDocument,
    reviewDocument,
    updateVerificationStatus,
    // ... and more functions
  } = useVerificationWorkflow();

  // Use these functions in your component
}
```

## Main Functions

### `createVerificationRequest`

Create a new verification request for an MSME.

```tsx
const { createVerificationRequest } = useVerificationWorkflow();

// Usage
async function handleCreateRequest() {
  const msmeId = "MSME-123";
  const requiredDocuments = ["Business License", "Tax Certificate", "ID Card"];
  
  const result = await createVerificationRequest(msmeId, requiredDocuments);
  
  if ('ok' in result) {
    console.log("Request created with ID:", result.ok);
  } else {
    console.error("Error creating request:", result.err);
  }
}
```

### `getVerificationRequest`

Retrieve a verification request by ID.

```tsx
const { getVerificationRequest } = useVerificationWorkflow();

// Usage
async function fetchRequestDetails(id: string) {
  const result = await getVerificationRequest(id);
  
  if ('ok' in result) {
    console.log("Request details:", result.ok);
  } else {
    console.error("Error fetching request:", result.err);
  }
}
```

### `uploadDocument`

Upload a document for a verification request.

```tsx
const { uploadDocument } = useVerificationWorkflow();

// Usage
async function handleDocumentUpload() {
  const requestId = "VR123";
  const name = "Business License";
  const documentType = "License";
  const fileUrl = "assets/licenses/business-license.pdf";
  
  const result = await uploadDocument(requestId, name, documentType, fileUrl);
  
  if ('ok' in result) {
    console.log("Document uploaded successfully");
  } else {
    console.error("Error uploading document:", result.err);
  }
}
```

### `reviewDocument`

Review a document in a verification request (officer or admin only).

```tsx
const { reviewDocument } = useVerificationWorkflow();

// Usage
async function handleDocumentReview() {
  const requestId = "VR123";
  const documentId = "DOC456";
  const status = { Approved: null }; // Can be { Approved: null }, { Rejected: null }, or { Pending: null }
  const comments = "Document looks good"; // Optional
  
  const result = await reviewDocument(requestId, documentId, status, comments);
  
  if ('ok' in result) {
    console.log("Document reviewed successfully");
  } else {
    console.error("Error reviewing document:", result.err);
  }
}
```

### `addComment`

Add a comment to a verification request.

```tsx
const { addComment } = useVerificationWorkflow();

// Usage
async function handleAddComment() {
  const requestId = "VR123";
  const text = "Please provide clearer copies of your documents.";
  const isInternal = false; // Set to true for comments only visible to verification officers
  
  const result = await addComment(requestId, text, isInternal);
  
  if ('ok' in result) {
    console.log("Comment added successfully");
  } else {
    console.error("Error adding comment:", result.err);
  }
}
```

### `updateVerificationStatus`

Update the status of a verification request (officer or admin only).

```tsx
const { updateVerificationStatus } = useVerificationWorkflow();

// Usage
async function handleStatusUpdate() {
  const requestId = "VR123";
  const status = { Approved: null }; // Can be { Pending: null }, { InReview: null }, { Approved: null }, { Rejected: null }, or { NeedsMoreInfo: null }
  
  const result = await updateVerificationStatus(requestId, status);
  
  if ('ok' in result) {
    console.log("Status updated successfully");
  } else {
    console.error("Error updating status:", result.err);
  }
}
```

## Admin Functions

The following functions are restricted to admin users only:

### `addVerificationOfficer`

Add a new verification officer.

```tsx
const { addVerificationOfficer } = useVerificationWorkflow();

// Usage
import { Principal } from '@dfinity/principal';

async function handleAddOfficer() {
  const officerId = Principal.fromText("aaaaa-bbbbb-ccccc-ddddd");
  const name = "Jane Doe";
  const department = "Verification Department";
  
  const result = await addVerificationOfficer(officerId, name, department);
  
  if ('ok' in result) {
    console.log("Officer added successfully");
  } else {
    console.error("Error adding officer:", result.err);
  }
}
```

### `removeVerificationOfficer`

Remove a verification officer.

```tsx
const { removeVerificationOfficer } = useVerificationWorkflow();

// Usage
import { Principal } from '@dfinity/principal';

async function handleRemoveOfficer() {
  const officerId = Principal.fromText("aaaaa-bbbbb-ccccc-ddddd");
  
  const result = await removeVerificationOfficer(officerId);
  
  if ('ok' in result) {
    console.log("Officer removed successfully");
  } else {
    console.error("Error removing officer:", result.err);
  }
}
```

### `setMSMERegistrationCanister`

Set the MSME Registration canister ID.

```tsx
const { setMSMERegistrationCanister } = useVerificationWorkflow();

// Usage
import { Principal } from '@dfinity/principal';

async function handleSetCanister() {
  const canisterId = Principal.fromText("aaaaa-bbbbb-ccccc-ddddd");
  
  const result = await setMSMERegistrationCanister(canisterId);
  
  if ('ok' in result) {
    console.log("MSME Registration canister set successfully");
  } else {
    console.error("Error setting canister:", result.err);
  }
}
```

## Query Functions

### `getVerificationOfficers`

Get all verification officers.

```tsx
const { getVerificationOfficers } = useVerificationWorkflow();

// Usage
async function fetchOfficers() {
  const officers = await getVerificationOfficers();
  console.log("Verification officers:", officers);
}
```

### `getPendingVerificationRequests`

Get all pending verification requests.

```tsx
const { getPendingVerificationRequests } = useVerificationWorkflow();

// Usage
async function fetchPendingRequests() {
  const requests = await getPendingVerificationRequests();
  console.log("Pending requests:", requests);
}
```

### `getRequestsAssignedToOfficer`

Get verification requests assigned to a specific officer.

```tsx
const { getRequestsAssignedToOfficer } = useVerificationWorkflow();

// Usage
import { Principal } from '@dfinity/principal';

async function fetchAssignedRequests() {
  const officerId = Principal.fromText("aaaaa-bbbbb-ccccc-ddddd");
  const requests = await getRequestsAssignedToOfficer(officerId);
  console.log("Assigned requests:", requests);
}
```

### `getRequestsForMSME`

Get verification requests for a specific MSME.

```tsx
const { getRequestsForMSME } = useVerificationWorkflow();

// Usage
async function fetchMSMERequests() {
  const msmeId = "MSME-123";
  const requests = await getRequestsForMSME(msmeId);
  console.log("MSME requests:", requests);
}
```

## Complete Example

Here's a complete example of a component that creates a verification request:

```tsx
import React, { useState } from 'react';
import { useVerificationWorkflow } from '../hooks/useVerificationWorkflow';

export const VerificationRequestForm: React.FC = () => {
  const { createVerificationRequest, loading, error } = useVerificationWorkflow();
  const [msmeId, setMsmeId] = useState('');
  const [docs, setDocs] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert comma-separated string to array
      const requiredDocuments = docs.split(',').map(doc => doc.trim());
      
      const response = await createVerificationRequest(msmeId, requiredDocuments);
      
      if ('ok' in response) {
        setResult(`Request created with ID: ${response.ok}`);
        setMsmeId('');
        setDocs('');
      } else {
        setResult(`Error: ${JSON.stringify(response.err)}`);
      }
    } catch (error) {
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div>
      <h2>Create Verification Request</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {result && <div style={{ margin: '10px 0' }}>{result}</div>}
      
      <form onSubmit={handleSubmit}>
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
          <label>Required Documents (comma-separated):</label>
          <input
            type="text"
            value={docs}
            onChange={(e) => setDocs(e.target.value)}
            placeholder="Business License, Tax Certificate, ID Card"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Request'}
        </button>
      </form>
    </div>
  );
};
```

## Type Definitions

The hook provides TypeScript types for all the data structures:

```typescript
export type MSMEID = string;

export type VerificationOfficer = {
  id: Principal;
  name: string;
  department: string;
  addedAt: bigint;
};

export type VerificationStatus = 
  | { Pending: null }
  | { InReview: null }
  | { Approved: null }
  | { Rejected: null }
  | { NeedsMoreInfo: null };

export type VerificationComment = {
  id: string;
  author: Principal;
  text: string;
  timestamp: bigint;
  isInternal: boolean;
};

export type DocumentStatus = 
  | { Pending: null }
  | { Approved: null }
  | { Rejected: null };

export type Document = {
  id: string;
  name: string;
  documentType: string;
  fileUrl: string;
  uploadedAt: bigint;
  uploadedBy: Principal;
  status: DocumentStatus;
  reviewComments: [] | [string];
};

export type VerificationRequest = {
  id: string;
  msmeId: MSMEID;
  status: VerificationStatus;
  createdAt: bigint;
  updatedAt: bigint;
  assignedTo: [] | [Principal];
  comments: VerificationComment[];
  documents: Document[];
  requiredDocuments: string[];
};

export type Error = 
  | { NotFound: null }
  | { Unauthorized: null }
  | { AlreadyExists: null }
  | { InvalidInput: null }
  | { SystemError: null };

export type Result<T, E> = { ok: T } | { err: E };
```

## Tips for Working with Internet Computer Data Types

- **Principal IDs**: Use the `Principal` class from `@dfinity/principal` to work with principal IDs.
- **Timestamps**: Timestamps from the canister are represented in nanoseconds. Divide by 1,000,000 to convert to JavaScript milliseconds.
- **Optional values**: Optional values from Motoko are represented as arrays with 0 or 1 elements in TypeScript.
- **Variant types**: For variant types like `VerificationStatus` and `DocumentStatus`, you need to use pattern matching to check which variant is present.

## Error Handling

Each function that returns a `Result` type can be pattern matched to handle success and error cases:

```typescript
const result = await createVerificationRequest(msmeId, requiredDocuments);

if ('ok' in result) {
  // Success path
  console.log("Success:", result.ok);
} else {
  // Error path
  console.error("Error:", result.err);
  
  // You can check the specific error type
  if ('NotFound' in result.err) {
    console.error("Resource not found");
  } else if ('Unauthorized' in result.err) {
    console.error("Unauthorized access");
  }
}
``` 