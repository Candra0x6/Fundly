# Key Workflows

This document outlines the primary workflows in the Fundly platform, showing how different canisters interact during key operations.

## User Registration and Authentication Flow

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│   Frontend  │────▶│   Internet    │────▶│ Authentication │
│             │◀────│   Identity    │◀────│    Canister    │
└─────────────┘     └───────────────┘     └───────────────┘
```

1. **User Registration**:

   - User visits the Fundly platform and clicks "Sign Up"
   - User is redirected to Internet Identity for authentication
   - Internet Identity authenticates the user and generates a session
   - User is redirected back to Fundly with authentication data
   - Authentication canister creates a user profile with default Investor role

2. **User Login**:

   - User visits Fundly and clicks "Login"
   - Internet Identity authenticates the user
   - Authentication canister creates a session and returns a session token
   - Frontend stores the session token for subsequent API calls

3. **Role Assignment**:
   - Admin assigns roles to users (MSME, Investor, Verifier)
   - MSME role allows businesses to register and report revenue
   - Investor role allows purchasing NFTs and receiving revenue
   - Verifier role allows participation in the verification workflow

## MSME Registration Flow

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│   MSME      │────▶│     MSME      │────▶│  Verification  │
│   User      │◀────│  Registration  │◀────│   Workflow    │
└─────────────┘     └───────────────┘     └───────────────┘
                           │                      │
                           ▼                      ▼
                    ┌───────────────┐     ┌───────────────┐
                    │  Asset Storage│◀────│   Verifier    │
                    │    Canister   │────▶│     User      │
                    └───────────────┘     └───────────────┘
```

1. **MSME Profile Creation**:

   - User with MSME role creates a new MSME profile
   - MSME Registration canister stores basic profile information
   - MSME initially has "Unverified" status

2. **Document Submission**:

   - MSME uploads verification documents (business registration, tax documents, etc.)
   - Documents are stored in the Asset Storage canister
   - A verification request is created in the Verification Workflow canister
   - MSME status is updated to "PendingVerification"

3. **Verification Process**:
   - Verification officers review submitted documents
   - Officers can request additional information if needed
   - Upon successful verification, MSME status is updated to "Verified"
   - Rejected MSMEs receive feedback and can resubmit

## NFT Issuance Flow

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│  Verified   │────▶│      NFT      │────▶│ Asset Storage │
│    MSME     │◀────│    Canister   │◀────│    Canister   │
└─────────────┘     └───────────────┘     └───────────────┘
                           │
                           ▼
                    ┌───────────────┐
                    │    Frontend   │
                    │  Marketplace  │
                    └───────────────┘
                           │
                           ▼
                    ┌───────────────┐
                    │   Investor    │
                    │     User      │
                    └───────────────┘
```

1. **Revenue Share NFT Creation**:

   - Verified MSME creates a revenue share NFT
   - MSME specifies percentage of revenue to share (in basis points)
   - MSME uploads NFT artwork to Asset Storage canister
   - NFT Canister mints a new token with specified metadata

2. **NFT Listing**:

   - MSME lists NFT on the platform marketplace
   - Investors can browse available NFTs

3. **NFT Purchase**:
   - Investor purchases NFT using $FND tokens
   - Token canister transfers $FND from investor to MSME
   - NFT canister transfers token ownership to investor

## Revenue Reporting Flow

```
┌─────────────┐     ┌───────────────┐     ┌───────────────┐
│    MSME     │────▶│    Revenue    │────▶│      NFT      │
│    Owner    │◀────│   Reporting   │◀────│    Canister   │
└─────────────┘     └───────────────┘     └───────────────┘
                           │                      │
                           ▼                      ▼
                    ┌───────────────┐     ┌───────────────┐
                    │     Token     │────▶│   Investor    │
                    │    Canister   │     │     Users     │
                    └───────────────┘     └───────────────┘
```

1. **Revenue Reporting**:

   - MSME reports revenue through the platform
   - Revenue Reporting canister stores the revenue report
   - Reports include amount, description, and date range

2. **Distribution Calculation**:

   - Revenue Reporting canister queries NFT canister for issued tokens
   - For each token, it retrieves ownership and revenue share percentage
   - Distribution amounts are calculated based on share percentages

3. **Revenue Distribution**:
   - Token canister transfers $FND tokens to NFT holders
   - NFT canister records the distribution for each token
   - Revenue report is marked as "distributed"
   - Investors can view distribution history for their NFTs

## Distribution Flow

```
┌─────────────┐     ┌───────────────────────┐     ┌───────────────┐
│   Revenue   │────▶│ Calculate Distribution │────▶│   For Each   │
│   Report    │     │        Amounts         │     │     Token    │
└─────────────┘     └───────────────────────┘     └───────┬───────┘
                                                          │
                                                          ▼
                    ┌───────────────────────┐     ┌───────────────┐
                    │      Record Each      │◀────│  Transfer FND │
                    │      Distribution     │     │   to Owner    │
                    └───────────────────────┘     └───────────────┘
```

Detailed steps for revenue distribution:

1. **Identify Tokens**:

   - Revenue Reporting canister gets all tokens for the MSME
   - Query Revenue Share percentages for each token

2. **Calculate Share**:

   - For each token, calculate distribution amount:
     ```
     distributionAmount = (revenueAmount * sharePercentage) / totalSharePercentage
     ```

3. **Execute Transfers**:

   - For each NFT owner, transfer their share of $FND tokens
   - Record successful transfers in the NFT canister
   - Handle any failed transfers for retry

4. **Update Records**:
   - Mark revenue report as distributed
   - Store distribution transactions for audit and history

## Example Workflow

A complete example of the platform in action:

1. Coffee Shop registers as an MSME and goes through verification
2. Once verified, they issue 10 NFTs, each representing 5% of revenue (50% total)
3. Investors purchase these NFTs using $FND tokens
4. Each month, Coffee Shop reports their revenue (e.g., 10,000 $FND)
5. The system automatically distributes 50% of this (5,000 $FND) to NFT holders
6. Each NFT holder receives 500 $FND (5% of the total revenue)
7. Distributions are recorded and visible to all parties
