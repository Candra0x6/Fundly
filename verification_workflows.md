# MSME Verification Workflows

This document outlines the verification processes for MSMEs in the system, detailing how businesses move from unverified to verified status.

## Verification Status Types

Based on the codebase, MSMEs can have the following verification statuses:

1. **Unverified** - Initial status for newly registered MSMEs
2. **UnderReview** - MSME profile is being reviewed by verifiers
3. **PartiallyVerified** - Some aspects of the MSME have been verified
4. **Verified** - MSME is fully verified with verification credentials
5. **Rejected** - MSME verification was rejected with a reason

## Verification Fields

The system supports verification of specific fields:
- **Identity** - Verification of the owner's identity
- **BusinessRegistration** - Verification of business registration documents
- **FinancialRecords** - Verification of financial statements and records
- **ImpactCredentials** - Verification of social impact claims
- **Other** - Additional custom verification fields

## Verification Process Flows

### 1. MSME Document Submission Flow

```mermaid
sequenceDiagram
    Actor MSME
    MSME->>MSMERegistration: registerMSME(registrationArgs)
    MSMERegistration-->>MSME: Return MSME ID
    MSME->>AssetStorage: uploadDocument(file, metadata)
    AssetStorage-->>MSME: Return asset ID
    MSME->>MSMERegistration: addDocument(msmeId, docInfo)
    MSMERegistration->>MSMERegistration: Link document to MSME
    MSMERegistration-->>MSME: Confirm document addition
    MSME->>VerificationWorkflow: requestVerification(msmeId)
    VerificationWorkflow->>VerificationWorkflow: Change status to UnderReview
    VerificationWorkflow-->>MSME: Confirm verification request
```

**Functions Involved:**
- `uploadDocument` - Uploads document to asset storage
- `addDocument` - Links document to MSME profile
- `requestVerification` - Requests verification for an MSME

### 2. Verifier Assignment Flow

```mermaid
sequenceDiagram
    Actor Admin
    Admin->>VerificationWorkflow: assignVerifier(msmeId, verifierPrincipal)
    VerificationWorkflow->>Authentication: Verify user has Verifier role
    Authentication-->>VerificationWorkflow: Confirm verifier status
    VerificationWorkflow->>VerificationWorkflow: Create verification task
    VerificationWorkflow-->>Admin: Confirm assignment
    
    Actor Verifier
    Verifier->>VerificationWorkflow: getAssignedTasks()
    VerificationWorkflow-->>Verifier: Return list of assigned MSMEs
```

**Functions Involved:**
- `assignVerifier` - Assigns a verifier to review an MSME
- `getAssignedTasks` - Gets list of MSMEs assigned to a verifier

### 3. Verification Review Flow

```mermaid
sequenceDiagram
    Actor Verifier
    Verifier->>MSMERegistration: getMSMEDetails(msmeId)
    MSMERegistration-->>Verifier: Return MSME profile
    Verifier->>MSMERegistration: getMSMEDocuments(msmeId)
    MSMERegistration-->>Verifier: Return MSME documents
    Verifier->>AssetStorage: viewDocument(assetId)
    AssetStorage-->>Verifier: Return document content
    Verifier->>VerificationWorkflow: verifyField(msmeId, field, verificationData)
    VerificationWorkflow->>VerificationWorkflow: Update verification status
    VerificationWorkflow-->>Verifier: Confirm field verification
```

**Functions Involved:**
- `getMSMEDetails` - Gets detailed profile of an MSME
- `getMSMEDocuments` - Gets list of documents for an MSME
- `viewDocument` - Views content of a specific document
- `verifyField` - Marks a specific field as verified

### 4. Document Verification Flow

```mermaid
sequenceDiagram
    Actor Verifier
    Verifier->>MSMERegistration: getMSMEDocuments(msmeId)
    MSMERegistration-->>Verifier: Return MSME documents
    Verifier->>AssetStorage: viewDocument(assetId)
    AssetStorage-->>Verifier: Return document content
    Verifier->>MSMERegistration: verifyDocument(msmeId, documentId)
    MSMERegistration->>MSMERegistration: Mark document as verified
    MSMERegistration-->>Verifier: Confirm document verification
```

**Functions Involved:**
- `getMSMEDocuments` - Gets list of documents for an MSME
- `viewDocument` - Views content of a specific document
- `verifyDocument` - Marks a document as verified

### 5. Final Verification Approval Flow

```mermaid
sequenceDiagram
    Actor Verifier
    Verifier->>VerificationWorkflow: getVerificationProgress(msmeId)
    VerificationWorkflow-->>Verifier: Return verification progress
    Verifier->>VerificationWorkflow: completeVerification(msmeId, verificationData)
    VerificationWorkflow->>VerificationWorkflow: Change status to Verified
    VerificationWorkflow->>VerificationWorkflow: Generate verification credentials
    VerificationWorkflow-->>Verifier: Confirm verification completed
    
    VerificationWorkflow->>MSMERegistration: updateVerificationStatus(msmeId, status)
    MSMERegistration->>MSMERegistration: Update MSME record
    MSMERegistration-->>VerificationWorkflow: Confirm status update
```

**Functions Involved:**
- `getVerificationProgress` - Gets current verification progress
- `completeVerification` - Completes the verification process
- `updateVerificationStatus` - Updates the MSME's verification status

### 6. Rejection Flow

```mermaid
sequenceDiagram
    Actor Verifier
    Verifier->>VerificationWorkflow: rejectVerification(msmeId, reason)
    VerificationWorkflow->>VerificationWorkflow: Change status to Rejected
    VerificationWorkflow->>MSMERegistration: updateVerificationStatus(msmeId, rejected)
    MSMERegistration->>MSMERegistration: Update MSME record
    MSMERegistration-->>VerificationWorkflow: Confirm status update
    VerificationWorkflow-->>Verifier: Confirm rejection processed
    
    Actor MSME
    MSME->>MSMERegistration: getVerificationStatus(msmeId)
    MSMERegistration-->>MSME: Return rejection with reason
```

**Functions Involved:**
- `rejectVerification` - Rejects an MSME verification
- `updateVerificationStatus` - Updates the MSME's verification status
- `getVerificationStatus` - Gets current verification status

## Verification Levels

The system supports multiple verification levels:

1. **Level 1** - Basic verification (identity and business registration)
2. **Level 2** - Standard verification (includes financial records)
3. **Level 3** - Premium verification (comprehensive verification with impact credentials)

## Verification Data Structure

```motoko
public type VerificationData = {
    verifiedBy : Principal;
    verificationDate : Time.Time;
    expiryDate : ?Time.Time;
    verificationLevel : Nat; // 1-3, with 3 being highest
    credentials : ?Text; // Reference to verification credential
};
```

## Re-verification Process

Verifications may have an expiry date, after which the MSME needs to undergo re-verification:

```mermaid
sequenceDiagram
    Actor System
    System->>VerificationWorkflow: checkExpiringVerifications()
    VerificationWorkflow->>VerificationWorkflow: Identify expired verifications
    VerificationWorkflow->>MSMERegistration: updateVerificationStatus(msmeId, needsReverification)
    MSMERegistration-->>VerificationWorkflow: Confirm status update
    VerificationWorkflow->>NotificationService: notifyMSME(msmeId, message)
    
    Actor MSME
    MSME->>VerificationWorkflow: requestReverification(msmeId)
    VerificationWorkflow->>VerificationWorkflow: Create reverification task
    VerificationWorkflow-->>MSME: Confirm reverification request
```

**Functions Involved:**
- `checkExpiringVerifications` - System check for expiring verifications
- `requestReverification` - MSME requests reverification

## Verification Appeal Process

If an MSME is rejected, they can appeal the decision:

```mermaid
sequenceDiagram
    Actor MSME
    MSME->>VerificationWorkflow: appealRejection(msmeId, appealDetails)
    VerificationWorkflow->>VerificationWorkflow: Create appeal record
    VerificationWorkflow-->>MSME: Confirm appeal received
    
    Actor Admin
    Admin->>VerificationWorkflow: reviewAppeal(appealId)
    Admin->>VerificationWorkflow: resolveAppeal(appealId, decision)
    VerificationWorkflow->>VerificationWorkflow: Process appeal decision
    VerificationWorkflow->>MSMERegistration: updateVerificationStatus(msmeId, newStatus)
    MSMERegistration-->>VerificationWorkflow: Confirm status update
    VerificationWorkflow-->>Admin: Confirm appeal resolved
```

**Functions Involved:**
- `appealRejection` - MSME appeals a verification rejection
- `reviewAppeal` - Admin reviews an appeal
- `resolveAppeal` - Admin resolves an appeal with a decision 