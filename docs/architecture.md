# System Architecture

## Overview

The ImpactInvest platform is built as a collection of specialized canisters (smart contracts) on the Internet Computer Protocol. Each canister focuses on a specific domain of functionality and interacts with other canisters to create a cohesive system.

## Canister Architecture

![Canister Architecture](./assets/canister-architecture.png)

The system consists of the following canisters:

1. **Authentication Canister**: Manages user accounts, roles, and session management
2. **MSME Registration Canister**: Handles MSME registration, profiles, and business details
3. **Verification Workflow Canister**: Manages document verification processes and workflows
4. **Token Canister**: Implements the ICRC-1/ICRC-2 standards for $FND tokens
5. **NFT Canister**: Implements the ICRC-7 standard for revenue-sharing NFTs
6. **Revenue Reporting Canister**: Manages revenue reporting and distribution to NFT holders

## Data Flow

### User Registration and Authentication
1. Users register through the Authentication Canister
2. Upon successful registration, they are assigned roles (MSME, Investor, Verifier, Admin)
3. Session tokens are issued for authentication

### MSME Registration and Verification
1. MSMEs register their business details through the MSME Registration Canister
2. Documentation is submitted for verification
3. Verification workflows are managed by the Verification Workflow Canister
4. Verification status is updated on the MSME profile

### NFT Creation and Marketplace
1. Verified MSMEs can create revenue-sharing NFTs through the NFT Canister
2. NFTs represent a percentage of future revenue
3. Investors can purchase NFTs using $FND tokens
4. NFT ownership is tracked in the NFT Canister

### Revenue Reporting and Distribution
1. MSMEs report revenue through the Revenue Reporting Canister
2. Revenue is distributed to NFT holders based on ownership percentages
3. Token transfers are executed through the Token Canister

## Inter-Canister Communication

Canisters communicate with each other through asynchronous calls. Key communication pathways include:

- **Authentication → All Canisters**: Role-based access control
- **MSME Registration ↔ Verification Workflow**: Document verification status updates
- **NFT ↔ MSME Registration**: Retrieving MSME details for NFTs
- **Revenue Reporting ↔ NFT**: Querying NFT ownership for revenue distribution
- **Revenue Reporting ↔ Token**: Executing token transfers for revenue distribution

## Security Model

The platform implements a role-based access control system:

- **Admin**: Full system access and configuration
- **MSME**: Business registration, profile management, revenue reporting
- **Investor**: NFT purchasing, portfolio management
- **Verifier**: Document verification and review

Each canister implements its own access control checks based on user roles managed by the Authentication Canister. 