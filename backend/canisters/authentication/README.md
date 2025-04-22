# ImpactInvest Authentication System

This directory contains the Authentication System for the ImpactInvest platform, implementing secure identity management and role-based access control integrated with Internet Computer's Internet Identity service.

## System Overview

The authentication system provides:

1. **Secure Authentication Flow** using Internet Identity
2. **Role-Based Permission System** for MSMEs, Investors, Admins, and Verifiers
3. **User Profile Management**
4. **Session Management**
5. **Security Features** including session timeouts and permission enforcement

## Integration with Internet Identity

Internet Identity (II) is the primary authentication method for the ImpactInvest platform. The system:

1. Authenticates users via their II identity
2. Maps II principals to internal user profiles
3. Manages delegations and sessions
4. Preserves the user's identity across sessions

## Role-Based Permissions

The system implements four roles:

1. **MSME**: Micro, Small, and Medium Enterprises that can create profiles and receive investments
2. **Investor**: Users who can browse MSMEs and invest in their token offerings
3. **Verifier**: Authorized users who can verify MSME identities and documentation
4. **Admin**: System administrators with full platform access

Each role has specific permissions that control their access to platform features.

## Key Security Features

- Session tokens with configurable expiration
- Role-based authorization checks across all protected operations
- Secure principal verification
- Prevention of anonymous principals from accessing protected resources

## API Overview

### Authentication Operations

- `registerUser`: Creates a new user profile
- `login`: Authenticates a user and creates a session
- `logout`: Terminates an active session
- `validateSession`: Verifies if a session is valid

### Role Management

- `addRole`: Adds a role to a user (admin only)
- `removeRole`: Removes a role from a user (admin only)
- `hasRole`: Checks if a user has a specific role

### Profile Management

- `getMyProfile`: Gets the current user's profile
- `updateProfile`: Updates profile information
- `getUserByPrincipal`: Get user details by principal (admin or self only)

### Administration

- `getAllUsers`: Lists all users (admin only)
- `setAdminPrincipal`: Sets a new admin principal (admin only)
- `cleanExpiredSessions`: Cleans up expired sessions (admin only)

## Usage Examples

### Checking Permissions in Other Canisters

To check if a user has a specific role in another canister:

```motoko
// In another canister
let authCanister = actor("aaaaa-aa") : actor {
  isAdmin : shared query (Principal) -> async Bool;
  isMSME : shared query (Principal) -> async Bool;
  isInvestor : shared query (Principal) -> async Bool;
  isVerifier : shared query (Principal) -> async Bool;
};

public shared(msg) func protectedFunction() : async Result.Result<Text, Text> {
  // Check if caller is an admin
  if (not (await authCanister.isAdmin(msg.caller))) {
    return #err("Not authorized");
  };

  // Proceed with protected operation
  return #ok("Operation completed");
};
```

### Implementing Session-Based Authentication in Frontend

```javascript
// Frontend authentication flow
async function login() {
  // Authenticate with Internet Identity
  const identity = await internetIdentity.getIdentity();

  // Login to our application and get a session
  const authActor = createActor("authentication", identity);
  const result = await authActor.login();

  if (result.ok) {
    // Store the session token in local storage
    localStorage.setItem("sessionId", result.ok);
    return true;
  }
  return false;
}

// For subsequent requests
async function makeAuthenticatedRequest() {
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    // Redirect to login
    return;
  }

  // Validate session before proceeding
  const authActor = createActor("authentication");
  const validation = await authActor.validateSession(sessionId);

  if (validation.err) {
    if (validation.err === "SessionExpired") {
      // Handle expired session
      localStorage.removeItem("sessionId");
      // Redirect to login
    }
    return;
  }

  // Proceed with authenticated request
  // ...
}
```
