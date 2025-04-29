# Backend Architecture

This document outlines the backend architecture of the Fundly platform, detailing the various canisters, their responsibilities, and interactions.

## Overview

Fundly's backend is built on the Internet Computer Protocol (ICP) using Motoko as the primary programming language. The system is composed of multiple canisters, each responsible for a specific domain of functionality. This microservices-like architecture provides separation of concerns, scalability, and resilience.

## Canister Structure

Based on the project configuration in `dfx.json`, the following canisters form the backbone of the Fundly platform:

### Core Canisters

#### 1. NFT Canister (`nft_canister`)

**Purpose**: Manages all NFT-related functionality including creation, ownership, and trading.

**Key Responsibilities**:

- Creating new revenue-share NFTs for MSMEs
- Tracking NFT ownership and transfer history
- Managing NFT metadata
- Handling NFT marketplace listings
- Executing NFT purchases and transfers

**Main Interfaces**:

- `mintNFT`: Create a new NFT
- `transferNFT`: Transfer NFT ownership
- `getOwnedNFTs`: Get NFTs owned by an account
- `getNFTDetails`: Get detailed information about an NFT
- `listNFT`: List an NFT for sale
- `buyNFT`: Purchase a listed NFT

#### 2. Token Canister (`token_canister`)

**Purpose**: Manages the platform's native token (FND) and all token-related operations.

**Key Responsibilities**:

- Maintaining token balances
- Processing token transfers
- Handling token approvals
- Managing revenue distributions
- Recording transaction history

**Main Interfaces**:

- `transfer`: Transfer tokens between accounts
- `getBalance`: Get account balance
- `approve`: Approve token spending by another entity
- `distributeRevenue`: Distribute revenue to NFT holders
- `getTransactionHistory`: Get transaction history for an account

#### 3. MSME Registration Canister (`msme_registration`)

**Purpose**: Handles registration, profiles, and verification of MSMEs.

**Key Responsibilities**:

- Processing MSME registrations
- Storing MSME profile information
- Managing verification workflows
- Handling profile updates
- Storing verification documents

**Main Interfaces**:

- `registerMSME`: Register a new MSME
- `updateProfile`: Update MSME profile
- `submitForVerification`: Submit profile for verification
- `getMSMEProfile`: Get MSME profile details
- `uploadDocument`: Upload verification documents

#### 4. Verification Canister (`verification_canister`)

**Purpose**: Manages the verification process for MSMEs by verifiers.

**Key Responsibilities**:

- Assigning verification tasks to verifiers
- Tracking verification status
- Processing verification decisions
- Managing verifier accounts
- Storing verification history

**Main Interfaces**:

- `assignVerifier`: Assign a verifier to an MSME
- `submitVerification`: Submit verification result
- `getVerificationQueue`: Get queue of pending verifications
- `getVerificationHistory`: Get verification history
- `registerVerifier`: Register a new verifier

#### 5. Revenue Reporting Canister (`revenue_reporting`)

**Purpose**: Handles revenue reporting by MSMEs and calculations for distribution.

**Key Responsibilities**:

- Processing revenue reports
- Calculating distribution amounts
- Verifying revenue reports
- Maintaining revenue history
- Generating revenue analytics

**Main Interfaces**:

- `reportRevenue`: Submit revenue report
- `calculateDistribution`: Calculate token distribution
- `getRevenueHistory`: Get revenue history for an MSME
- `approveRevenueReport`: Approve submitted revenue report
- `getRevenueAnalytics`: Get revenue analytics

#### 6. User Management Canister (`user_canister`)

**Purpose**: Manages user accounts, profiles, and roles.

**Key Responsibilities**:

- User registration and authentication
- Profile management
- Role assignment and permissions
- User preferences
- Authentication integration with Internet Identity

**Main Interfaces**:

- `registerUser`: Register a new user
- `updateProfile`: Update user profile
- `assignRole`: Assign role to user
- `getUserProfile`: Get user profile details
- `authenticateUser`: Authenticate user

#### 7. Governance Canister (`governance_canister`)

**Purpose**: Manages platform governance, voting, and proposal systems.

**Key Responsibilities**:

- Proposal creation and management
- Voting processes
- Executing approved proposals
- Token-based governance
- Parameter changes to platform

**Main Interfaces**:

- `createProposal`: Create governance proposal
- `castVote`: Vote on proposal
- `getProposals`: Get active proposals
- `executeProposal`: Execute approved proposal
- `getVotingPower`: Get voting power for a user

### Backend Types

The backend uses a set of common types defined in `src/fundly_backend/types/lib.mo`:

#### Key Data Types:

1. **MSMEProfile**

   - Basic information about the MSME
   - Contact details
   - Business metrics
   - Verification status

2. **NFTMetadata**

   - NFT details
   - Revenue share percentage
   - Associated MSME
   - Pricing information

3. **UserProfile**

   - User information
   - Role information
   - Authentication details

4. **RevenueReport**

   - Revenue amount
   - Reporting period
   - Distribution calculations
   - Verification status

5. **VerificationStatus**
   - Current status
   - Verifier information
   - Verification history
   - Required documentation

## Inter-Canister Communication

The canisters communicate with each other to execute complex workflows:

### Key Workflows

#### MSME Registration and Verification Flow:

1. `user_canister` → `msme_registration`: User registers as MSME
2. `msme_registration` → `verification_canister`: MSME submitted for verification
3. `verification_canister` → `msme_registration`: Verification result updated

#### NFT Creation and Purchase Flow:

1. `msme_registration` → `nft_canister`: Verified MSME creates NFT
2. `nft_canister` → `token_canister`: User purchases NFT with tokens
3. `token_canister` → `nft_canister`: Token transfer confirmed, NFT ownership updated

#### Revenue Reporting and Distribution Flow:

1. `msme_registration` → `revenue_reporting`: MSME reports revenue
2. `revenue_reporting` → `verification_canister`: Revenue report verified
3. `revenue_reporting` → `token_canister`: Distribute tokens to NFT holders

## Security Model

The backend implements several security measures:

1. **Caller Verification**

   - Each canister validates the caller's identity
   - Role-based access control for sensitive operations
   - Principal-based ownership verification

2. **Data Validation**

   - Input validation on all public methods
   - Business rule enforcement
   - State consistency checks

3. **Inter-Canister Authentication**
   - Secure communication between canisters
   - Mutual authentication for inter-canister calls
   - Principle of least privilege

## Data Persistence

Data in Fundly is persisted through stable variables in each canister:

1. **Stable Storage**

   - Each canister maintains its own stable variables
   - Data structures designed for efficient upgrades
   - Migration strategies for canister upgrades

2. **Data Redundancy**
   - Critical data may be duplicated across canisters
   - Eventual consistency model where appropriate
   - Data integrity checks

## Scalability Considerations

The architecture addresses scalability through:

1. **Horizontal Scaling**

   - Multiple instances of high-throughput canisters
   - Sharding strategies for high-volume data
   - Load balancing across canister instances

2. **Efficient Data Structures**
   - Optimized data structures for common operations
   - Pagination for large data sets
   - Caching of frequently accessed data

## Error Handling

The backend implements robust error handling:

1. **Error Types**

   - Domain-specific error enums
   - Descriptive error messages
   - Error codes for client interpretation

2. **Failure Recovery**
   - Transaction rollback mechanisms
   - Retry strategies for failed operations
   - Circuit breakers for dependent services

## Testing Strategy

The backend testing strategy includes:

1. **Unit Testing**

   - Individual canister function testing
   - Mocked dependencies

2. **Integration Testing**

   - Inter-canister workflow testing
   - End-to-end business process validation

3. **Property-Based Testing**
   - Testing invariants across state changes
   - Fuzzing inputs to uncover edge cases

## Deployment Pipeline

The deployment process includes:

1. **Development Environment**

   - Local dfx environment
   - Mock data generation

2. **Staging Environment**

   - IC testnet deployment
   - Integration with frontend

3. **Production Environment**
   - IC mainnet deployment
   - Controlled canister upgrades

## Monitoring and Maintenance

Operations considerations include:

1. **Metrics Collection**

   - Cycle consumption monitoring
   - Error rate tracking
   - Performance metrics

2. **Maintenance Procedures**
   - Upgrade procedures
   - Backup strategies
   - Emergency response protocols

## Future Enhancements

Planned architectural improvements:

1. **Enhanced Scalability**

   - Additional sharding strategies
   - Optimized data structures

2. **Extended Functionality**
   - Integration with additional financial services
   - Enhanced governance mechanisms
   - Advanced analytics and reporting
