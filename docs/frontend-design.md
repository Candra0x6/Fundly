# Frontend Design

This document outlines the design of the Fundly platform's frontend, including page structure, components, and functionality for each user role.

## User Roles & Access

The platform supports four user roles with different access levels:

- **Investor**: Can browse, purchase NFTs, and view revenue distributions
- **MSME**: Can create profiles, issue NFTs, and report revenue
- **Verifier**: Can review and approve MSME verification requests
- **Admin**: Has full access to manage the platform

## Pages Overview

| Page                                             | Description                                  | Accessible To       |
| ------------------------------------------------ | -------------------------------------------- | ------------------- |
| [Landing Page](#landing-page) don                | Public entry point with platform information | All (Public)        |
| -[Authentication](#authentication) MSME,          | Login and registration                       | All (Public)        |
| [Dashboard](#dashboard) INvs, mmes               | Role-specific overview and quick actions     | All (Authenticated) |
| -[Marketplace](#marketplace) Done                 | Browse and purchase NFTs                     | All (Authenticated) |
| -[MSME Profile](#msme-profile) don                | MSME information and verification status     | All (Authenticated) |
| [MSME Registration](#msme-registration) don      | Create/edit MSME profile                     | MSME                |
| [MSME Dashboard](#msme-dashboard) don            | Manage NFTs and revenue for an MSME          | MSME                |
| [NFT Creation](#nft-creation) don                | Create new revenue share NFTs                | MSME                |
| [Revenue Reporting](#revenue-reporting) don      | Report revenue and view distributions        | MSME                |
| [Investor Portfolio](#investor-portfolio) Done   | View owned NFTs and earnings                 | Investor            |
| [Verification Portal](#verification-portal) Done | Manage verification requests                 | Verifier, Admin     |
| [Document Review](#document-review) don          | Review MSME documents                        | Verifier, Admin     |
| [Admin Panel](#admin-panel) don1/2               | Platform management tools                    | Admin               |
| [User Profile](#user-profile) don                | View and edit user information               | All (Authenticated) |

## Detailed Page Specifications

### Landing Page

**Purpose**: Introduce the platform to new users and provide easy access to login/register.

**Components**:

- Hero section with platform value proposition
- How it works section (for both MSMEs and Investors)
- Featured MSMEs and NFTs
- Statistics (total investments, MSMEs, etc.)
- Testimonials
- Call-to-action buttons

**Functions**:

- Navigate to login/register
- Learn more about the platform
- View featured content

  ### Authentication

  **Purpose**: Allow users to register and log in to the platform.

  **Components**:

  - Login form
  - Registration form
  - Internet Identity integration
  - Role selection (Investor/MSME)

  **Functions**:

  - Register new account
  - Login with existing account
  - Authenticate with Internet Identity
  - Select user role during registration
  - Password recovery

  **Backend Integration**:

- `Authentication.login()`
- `Authentication.registerUser()`

### Dashboard

**Purpose**: Provide a personalized overview based on user role.

**Components**:

- Role-specific welcome message
- Summary statistics
- Recent activity feed
- Quick action buttons
- Notifications

**Functions**:

- Navigate to role-specific sections
- View personalized statistics
- Access recent notifications

**Variations**:

- **Investor Dashboard**: Shows owned NFTs, recent earnings, marketplace highlights
- **MSME Dashboard**: Shows verification status, active NFTs, revenue summary
- **Verifier Dashboard**: Shows pending verification requests, assigned tasks
- **Admin Dashboard**: Shows platform statistics, user management, settings

### Marketplace

**Purpose**: Browse, filter, and purchase NFTs.

**Components**:

- NFT grid/list view
- Search and filter options
- NFT cards with key information
- Sort options (newest, highest revenue share, etc.)
- MSME filter
- Industry filter

**Functions**:

- Browse available NFTs
- Search and filter NFTs
- View NFT details
- Purchase NFTs using FND tokens
- View MSME profiles from NFT cards

**Backend Integration**:

- NFT canister to get available tokens
- Token canister for purchases

### MSME Profile

**Purpose**: Display detailed information about an MSME.

**Components**:

- MSME header with logo and verification status badge
- About section
- Key metrics
- Available NFTs
- Revenue history (if public)
- Team information
- Contact details

**Functions**:

- View MSME details
- Browse MSME's available NFTs
- See verification status
- Contact MSME (if allowed)

**Backend Integration**:

- MSME Registration canister
- NFT canister for MSME tokens

### MSME Registration

**Purpose**: Allow businesses to register as MSMEs.

**Components**:

- Multi-step registration form
- Document upload section
- Preview functionality
- Verification requirements information

**Functions**:

- Create MSME profile
- Upload required documents
- Submit for verification
- Save draft registration

**Backend Integration**:

- MSME Registration canister
- Asset Storage canister for documents
- Verification Workflow canister

### MSME Dashboard

**Purpose**: Central management interface for MSME owners.

**Components**:

- Verification status banner
- NFT management section
- Revenue reporting section
- Document management
- Analytics and insights

**Functions**:

- Monitor verification status
- Create new NFTs
- Report revenue
- View distribution statistics
- Manage documents

### NFT Creation

**Purpose**: Allow MSMEs to create revenue share NFTs.

**Components**:

- NFT creation form
- Revenue share percentage selector
- Image upload and cropping tool
- NFT preview
- Terms and conditions

**Functions**:

- Set NFT details (name, description)
- Define revenue share percentage
- Upload NFT image
- Preview NFT appearance
- Create and list NFT

**Backend Integration**:

- NFT canister
- Asset Storage canister

  ### Revenue Reporting

  **Purpose**: Report revenue and manage distributions.

  **Components**:

  - Revenue reporting form
  - Distribution history table
  - Analytics dashboard
  - NFT ownership breakdown

  **Functions**:

  - Report new revenue
  - View past revenue reports
  - Monitor distribution status
  - Analyze revenue trends

**Backend Integration**:

- Revenue Reporting canister
- NFT canister for token information

### Investor Portfolio

**Purpose**: Allow investors to track their NFT investments.

**Components**:

- Portfolio value summary
- Owned NFTs list/grid
- Earnings history
- Performance metrics
- Investment distribution chart

**Functions**:

- View owned NFTs
- Track earnings from each NFT
- Analyze portfolio performance
- Transfer NFTs

**Backend Integration**:

- NFT canister
- Revenue Reporting canister

### Verification Portal

**Purpose**: Interface for verifiers to manage verification requests.

**Components**:

- Verification requests queue
- Assigned requests section
- Request details viewer
- Document viewer
- Decision interface

**Functions**:

- Browse verification requests
- Assign requests to self
- Review documents
- Add comments (internal and external)
- Approve/reject/request more info

**Backend Integration**:

- Verification Workflow canister
- Asset Storage canister for documents

### Document Review

**Purpose**: Detailed interface for reviewing MSME documents.

**Components**:

- Document viewer with zoom
- Document metadata
- Approval controls
- Comment system
- Verification checklist

**Functions**:

- View and examine documents
- Add comments on specific parts
- Check documents against requirements
- Mark documents as approved/rejected
- Request additional information

**Backend Integration**:

- Verification Workflow canister
- Asset Storage canister

### Admin Panel

**Purpose**: Complete platform management interface.

**Components**:

- User management
- MSME management
- Verification officer management
- System statistics
- Configuration settings

**Functions**:

- Manage user accounts and roles
- Monitor platform activity
- Configure system parameters
- Manage verification officers
- View system logs

**Backend Integration**:

- All canisters for administrative functions

### User Profile

**Purpose**: View and edit personal information.

**Components**:

- Profile information form
- Role badges
- Account settings
- Security settings
- Notification preferences

**Functions**:

- Edit profile information
- Change password
- Manage notification settings
- Link Internet Identity
- View roles

**Backend Integration**:

- Authentication canister

## Common Components

These components appear across multiple pages:

### Navigation

- **Top Bar**: Logo, search, notifications, profile menu
- **Side Menu**: Context-specific navigation based on user role
- **Footer**: Links, resources, terms, support

### NFT Card

- Image thumbnail
- NFT name
- MSME name with verification badge
- Revenue share percentage
- Price in FND
- Quick action buttons

### Transaction Modals

- Confirmation
- Processing
- Success/failure
- Transaction details

### Document Uploader

- Drag and drop functionality
- Progress indicator
- File type validation
- Preview capability

## Mobile Responsiveness

All pages should be responsive with these breakpoints:

- Small: 0-576px (Mobile)
- Medium: 577-768px (Tablet portrait)
- Large: 769-992px (Tablet landscape)
- Extra Large: 993px+ (Desktop)

## User Flows

### MSME Verification Flow

1. MSME registers account
2. MSME provides business information
3. MSME uploads verification documents
4. Verification request enters queue
5. Verifier reviews documents
6. Verifier approves/rejects/requests more info
7. MSME receives notification of decision
8. If approved, MSME gains ability to create NFTs

### NFT Investment Flow

1. Investor browses marketplace
2. Investor selects NFT of interest
3. Investor views detailed information
4. Investor purchases NFT using FND tokens
5. Investor receives NFT in portfolio
6. Investor receives distributions when MSME reports revenue

### Revenue Distribution Flow

1. MSME reports revenue
2. System calculates distribution amounts
3. System transfers FND tokens to NFT holders
4. MSME and Investors receive distribution notifications
5. Distribution details recorded and viewable

## Technical Specifications

### State Management

- Use Redux or Context API for global state
- Local component state for UI-specific state
- Persistence with local storage for session information

### API Integration

- Agent-js for Internet Computer integration
- Candid interfaces for canister communication
- Proper error handling and loading states

### Authentication Flow

- Internet Identity integration
- Session management
- Role-based access control

## Design System

### Colors

- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #8B5CF6 (Purple)
- Success: #34D399 (Green)
- Warning: #FBBF24 (Yellow)
- Error: #EF4444 (Red)
- Neutral: #1F2937 (Dark blue-gray)
- Background: #F9FAFB (Light gray)

### Typography

- Headings: Inter, sans-serif
- Body: Roboto, sans-serif
- Monospace: Roboto Mono, monospace

### Component Library

- Use Material UI or Tailwind UI for consistent design
- Custom components for domain-specific elements

## Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast
- Alternative text for images

## Performance Optimization

- Lazy loading for routes
- Image optimization
- Caching strategy for canister data
- Pagination for large data sets
- Debounced search inputs
