# System Architecture

## Overview

Fundly is built on the Internet Computer Protocol (ICP) using a microservices-like architecture with multiple canisters (ICP's equivalent of containerized services). Each canister is responsible for a specific domain of functionality, enabling modular development and scalability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend Application                         │
└───────────────────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           Internet Identity                          │
└───────────────────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Authentication Canister                      │
└───────────┬─────────────┬─────────────┬─────────────┬───────────────┘
            │             │             │             │
            ▼             ▼             ▼             ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Token FND   │ │Revenue Share  │ │     MSME      │ │  Verification │
│   Canister    │ │  NFT Canister │ │ Registration  │ │   Workflow    │
└───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
        │                 │                 │                 │
        └────────┬────────┘                 └────────┬────────┘
                 │                                   │
                 ▼                                   ▼
        ┌────────────────┐                 ┌─────────────────┐
        │    Revenue     │                 │  Asset Storage  │
        │   Reporting    │                 │    Canister     │
        └────────────────┘                 └─────────────────┘
```

## Key Components

### Frontend Application

- User interface for interacting with the Fundly platform
- Built with modern web technologies (React, TypeScript, etc.)
- Communicates with backend canisters via Candid interface

### Internet Identity

- Decentralized authentication system provided by DFINITY
- Allows users to authenticate without usernames/passwords
- Integrated with the Fundly authentication system

### Authentication Canister

- Manages user profiles and roles (Admin, MSME, Investor, Verifier)
- Handles session management
- Integrates with Internet Identity
- Provides authorization for other canisters

### Token ($FND) Canister

- Implements the ICRC-1/ICRC-2 token standard
- Manages the platform's utility token
- Handles token transfers, approvals, and allowances
- Used for transaction fees and revenue distribution

### Revenue Share NFT Canister

- Implements the ICRC-7 NFT standard
- Creates and manages NFTs that represent revenue-sharing agreements
- Tracks revenue share percentages
- Handles ownership and transfer of revenue share tokens

### MSME Registration Canister

- Manages MSME profiles and metadata
- Handles registration and verification processes
- Integrates with verification workflow

### Verification Workflow Canister

- Manages the verification process for MSMEs
- Handles document submission and review
- Tracks verification status and history

### Revenue Reporting Canister

- Processes revenue reports from MSMEs
- Calculates distribution amounts based on NFT ownership
- Handles the distribution of revenue to NFT holders

### Asset Storage Canister

- Stores digital assets such as MSME documents and NFT media
- Handles chunked file uploads for larger files
- Associates assets with specific entities (MSMEs or NFTs)

## Data Flow

1. **User Registration & Authentication**:

   - Users register through Internet Identity
   - Authentication canister maintains user profiles and sessions

2. **MSME Registration & Verification**:

   - MSMEs submit registration information and documents
   - Verification workflow processes submissions
   - MSME profiles become verified

3. **NFT Issuance**:

   - Verified MSMEs can issue revenue-sharing NFTs
   - NFTs specify revenue share percentages
   - Investors purchase NFTs using $FND tokens

4. **Revenue Reporting & Distribution**:
   - MSMEs report revenue through the platform
   - Revenue reporting canister calculates distributions
   - $FND tokens are automatically distributed to NFT holders

## Security Architecture

- **Principals-based Access Control**: Each user is identified by their ICP principal
- **Role-based Authorization**: Different roles have different permissions
- **Canister Isolation**: Each canister has specific capabilities
- **Inter-canister Authentication**: Canisters validate calls from other canisters

## Scalability Considerations

- Canisters operate independently, allowing for horizontal scaling
- Asset storage uses chunked uploads to handle large files
- Distribution processes can be batched for efficiency
