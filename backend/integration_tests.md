# Integration Testing for ImpactInvest Platform

## Overview

This document outlines the comprehensive testing strategy for the ImpactInvest (Fundly) platform, focusing on ensuring all canisters work correctly together to deliver a functional and secure system.

## Test Environments

- Local: Development environment using `dfx` local replica
- Staging: IC testnet deployment
- Production: IC mainnet deployment

## Canister Test Strategy

### 1. Authentication Canister

#### Unit Tests

- Test user registration with different roles
- Test profile retrieval and updates
- Test login/session management
- Test role-based access control
- Test error handling for invalid principals

#### Integration Tests

- Test authentication integration with other canisters
- Verify proper permission enforcement across workflows

```motoko
// Example test for user registration
let result = await Authentication.registerUser(?"testuser", ?"test@example.com", #Investor);
assert(Result.isOk(result));

// Example test for permissions
let authResult = await Authentication.hasRole(principal, #MSME);
assert(Result.isOk(authResult) and Result.unwrap(authResult) == true);
```

### 2. MSME Registration Canister

#### Unit Tests

- Test MSME profile creation and validation
- Test profile updates and retrieval
- Test error handling for invalid data

#### Integration Tests

- Test authentication requirement for MSME operations
- Test integration with verification workflow
- Test integration with asset storage for documents

```motoko
// Example test for MSME registration
let msmeResult = await MSMERegistration.registerMSME({
  name = "Test Business";
  description = "Test description";
  // other required fields
});
assert(Result.isOk(msmeResult));

// Example integration test with verification
let verificationResult = await VerificationWorkflow.initiateVerification(msmeId);
assert(Result.isOk(verificationResult));
```

### 3. Verification Workflow Canister

#### Unit Tests

- Test verification request processing
- Test approval/rejection workflows
- Test verification status updates

#### Integration Tests

- Test integration with MSME registration
- Test integration with authentication for verifier permissions

```motoko
// Example test for verification workflow
let verificationId = await VerificationWorkflow.initiateVerification(msmeId);
let approvalResult = await VerificationWorkflow.approveVerification(verificationId);
assert(Result.isOk(approvalResult));

// Check MSME status update
let msmeProfile = await MSMERegistration.getMSMEById(msmeId);
assert(msmeProfile.verificationStatus == #Verified);
```

### 4. Asset Storage Canister

#### Unit Tests

- Test document upload and retrieval
- Test access control for documents
- Test document metadata management

#### Integration Tests

- Test integration with MSME registration for document attachments
- Test integration with verification workflow for document verification

```motoko
// Example test for asset upload
let uploadResult = await AssetStorage.uploadDocument(msmeId, "verification", documentBytes);
assert(Result.isOk(uploadResult));

// Test document retrieval with permissions
let documentResult = await AssetStorage.getDocument(documentId, caller);
assert(Result.isOk(documentResult));
```

### 5. Revenue Reporting Canister

#### Unit Tests

- Test revenue report submission
- Test revenue data validation
- Test report retrieval and listing

#### Integration Tests

- Test integration with MSME registration (only verified MSMEs)
- Test integration with token distribution

```motoko
// Example test for revenue reporting
let reportResult = await RevenueReporting.submitReport({
  msmeId = msmeId;
  reportPeriod = { startDate = startTime; endDate = endTime };
  totalRevenue = 10000;
  // other fields
});
assert(Result.isOk(reportResult));

// Test integration with distribution
let distributionResult = await RevenueReporting.processDistribution(reportId);
assert(Result.isOk(distributionResult));
```

### 6. Token Canister

#### Unit Tests

- Test token minting and distribution
- Test balance tracking
- Test transfer functions

#### Integration Tests

- Test integration with revenue reporting for distributions
- Test integration with authentication for permissions

```motoko
// Example test for token operations
let mintResult = await Token.mint(recipient, 1000);
assert(Result.isOk(mintResult));

// Test integration with revenue distribution
let distributionResult = await Token.distributeRevenue(msmeId, 5000);
assert(Result.isOk(distributionResult));
```

### 7. NFT Canister

#### Unit Tests

- Test NFT minting
- Test ownership transfer
- Test metadata management

#### Integration Tests

- Test integration with MSME registration for NFT issuance
- Test integration with token distribution based on NFT ownership

```motoko
// Example test for NFT minting
let mintResult = await NFT.mintNFT(msmeId, owner, metadata);
assert(Result.isOk(mintResult));

// Test ownership verification
let ownershipCheck = await NFT.isOwner(tokenId, principal);
assert(ownershipCheck == true);
```

## End-to-End Workflow Tests

### 1. MSME Registration and Verification Workflow

```motoko
// 1. Register MSME
let msmeResult = await MSMERegistration.registerMSME(msmeData);
let msmeId = Result.unwrap(msmeResult).id;

// 2. Upload verification documents
let docResult = await AssetStorage.uploadDocument(msmeId, "verification", documentBytes);
let docId = Result.unwrap(docResult);

// 3. Initiate verification
let verificationResult = await VerificationWorkflow.initiateVerification(msmeId);
let verificationId = Result.unwrap(verificationResult);

// 4. Verifier approves
let approvalResult = await VerificationWorkflow.approveVerification(verificationId);
assert(Result.isOk(approvalResult));

// 5. Check MSME status update
let msmeProfile = await MSMERegistration.getMSMEById(msmeId);
assert(msmeProfile.verificationStatus == #Verified);
```

### 2. NFT Issuance and Investment Workflow

```motoko
// 1. Issue NFTs for verified MSME
let nftResult = await NFT.createMSMENFTCollection(msmeId, "Test MSME Shares", 100);
let collectionId = Result.unwrap(nftResult);

// 2. Investor purchases NFT
let purchaseResult = await NFT.transferNFT(tokenId, investorPrincipal);
assert(Result.isOk(purchaseResult));

// 3. Verify ownership
let ownershipCheck = await NFT.isOwner(tokenId, investorPrincipal);
assert(ownershipCheck == true);
```

### 3. Revenue Reporting and Distribution Workflow

```motoko
// 1. MSME submits revenue report
let reportResult = await RevenueReporting.submitReport(revenueData);
let reportId = Result.unwrap(reportResult).id;

// 2. Trigger distribution
let distributionResult = await RevenueReporting.processDistribution(reportId);
assert(Result.isOk(distributionResult));

// 3. Verify token balances updated for NFT holders
let investorBalance = await Token.balanceOf(investorPrincipal);
assert(investorBalance > 0);
```

## Security Testing

### Authentication and Authorization

- Test authentication bypass attempts
- Test role-based permission enforcement
- Test session validation and expiration
- Test cross-canister call authentication

### Data Validation

- Test input validation for all public methods
- Test boundary conditions and edge cases
- Test malformed input handling

### Access Control

- Test proper enforcement of ownership restrictions
- Test document access permissions
- Test admin-only functions

## Performance Testing

### Load Testing

- Test concurrent user registration (100 simultaneous users)
- Test NFT minting performance (500 NFTs)
- Test revenue distribution performance (1000 token holders)

### Cycle Consumption Analysis

- Measure cycle consumption for key operations
- Optimize functions with high cycle usage
- Set appropriate cycle limits for operations

### Response Time Measurement

- Measure and document response times for critical operations
- Ensure UI responsiveness under various conditions

## Testing Schedule

1. Unit tests: Continuous during development
2. Integration tests: Weekly builds
3. End-to-end tests: Bi-weekly
4. Security testing: Monthly
5. Performance testing: Monthly

## Reporting

Test results will be documented in a test report including:

1. Test coverage metrics
2. Identified issues and resolutions
3. Performance benchmarks
4. Security assessment findings

## Conclusion

This comprehensive testing plan ensures the Fundly platform functions correctly as an integrated system, providing a secure and reliable experience for all users.
