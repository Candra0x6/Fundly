# Authentication Canister

## Overview

The Authentication Canister handles user identity, roles, and session management for the ImpactInvest platform. It provides a role-based access control system that enables appropriate permissions for different user types.

## Key Features

- **User Registration**: Allows users to register with the platform
- **Role Management**: Assigns and manages user roles (Admin, MSME, Investor, Verifier)
- **Session Management**: Creates and validates user sessions
- **Profile Management**: Stores and updates user profile information

## Types

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
    username : Text;
    email : Text;
    image : ?Types.Document;
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

## Public Functions

### User Management

- `registerUser(username : Text, email : Text, initialRole : UserRole) : async Result.Result<UserProfile, AuthError>`
- `getMyProfile() : async Result.Result<UserProfile, AuthError>`
- `updateProfile(username : Text, email : Text, image : ?Types.Document) : async Result.Result<UserProfile, AuthError>`

### Session Management

- `login(email : Text) : async Result.Result<Text, AuthError>`
- `logout(sessionId : Text) : async Result.Result<(), AuthError>`
- `validateSession(sessionId : Text) : async Result.Result<Principal, AuthError>`

### Role Management

- `addRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError>`
- `removeRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError>`
- `hasRole(principal : Principal, role : UserRole) : async Bool`
- `isAdmin(principal : Principal) : async Bool`
- `isMSME(principal : Principal) : async Bool`
- `isInvestor(principal : Principal) : async Bool`
- `isVerifier(principal : Principal) : async Bool`

### Admin Functions

- `setAdminPrincipal(newAdmin : Principal) : async Result.Result<(), AuthError>`
- `getAllUsers() : async Result.Result<[UserProfile], AuthError>`
- `getUserByPrincipal(principal : Principal) : async Result.Result<UserProfile, AuthError>`
- `cleanExpiredSessions() : async Result.Result<Nat, AuthError>`

## State Management

The Authentication Canister uses two primary data structures:

- `userProfiles`: A TrieMap that stores user profile information indexed by Principal
- `sessions`: A TrieMap that stores active session information indexed by session ID

## Security Considerations

- Session tokens have a 30-day expiry period
- Anonymous principals are not allowed to register or authenticate
- Admin privileges are required for certain administrative functions
- Each user must have at least one role

## Examples

### Registering a New User

```motoko
let result = await AuthenticationCanister.registerUser(
    "john_doe",
    "john@example.com",
    #Investor
);
```

### Logging In

```motoko
let result = await AuthenticationCanister.login("john@example.com");
```

### Checking User Role

```motoko
let isMSME = await AuthenticationCanister.hasRole(principal, #MSME);
``` 