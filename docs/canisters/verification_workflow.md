# Verification Workflow Canister

## Overview

The Verification Workflow Canister manages the process of verifying MSMEs on the Fundly platform. It provides a structured workflow for submitting, reviewing, and approving verification documents, ensuring that MSMEs on the platform are legitimate businesses.

## Key Features

- MSME verification request management
- Document submission and review
- Verification officer assignment and management
- Comment system for communication
- Status tracking through the verification process

## Data Models

### VerificationOfficer

```motoko
type VerificationOfficer = {
    id : Principal;
    name : Text;
    department : Text;
    addedAt : Time.Time;
};
```

### VerificationStatus

```motoko
type VerificationStatus = {
    #Pending;
    #InReview;
    #Approved;
    #Rejected;
    #NeedsMoreInfo;
};
```

### VerificationRequest

```motoko
type VerificationRequest = {
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
type VerificationComment = {
    id : Text;
    author : Principal;
    text : Text;
    timestamp : Time.Time;
    isInternal : Bool; // True if visible only to verification officers
};
```

### Document

```motoko
type Document = {
    id : Text;
    name : Text;
    documentType : Text;
    fileUrl : Text; // Could be asset canister reference
    uploadedAt : Time.Time;
    uploadedBy : Principal;
    status : DocumentStatus;
    reviewComments : ?Text;
};
```

### DocumentStatus

```motoko
type DocumentStatus = {
    #Pending;
    #Approved;
    #Rejected;
};
```

### Error

```motoko
type Error = {
    #NotFound;
    #Unauthorized;
    #AlreadyExists;
    #InvalidInput;
    #SystemError;
};
```

## Public API Methods

### Officer Management

```motoko
addVerificationOfficer(
    officerId : Principal,
    name : Text,
    department : Text,
) : async Result.Result<(), Error>
```

Adds a new verification officer. Only admins can call this method.

```motoko
removeVerificationOfficer(officerId : Principal) : async Result.Result<(), Error>
```

Removes a verification officer. Only admins can call this method.

### Verification Request Management

```motoko
createVerificationRequest(
    msmeId : MSMEID,
    requiredDocuments : [Text],
) : async Result.Result<Text, Error>
```

Creates a new verification request for an MSME. Returns the request ID on success.

```motoko
assignRequest(
    requestId : Text,
    officerId : Principal,
) : async Result.Result<(), Error>
```

Assigns a verification request to a specific officer. Only verification officers or admins can call this method.

```motoko
addComment(
    requestId : Text,
    text : Text,
    isInternal : Bool,
) : async Result.Result<(), Error>
```

Adds a comment to a verification request. If `isInternal` is true, only verification officers can see it.

```motoko
uploadDocument(
    requestId : Text,
    name : Text,
    documentType : Text,
    fileUrl : Text,
) : async Result.Result<(), Error>
```

Uploads a document for a verification request. The document is stored in the Asset Storage canister, and a reference is stored here.

```motoko
reviewDocument(
    requestId : Text,
    documentId : Text,
    status : DocumentStatus,
    comments : ?Text,
) : async Result.Result<(), Error>
```

Reviews a submitted document. Only verification officers or admins can call this method.

```motoko
updateVerificationStatus(
    requestId : Text,
    status : VerificationStatus,
) : async Result.Result<(), Error>
```

Updates the status of a verification request. Only verification officers or admins can call this method.

### Query Methods

```motoko
getVerificationRequest(requestId : Text) : async Result.Result<VerificationRequest, Error>
```

Retrieves a verification request by ID.

```motoko
getVerificationOfficers() : async [VerificationOfficer]
```

Retrieves all verification officers. Only verification officers or admins can call this method.

```motoko
getPendingVerificationRequests() : async [VerificationRequest]
```

Retrieves all pending verification requests.

```motoko
getRequestsAssignedToOfficer(officerId : Principal) : async [VerificationRequest]
```

Retrieves all verification requests assigned to a specific officer.

```motoko
getRequestsForMSME(msmeId : MSMEID) : async [VerificationRequest]
```

Retrieves all verification requests for a specific MSME.

## Usage Examples

### Creating a Verification Request

```motoko
// MSME Registration canister creates a verification request
let createResult = await VerificationWorkflow.createVerificationRequest(
    "MSME123",
    ["Business Registration", "Tax Certificate", "Owner ID"]
);

switch (createResult) {
    case (#ok(requestId)) {
        // Request created successfully
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Uploading Documents

```motoko
// MSME uploads a document
let uploadResult = await VerificationWorkflow.uploadDocument(
    "VR123",
    "Business Registration Certificate",
    "registration",
    "asset-canister/asset456"
);

switch (uploadResult) {
    case (#ok(_)) {
        // Document uploaded successfully
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Reviewing Documents

```motoko
// Verification officer reviews a document
let reviewResult = await VerificationWorkflow.reviewDocument(
    "VR123",
    "DOC456",
    #Approved,
    ?"Document verified and matches business information"
);

switch (reviewResult) {
    case (#ok(_)) {
        // Document reviewed successfully
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Updating Verification Status

```motoko
// Verification officer approves an MSME
let updateResult = await VerificationWorkflow.updateVerificationStatus(
    "VR123",
    #Approved
);

switch (updateResult) {
    case (#ok(_)) {
        // Status updated successfully
        // This would trigger an update in the MSME Registration canister
    };
    case (#err(error)) {
        // Handle error
    };
}
```

## Implementation Details

### Verification Process Flow

1. **Request Creation**:

   - MSME Registration canister creates a verification request
   - Required documents are specified

2. **Assignment**:

   - Admin or verification officer assigns the request to a specific officer
   - Status changes to InReview

3. **Document Submission**:

   - MSME uploads required documents
   - Documents are stored in Asset Storage canister
   - References are stored in the verification request

4. **Document Review**:

   - Verification officer reviews each document
   - Documents can be approved or rejected
   - Comments can be added for clarity

5. **Status Updates**:

   - Based on document reviews, the request status is updated
   - If all required documents are approved, the MSME can be verified
   - If issues are found, the status can be set to NeedsMoreInfo or Rejected

6. **Completion**:
   - When a request is Approved or Rejected, the MSME Registration canister is notified
   - MSME status is updated accordingly

### Storage

The Verification Workflow canister uses two main storage structures:

- `verificationOfficers`: Maps officer principals to VerificationOfficer objects
- `verificationRequests`: Maps request IDs to VerificationRequest objects

### ID Generation

- Request IDs are generated with a "VR" prefix followed by a sequential number
- Comment IDs are generated with a "CM" prefix followed by a timestamp
- Document IDs are generated with a "DOC" prefix followed by a timestamp

## Security Considerations

- **Role-based Access Control**: Only admins can add or remove verification officers
- **Permission Checking**: Only assigned officers can review documents
- **Audit Trail**: All actions are timestamped and tracked
- **Comment Visibility**: Internal comments are only visible to verification officers

## Best Practices

### For Verification Officers

1. **Thorough Document Review**:

   - Check document authenticity and validity
   - Ensure documents match the MSME information
   - Add clear comments explaining approval or rejection reasons

2. **Communication**:
   - Use comments to communicate with MSMEs when more information is needed
   - Provide clear instructions for rejected documents

### For MSMEs

1. **Document Preparation**:

   - Have all required documents ready before starting verification
   - Ensure documents are clear, legible, and valid
   - Upload documents in the correct categories

2. **Responsive Communication**:
   - Monitor verification status and respond promptly to requests for more information
   - Address any issues highlighted in document rejections

## Canister Interactions

The Verification Workflow canister interacts with:

- **MSME Registration Canister**: For updating MSME verification status
- **Asset Storage Canister**: For storing and retrieving documents
- **Authentication Canister**: For verifying officer permissions

## Example Verification Checklist

A typical verification process might require these documents:

1. **Business Registration**:

   - Official registration certificate
   - Business license

2. **Financial Documents**:

   - Tax registration certificate
   - Bank account information

3. **Ownership Verification**:

   - Owner ID proof
   - Proof of address

4. **Business Operations**:
   - Business plan
   - Financial statements
