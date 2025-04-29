# Authentication Canister

## Overview

The Authentication Canister manages user authentication, authorization, and profile management for the Fundly platform. It integrates with Internet Identity for secure authentication and provides role-based access control.

## Key Features

- User registration and profile management
- Role-based access control (Admin, MSME, Investor, Verifier)
- Session management
- Internet Identity integration
- User authorization for other canisters

## Data Models

### UserRole

```motoko
public type UserRole = {
    #Admin;
    #MSME;
    #Investor;
    #Verifier;
};
```

### UserProfile

```motoko
public type UserProfile = {
    principal : Principal;
    roles : [UserRole];
    username : ?Text;
    email : ?Text;
    createdAt : Time.Time;
    lastLogin : ?Time.Time;
};
```

### SessionData

```motoko
public type SessionData = {
    principal : Principal;
    expiresAt : Time.Time;
    createdAt : Time.Time;
};
```

### AuthError

```motoko
public type AuthError = {
    #NotAuthorized;
    #ProfileNotFound;
    #AlreadyExists;
    #SessionExpired;
    #InvalidToken;
    #OperationFailed;
};
```

## Public API Methods

### User Registration and Profile Management

```motoko
registerUser(username : ?Text, email : ?Text, initialRole : UserRole) : async Result.Result<UserProfile, AuthError>
```

Registers a new user with the specified initial role. Note that only admins can create Admin or Verifier roles.

```motoko
getMyProfile() : async Result.Result<UserProfile, AuthError>
```

Returns the caller's profile information.

```motoko
updateProfile(username : ?Text, email : ?Text) : async Result.Result<UserProfile, AuthError>
```

Updates the caller's profile information.

### Session Management

```motoko
login() : async Result.Result<Text, AuthError>
```

Creates a new session for the caller and returns a session ID.

```motoko
logout(sessionId : Text) : async Result.Result<(), AuthError>
```

Ends the specified session for the caller.

```motoko
validateSession(sessionId : Text) : async Result.Result<Principal, AuthError>
```

Validates a session ID and returns the associated principal if valid.

### Role Management

```motoko
addRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError>
```

Adds a role to a user's profile. Only admins can call this method.

```motoko
removeRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError>
```

Removes a role from a user's profile. Only admins can call this method.

### Authorization Helpers

```motoko
hasRole(principal : Principal, role : UserRole) : async Bool
isAdmin(principal : Principal) : async Bool
isMSME(principal : Principal) : async Bool
isInvestor(principal : Principal) : async Bool
isVerifier(principal : Principal) : async Bool
```

These methods check if a principal has a specific role.

### Admin Functions

```motoko
setAdminPrincipal(newAdmin : Principal) : async Result.Result<(), AuthError>
```

Sets a new admin principal. Only admins can call this method.

```motoko
getAllUsers() : async Result.Result<[UserProfile], AuthError>
```

Returns all user profiles. Only admins can call this method.

```motoko
getUserByPrincipal(principal : Principal) : async Result.Result<UserProfile, AuthError>
```

Returns a specific user's profile. Users can view their own profiles, and admins can view any profile.

```motoko
cleanExpiredSessions() : async Result.Result<Nat, AuthError>
```

Removes expired sessions. Only admins can call this method.

## Internet Identity Integration

The Authentication canister integrates with Internet Identity via the `internet_identity.mo` module, which provides:

```motoko
principalToUserNumber(p : Principal) : UserNumber
isInternetIdentityPrincipal(p : Principal) : Bool
getUserNumber(p : Principal) : ?UserNumber
```

These functions help validate and work with Internet Identity principals.

## Usage Examples

### User Registration

```motoko
// Register as an investor
let registerResult = await Authentication.registerUser(
    ?"john.doe",
    ?"john@example.com",
    #Investor
);

switch (registerResult) {
    case (#ok(profile)) {
        // Registration successful
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Login and Session Management

```motoko
// Log in and get a session ID
let loginResult = await Authentication.login();

let sessionId = switch (loginResult) {
    case (#ok(id)) { id };
    case (#err(error)) {
        return; // Handle error
    };
};

// Use the session ID for authenticated requests
let validateResult = await Authentication.validateSession(sessionId);

switch (validateResult) {
    case (#ok(principal)) {
        // Session is valid, principal is authenticated
    };
    case (#err(error)) {
        // Session is invalid or expired
    };
}

// Log out when done
await Authentication.logout(sessionId);
```

### Role Management

```motoko
// Admin adding MSME role to a user
let addRoleResult = await Authentication.addRole(
    userPrincipal,
    #MSME
);

switch (addRoleResult) {
    case (#ok(updatedProfile)) {
        // Role added successfully
    };
    case (#err(error)) {
        // Handle error
    };
}
```

### Role Checking

```motoko
// Check if user has MSME role before allowing MSME operations
let isMSME = await Authentication.isMSME(userPrincipal);

if (isMSME) {
    // Allow MSME operations
} else {
    // Deny access
}
```

## Implementation Details

### Storage

The Authentication canister uses three main storage structures:

- `userProfiles`: Maps principals to user profiles
- `sessions`: Maps session IDs to session data
- `adminPrincipal`: Stores the primary admin principal

### Session Management

- Sessions expire after 30 days (2,592,000,000,000,000 nanoseconds)
- Session IDs are generated using a combination of principal and timestamp
- Expired sessions are automatically invalidated when validated

### Security Considerations

- Anonymous principals cannot register or authenticate
- Only admins can add or remove roles
- Users always retain at least one role (defaults to Investor if all roles are removed)
- Only the session owner can log out of their session

## Best Practices

### For Frontend Integration

1. **Store the session ID securely**:

   - Use secure cookies or localStorage with appropriate security measures
   - Include the session ID in HTTP headers for authenticated requests

2. **Handle session expiration gracefully**:
   - Redirect to login page when sessions expire
   - Provide a clear message to users

### For Backend Integration

1. **Always verify authorization**:

   - Check user roles before performing restricted operations
   - Don't assume all authenticated users have the necessary permissions

2. **Use appropriate roles**:
   - MSME role for business owners
   - Investor role for NFT purchasers
   - Verifier role for identity verification officers
   - Admin role for platform administrators

## Canister Interactions

The Authentication canister is used by:

- **All other canisters**: For authorization checks
- **Frontend**: For user login/registration and profile management
- **Internet Identity**: For secure authentication
