# Frontend Pages Architecture

This document outlines the page structure for the Fundly platform's user interface, detailing the core pages, their functionality, and the user flows between them.

## Overview

The Fundly frontend is organized into several key sections, each serving a specific user need or workflow. The UI uses the reusable components defined in `frontend-components.md` to maintain consistency across the platform.

## Core Pages

### Authentication Pages

#### 1. Landing Page

- **Purpose**: Introduce the platform to new users and provide access to authentication
- **Key Components**:
  - Hero section with platform overview
  - Value proposition highlights
  - Quick access to Login/Register
  - Footer with platform information
- **Actions**:
  - Navigate to Login/Register
  - Learn more about platform features

#### 2. Login Page

- **Purpose**: Allow existing users to authenticate
- **Key Components**:
  - `LoginForm` component
  - Internet Identity integration
  - Password recovery option
- **Actions**:
  - Authenticate user
  - Recover forgotten password
  - Navigate to registration

#### 3. Registration Page

- **Purpose**: Allow new users to create accounts
- **Key Components**:
  - `RegistrationForm` component
  - Role selection (Investor, MSME, Verifier)
  - Terms and conditions acceptance
- **Actions**:
  - Create new account
  - Select user role
  - Navigate to login

### Dashboard Section

#### 4. Main Dashboard

- **Purpose**: Provide overview of user's activity and platform status
- **Key Components**:
  - `MainNavbar` and `SideNavigation`
  - `PortfolioSummary` (for investors)
  - `MSMESummary` (for MSME owners)
  - `VerificationQueue` (for verifiers)
  - `RecentActivityFeed`
  - `QuickActionPanel`
- **Actions**:
  - View portfolio/business metrics
  - Access primary platform functions
  - Review recent activity

#### 5. Portfolio Page

- **Purpose**: Display detailed investment information for investors
- **Key Components**:
  - `NFTPortfolioList`
  - `RevenuePerformanceChart`
  - `PortfolioMetrics`
  - `NFTFilterControls`
- **Actions**:
  - View owned NFTs
  - Filter investments by metrics
  - Track revenue performance

#### 6. Transaction History

- **Purpose**: Show history of user's platform transactions
- **Key Components**:
  - `TransactionTable`
  - `TransactionFilters`
  - `DateRangePicker`
  - `TransactionSummary`
- **Actions**:
  - View past transactions
  - Filter by transaction type
  - Export transaction data

### MSME Management Section

#### 7. MSME Registration

- **Purpose**: Allow users to register as MSMEs
- **Key Components**:
  - `MSMERegistrationMultiStepForm`
  - `DocumentUploader`
  - `RegistrationProgress`
  - `VerificationRequirements`
- **Actions**:
  - Complete registration form
  - Upload verification documents
  - Submit for verification

#### 8. MSME Profile

- **Purpose**: Display and manage MSME information
- **Key Components**:
  - `MSMEProfileCard`
  - `BusinessMetrics`
  - `VerificationStatus`
  - `ProfileEditControls`
  - `IssuedNFTsList`
- **Actions**:
  - View MSME details
  - Edit profile information
  - Monitor verification status
  - View issued NFTs

#### 9. Revenue Reporting

- **Purpose**: Allow MSMEs to report revenue for distribution
- **Key Components**:
  - `RevenueReportForm`
  - `RevenueHistoryTable`
  - `DistributionPreview`
  - `RevenueCalculator`
- **Actions**:
  - Submit revenue reports
  - View past reports
  - Preview token distribution
  - Download reports

### NFT Marketplace Section

#### 10. NFT Marketplace

- **Purpose**: Browse and purchase available NFTs
- **Key Components**:
  - `NFTSearchFilters`
  - `NFTGrid`
  - `NFTSortControls`
  - `CategoryNavigation`
  - `FeaturedNFTCarousel`
- **Actions**:
  - Browse NFTs
  - Filter by category, price, etc.
  - View NFT details

#### 11. NFT Detail Page

- **Purpose**: Show detailed information about a specific NFT
- **Key Components**:
  - `NFTDetailCard`
  - `MSMEInfoCard`
  - `RevenueProjection`
  - `PurchasePanel`
  - `NFTHistory`
- **Actions**:
  - View NFT information
  - Purchase NFT
  - View MSME details
  - Review revenue history

#### 12. NFT Creation

- **Purpose**: Allow MSMEs to create revenue-share NFTs
- **Key Components**:
  - `NFTCreationForm`
  - `RevenueShareCalculator`
  - `PreviewNFT`
  - `TermsEditor`
- **Actions**:
  - Configure NFT details
  - Set revenue share percentage
  - Preview NFT listing
  - Submit NFT to marketplace

### Verification Portal

#### 13. Verification Dashboard

- **Purpose**: Allow verifiers to manage verification tasks
- **Key Components**:
  - `VerificationQueue`
  - `VerificationFilters`
  - `MSMEVerificationCard`
  - `VerificationMetrics`
- **Actions**:
  - View pending verifications
  - Select MSME to verify
  - Track verification performance

#### 14. MSME Verification Page

- **Purpose**: Review and process MSME verification
- **Key Components**:
  - `DocumentReviewer`
  - `VerificationChecklist`
  - `MSMEDetailReview`
  - `DecisionControls`
  - `FeedbackForm`
- **Actions**:
  - Review MSME documents
  - Check verification criteria
  - Approve or reject verification
  - Provide feedback

#### 15. Revenue Verification Page

- **Purpose**: Review and verify revenue reports
- **Key Components**:
  - `RevenueReportDetails`
  - `SupportingDocumentViewer`
  - `VerificationHistory`
  - `RevenueApprovalControls`
- **Actions**:
  - Review reported revenue
  - Check supporting documents
  - Approve or flag reports
  - Request additional information

### User Profile Section

#### 16. User Profile

- **Purpose**: Manage user account and preferences
- **Key Components**:
  - `ProfileInformation`
  - `SecuritySettings`
  - `NotificationPreferences`
  - `RoleManagement`
  - `ActivityLog`
- **Actions**:
  - Update profile information
  - Manage security settings
  - Configure notifications
  - View account activity

#### 17. Wallet Management

- **Purpose**: Manage tokens and wallet operations
- **Key Components**:
  - `WalletBalance`
  - `TokenActivityTable`
  - `AddFundsForm`
  - `WithdrawForm`
  - `TokenExchangeRate`
- **Actions**:
  - View token balance
  - Add or withdraw funds
  - View token activity
  - Manage wallet settings

### Governance Section

#### 18. Governance Portal

- **Purpose**: Participate in platform governance
- **Key Components**:
  - `ProposalsList`
  - `VotingInterface`
  - `GovernanceMetrics`
  - `ProposalCreationForm`
- **Actions**:
  - View active proposals
  - Vote on proposals
  - Create new proposals
  - Track voting power

## User Flows

### MSME User Flow

1. Register account → Complete MSME registration → Upload verification documents
2. Monitor verification status → Create NFT → Monitor investments
3. Report revenue → Distribute tokens → View platform metrics

### Investor User Flow

1. Register account → Browse marketplace → View NFT details
2. Purchase NFT → Monitor portfolio → Receive revenue distributions
3. View transaction history → Manage wallet → Participate in governance

### Verifier User Flow

1. Register account (assigned verifier role) → Access verification portal
2. Process MSME verifications → Verify revenue reports → Track verification metrics

## Responsive Design

All pages adapt to these screen sizes:

- **Mobile** (< 640px): Single column layout, collapsible navigation
- **Tablet** (640px - 1024px): Two column layout where appropriate
- **Desktop** (> 1024px): Full multi-column layout with sidebar

## Accessibility Considerations

All pages incorporate:

- Proper heading hierarchy
- ARIA labels and landmarks
- Keyboard navigation
- Screen reader compatibility
- High contrast mode
- Focus indicators

## Implementation Priorities

1. **Phase 1**: Authentication, Dashboard, MSME Registration
2. **Phase 2**: NFT Marketplace, NFT Creation, MSME Profile
3. **Phase 3**: Revenue Reporting, Verification Portal
4. **Phase 4**: Governance Portal, Advanced Features

## Navigation Structure

```
├── Home/Landing
│   ├── Login
│   └── Register
├── Dashboard
│   ├── Portfolio
│   ├── Transaction History
│   └── Quick Actions
├── MSME
│   ├── Registration
│   ├── Profile
│   └── Revenue Reporting
├── Marketplace
│   ├── Browse NFTs
│   ├── NFT Details
│   └── Create NFT
├── Verification
│   ├── Verification Dashboard
│   ├── MSME Verification
│   └── Revenue Verification
├── Profile
│   ├── Account Settings
│   └── Wallet Management
└── Governance
    ├── Proposals
    └── Voting
```

## State Management Requirements

Each page requires these state management considerations:

1. **Authentication State**: User login status, permissions, role
2. **Form State**: Multi-step form progress, validation state
3. **Filter State**: User-selected filters and sorting preferences
4. **Transaction State**: Loading, success, error states for operations
5. **Notification State**: System messages and alerts

## API Integration Points

Pages connect to these backend canisters:

- **Authentication Pages**: `user_canister`
- **MSME Pages**: `msme_registration`, `verification_canister`
- **NFT Pages**: `nft_canister`, `token_canister`
- **Revenue Pages**: `revenue_reporting`, `token_canister`
- **Verification Pages**: `verification_canister`, `msme_registration`
- **Governance Pages**: `governance_canister`
