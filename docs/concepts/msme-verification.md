# MSME Verification

## Overview

MSME verification is a core process within the ImpactInvest platform that establishes trust between MSMEs and investors. The verification workflow ensures that businesses on the platform are legitimate and their documentation is valid.

## Verification Statuses

MSMEs can have one of the following verification statuses:

- **Unverified**: Initial state of a newly registered MSME
- **Under Review**: MSME has submitted documentation and is awaiting verification
- **Partially Verified**: Some documentation has been verified, but additional verification is needed
- **Verified**: All required documentation has been verified
- **Rejected**: Verification has been rejected due to issues with documentation

## Verification Process

1. **Registration**: MSME registers on the platform through the MSME Registration Canister
2. **Documentation Submission**: MSME submits required documentation such as:
   - Business registration certificates
   - Financial statements
   - Identity documents for team members
   - Tax compliance certificates
3. **Verification Request**: MSME requests verification of their profile
4. **Assignment**: A verification officer is assigned to review the documentation
5. **Review Process**: Each document is individually reviewed and marked as verified or rejected
6. **Status Update**: The MSME's verification status is updated based on the review results

## Technical Implementation

The verification process is managed through the Verification Workflow Canister, which handles:

1. **Verification Requests**: Creation and tracking of verification requests
2. **Officer Assignment**: Assigning verification officers to requests
3. **Document Review**: Tracking individual document verification status
4. **Status Updates**: Communicating verification results to the MSME Registration Canister

## Verification Officers

Verification officers are specialized users with the Verifier role who:

1. Review submitted documentation
2. Verify the authenticity of documents
3. Request additional information if needed
4. Approve or reject verification requests

## Security and Trust Model

The verification process implements several security features:

1. **Role-Based Access Control**: Only authorized verification officers can approve documents
2. **Verification Levels**: Different verification levels require different levels of scrutiny
3. **Audit Trail**: All verification actions are recorded with timestamps and officer identification
4. **Document Verification Record**: Each document maintains a verification status and history

## Benefits of Verification

- **For MSMEs**: Verified status increases trust and visibility to potential investors
- **For Investors**: Reduced risk through verification of business legitimacy
- **For Platform**: Maintained quality and trustworthiness of listed MSMEs

## Example Verification Flow

1. An MSME registers on the platform
2. The MSME uploads business registration documents, financial statements, and team information
3. The MSME requests verification
4. A verification officer is assigned to the request
5. The officer reviews each document and marks them as verified
6. The MSME's status is updated to "Verified"
7. The MSME can now create revenue-sharing NFTs

For a visual representation of this flow, see the [MSME Verification Flow Diagram](msme-verification-diagram.md).