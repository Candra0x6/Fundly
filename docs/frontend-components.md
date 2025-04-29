# Frontend Components

This document outlines the key reusable components needed for the Fundly platform's frontend. These components will be used across multiple pages to maintain consistency and reduce development time.

## Core Components

### Authentication Components

#### LoginForm

**Purpose**: Allow users to log in using Internet Identity or traditional methods.

**Props**:

- `onLogin`: Function called after successful login
- `onError`: Function called if login fails
- `redirectUrl`: URL to redirect to after login

**State**:

- Loading state
- Error messages
- Form input values

**Methods**:

- `handleInternetIdentityLogin()`: Initiate II authentication flow
- `handleTraditionalLogin()`: Submit credentials to authentication canister
- `validateForm()`: Validate form inputs

#### RegistrationForm

**Purpose**: Allow new users to create accounts.

**Props**:

- `onRegister`: Function called after successful registration
- `onError`: Function called if registration fails
- `availableRoles`: Array of roles user can select

**State**:

- Form step (multi-step form)
- Form input values
- Validation errors
- Loading state

### Navigation Components

#### MainNavbar

**Purpose**: Primary navigation across the platform.

**Props**:

- `user`: Current user object
- `unreadNotifications`: Number of unread notifications
- `userRole`: Current user role for context-specific menu items

**Features**:

- Logo/branding
- Primary navigation links
- Search bar
- Notifications dropdown
- User profile menu
- Role switcher (if user has multiple roles)

#### SideNavigation

**Purpose**: Context-specific navigation based on current section.

**Props**:

- `section`: Current section identifier
- `userRole`: Current user role
- `navItems`: Navigation items array

**Features**:

- Section-specific navigation items
- Active state indication
- Collapse/expand functionality
- Badge indicators for alerts

#### Breadcrumbs

**Purpose**: Show navigation path and allow quick navigation to parent pages.

**Props**:

- `path`: Array of breadcrumb items (label and URL)
- `separator`: Custom separator element/character

### Data Display Components

#### NFTCard

**Purpose**: Display NFT information in a consistent format.

**Props**:

- `nft`: NFT data object
- `onClick`: Function called when card is clicked
- `actions`: Array of action buttons to show
- `highlightType`: Optional style for highlighting (e.g., "new", "trending")

**Features**:

- Image with lazy loading
- Title and MSME name
- Revenue share percentage
- Price in FND
- Verification badge for MSME
- Action buttons (buy, view details, etc.)

#### MSMECard

**Purpose**: Display MSME information in a consistent format.

**Props**:

- `msme`: MSME data object
- `onClick`: Function called when card is clicked
- `showRevenue`: Boolean to toggle revenue information visibility
- `verificationBadge`: Boolean to toggle verification badge

**Features**:

- Logo/image
- Name and industry
- Verification status badge
- Key statistics
- Available NFTs count
- Action buttons

#### DataTable

**Purpose**: Display and interact with tabular data.

**Props**:

- `columns`: Column definitions array
- `data`: Data array
- `pagination`: Pagination options
- `sorting`: Sorting configuration
- `filtering`: Filtering options
- `rowActions`: Actions available for each row

**Features**:

- Sortable columns
- Filterable content
- Pagination
- Row selection
- Expandable rows
- Action buttons per row
- Export functionality

#### DocumentViewer

**Purpose**: View and annotate documents uploaded by MSMEs.

**Props**:

- `document`: Document data object with URL
- `annotations`: Array of annotation objects
- `onAnnotate`: Function called when annotation is added
- `onApprove`: Function called to approve document
- `onReject`: Function called to reject document

**Features**:

- Document rendering (PDF, images)
- Zoom controls
- Annotation tools
- Comment system
- Approval/rejection controls
- Document metadata display

### Input Components

#### TokenAmountInput

**Purpose**: Input field for FND token amounts with formatting.

**Props**:

- `value`: Current value
- `onChange`: Change handler function
- `max`: Maximum allowed amount
- `min`: Minimum allowed amount
- `label`: Input label
- `error`: Error message

**Features**:

- FND token formatting
- Validation against min/max
- Numeric input restrictions
- Visual feedback for valid/invalid amounts

#### PercentageInput

**Purpose**: Input for revenue share percentages with validation.

**Props**:

- `value`: Current percentage value
- `onChange`: Change handler function
- `max`: Maximum percentage (default 100)
- `step`: Step increment (default 1)
- `label`: Input label

**Features**:

- Percentage formatting (with % symbol)
- Slider alternative input method
- Input validation
- Visual feedback

#### FileUploader

**Purpose**: Upload and manage files for MSME verification and NFT creation.

**Props**:

- `onUpload`: Function called after successful upload
- `onError`: Function called if upload fails
- `allowedTypes`: Array of allowed MIME types
- `maxSize`: Maximum file size in bytes
- `multiple`: Boolean to allow multiple file uploads

**Features**:

- Drag and drop support
- File type validation
- Size validation
- Progress indicator
- File preview
- Multiple file support
- Chunked upload for large files

#### RichTextEditor

**Purpose**: Edit formatted text for descriptions and comments.

**Props**:

- `value`: Current content
- `onChange`: Change handler function
- `toolbar`: Toolbar configuration
- `placeholder`: Placeholder text
- `minHeight`: Minimum height of editor

**Features**:

- Basic formatting (bold, italic, lists)
- Image embedding
- Link creation
- Character/word count
- Mobile-friendly controls

### Feedback Components

#### NotificationSystem

**Purpose**: Display system notifications to users.

**Props**:

- `notifications`: Array of notification objects
- `onDismiss`: Function called when notification is dismissed
- `onAction`: Function called when notification action is clicked

**Features**:

- Multiple notification types (success, error, info, warning)
- Auto-dismiss option
- Action buttons
- Stacking behavior
- Responsive design

#### TransactionModal

**Purpose**: Display transaction flow and status.

**Props**:

- `transaction`: Transaction object
- `onClose`: Function called when modal is closed
- `steps`: Array of transaction steps

**Features**:

- Multi-step transaction display
- Status indicators (pending, complete, failed)
- Detailed error information
- Confirmation step
- Success message and next actions

#### LoadingIndicator

**Purpose**: Indicate loading state across the application.

**Props**:

- `size`: Size of indicator (small, medium, large)
- `message`: Optional loading message
- `overlay`: Boolean to show overlay
- `progress`: Optional progress percentage

**Features**:

- Different size options
- Optional text message
- Full-page overlay option
- Progress indication for known-duration operations

### Chart Components

#### RevenueDistributionChart

**Purpose**: Visualize revenue distribution.

**Props**:

- `data`: Revenue distribution data
- `type`: Chart type (pie, bar, etc.)
- `colors`: Color scheme
- `period`: Time period to display

**Features**:

- Multiple visualization options
- Legends
- Tooltips
- Time period selection
- Export functionality

#### PerformanceChart

**Purpose**: Display NFT or MSME performance over time.

**Props**:

- `data`: Performance data points
- `metrics`: Array of metrics to display
- `timeRange`: Time range to display
- `comparison`: Optional comparison data

**Features**:

- Line/area chart visualization
- Multiple metric display
- Time range selection
- Comparison functionality
- Annotations for significant events

## Form Templates

### MSMERegistrationForm

**Purpose**: Multi-step form for MSME registration.

**Steps**:

1. Basic Information (name, industry, registration number)
2. Detailed Information (contact, location, team size)
3. Document Upload (business registration, tax documents)
4. Review and Submit

**Components Used**:

- FileUploader
- RichTextEditor
- TokenAmountInput
- Various form inputs

### NFTCreationForm

**Purpose**: Form for creating new revenue share NFTs.

**Fields**:

- Name
- Description
- Revenue share percentage
- Image upload
- Initial price
- Terms and conditions

**Components Used**:

- FileUploader
- RichTextEditor
- PercentageInput
- TokenAmountInput

### RevenueReportingForm

**Purpose**: Form for MSMEs to report revenue.

**Fields**:

- Revenue amount
- Reporting period
- Revenue source
- Additional notes
- Supporting documents (optional)

**Components Used**:

- TokenAmountInput
- FileUploader
- RichTextEditor
- DateRangePicker

## Page Layouts

### DashboardLayout

**Purpose**: Consistent layout for dashboard pages.

**Components**:

- MainNavbar
- SideNavigation
- NotificationSystem
- Content area
- Quick action panel
- Footer

### MarketplaceLayout

**Purpose**: Layout optimized for browsing and filtering NFTs.

**Components**:

- MainNavbar
- Filter sidebar
- Results grid/list
- Sorting controls
- Pagination
- Footer

### ProfileLayout

**Purpose**: Layout for profile pages (user, MSME).

**Components**:

- MainNavbar
- Profile header
- Tabbed content area
- Sidebar with key metrics
- Action buttons
- Footer

## Responsive Design

All components should be designed with responsive behavior for the following breakpoints:

- **Mobile**: 0-576px

  - Stack layouts vertically
  - Simplified navigation (hamburger menu)
  - Single column content
  - Reduced information density

- **Tablet**: 577-992px

  - Two-column layouts where appropriate
  - Expanded navigation
  - Touch-optimized controls
  - Collapsible sections

- **Desktop**: 993px+
  - Multi-column layouts
  - Full navigation
  - Hover interactions
  - Higher information density

## Accessibility Features

All components should implement these accessibility features:

- Keyboard navigation
- ARIA attributes
- Sufficient color contrast
- Text alternatives for non-text content
- Focus management
- Screen reader announcements for dynamic content

## Component Dependencies

For third-party components, the following libraries are recommended:

- **UI Framework**: React with Material UI or Tailwind CSS
- **Charts**: Chart.js or D3.js
- **Forms**: Formik or React Hook Form
- **Validation**: Yup or Zod
- **Date Handling**: date-fns
- **File Upload**: react-dropzone
- **Rich Text Editing**: TinyMCE or Draft.js
- **Data Tables**: react-table

## Implementation Priorities

Components should be implemented in this order:

1. **Foundation Components**:

   - Authentication components
   - Navigation components
   - Basic input components

2. **Core Functionality**:

   - NFT Card/Marketplace components
   - MSME Profile components
   - Transaction flow components

3. **Advanced Features**:
   - Document viewer/review components
   - Analytics and chart components
   - Advanced filtering and search

## Component Testing Strategy

Each component should have:

1. **Unit Tests**:

   - Test props and callbacks
   - Test state changes
   - Test rendering variations

2. **Integration Tests**:

   - Test interactions between related components
   - Test form submissions
   - Test data flow

3. **Visual Regression Tests**:
   - Test appearance across breakpoints
   - Test different themes/styles
   - Test loading/error states
