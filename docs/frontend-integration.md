# Frontend Integration with Motoko Verification Workflow Canister

This document explains how the frontend application integrates with the Motoko-based verification workflow canister to provide verification functionality for MSME reports.

## Architecture Overview

The frontend integrates with the Motoko backend using the Internet Computer's JavaScript Agent library. The integration follows this pattern:

1. **Service Layer**: A TypeScript service that handles communication with the canister
2. **React Components**: UI components that use the service to display and manage verification data
3. **Mock Implementation**: For local development, we've implemented a mock version that simulates canister behavior

## Key Files

### Service Implementation

- `frontend/src/services/verification.service.ts`: The main service that handles canister interaction
- `frontend/src/declarations/verification_workflow/verification_workflow.did.js`: The canister interface declaration

### UI Components

- `frontend/src/components/verification-portal/revenue-report-details.tsx`: Displays verification request details
- `frontend/src/components/verification-portal/supporting-document-viewer.tsx`: Handles document viewing and approval
- `frontend/src/components/verification-portal/verification-history.tsx`: Shows comments and activity history
- `frontend/src/components/verification-portal/revenue-approval-controls.tsx`: Provides approval workflow controls

### Pages

- `frontend/src/pages/dashboard/verify/revenue/[id]/page.tsx`: The main verification page that uses all components

## Canister Integration

### Type Mapping

We've mapped the Motoko types to TypeScript equivalents:

```typescript
// Motoko variant type -> TypeScript discriminated union
export type VerificationStatus = 
  | { Pending: null }
  | { InReview: null }
  | { Approved: null }
  | { Rejected: null }
  | { NeedsMoreInfo: null };

// Motoko record type -> TypeScript interface
export interface VerificationRequest {
  id: string;
  msmeId: MSMEID;
  status: VerificationStatus;
  createdAt: bigint;
  updatedAt: bigint;
  assignedTo: [] | [Principal];
  comments: VerificationComment[];
  documents: Document[];
  requiredDocuments: string[];
}
```

### Canister Methods

The service implements these key canister methods:

1. `getVerificationRequest`: Fetches a verification request by ID
2. `addComment`: Adds a comment to a verification request
3. `uploadDocument`: Uploads a document for verification
4. `reviewDocument`: Reviews a document (approve/reject)
5. `updateVerificationStatus`: Updates the overall verification status

### Mock Implementation

For development without a deployed canister, we've implemented a mock version that:

1. Uses a local Map to store verification requests
2. Simulates async behavior with real promises
3. Maintains the same type structure as the real canister
4. Includes sample data for testing the UI

## UI Component Implementation

### RevenueReportDetails

This component:
- Fetches and displays basic verification request information
- Shows the list of required and submitted documents
- Handles loading and error states

### SupportingDocumentViewer

This component:
- Displays uploaded documents with their status
- Provides UI for approving or rejecting documents
- Shows document review comments

### VerificationHistory

This component:
- Shows the history of verification comments
- Differentiates between internal and external comments
- Allows adding new comments

### RevenueApprovalControls

This component:
- Shows the current verification status
- Provides controls for approving/rejecting the entire report
- Has safeguards to prevent approval until all documents are verified

## Deployment Considerations

To deploy with a real canister:

1. Set `useMock` to `false` in `verification.service.ts`
2. Configure the environment variables:
   - `NEXT_PUBLIC_VERIFICATION_WORKFLOW_CANISTER_ID`: The canister ID
   - `NEXT_PUBLIC_IC_HOST`: The Internet Computer host (defaults to `https://ic0.app`)

3. Use the real canister IDL from your deployed canister (generated with `dfx generate`)

## Development Workflow

1. For local testing without a deployed canister, use the mock implementation
2. For testing with a local replica:
   - Start your dfx local replica with `dfx start`
   - Deploy the canister with `dfx deploy verification_workflow`
   - Update the service to connect to the local canister

## Best Practices

1. **Error Handling**: All service methods handle errors gracefully
2. **Loading States**: UI components show loading indicators during data fetching
3. **Type Safety**: Full TypeScript typing ensures consistency with the Motoko types
4. **Separation of Concerns**: Service layer is separate from UI components 