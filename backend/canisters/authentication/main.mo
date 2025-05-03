import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Types "../../types";

actor Authentication {
    // Types
    public type UserRole = {
        #Admin;
        #MSME;
        #Investor;
        #Verifier;
    };

    public type UserProfile = {
        principal : Principal;
        roles : [UserRole];
        username : Text;
        email : Text;
        image : ?Types.Document;
        createdAt : Time.Time;
        lastLogin : ?Time.Time;
    };

    public type SessionData = {
        principal : Principal;
        expiresAt : Time.Time;
        createdAt : Time.Time;
    };

    public type AuthError = {
        #NotAuthorized;
        #ProfileNotFound;
        #AlreadyExists;
        #SessionExpired;
        #InvalidToken;
        #OperationFailed;
    };

    // Constants
    private let SESSION_EXPIRY_NANOS : Int = 2_592_000_000_000_000; // 30 days in nanoseconds
    private let ANON_PRINCIPAL : Principal = Principal.fromText("2vxsx-fae");

    // State variables
    private stable var userProfilesEntries : [(Principal, UserProfile)] = [];
    private stable var sessionsEntries : [(Text, SessionData)] = [];
    private stable var adminPrincipal : Principal = Principal.fromText("aaaaa-aa"); // Default admin principal - replace with actual admin principal

    private var userProfiles = TrieMap.TrieMap<Principal, UserProfile>(Principal.equal, Principal.hash);
    private var sessions = TrieMap.TrieMap<Text, SessionData>(Text.equal, Text.hash);

    // System functions
    system func preupgrade() {
        userProfilesEntries := Iter.toArray(userProfiles.entries());
        sessionsEntries := Iter.toArray(sessions.entries());
    };

    system func postupgrade() {
        userProfiles := TrieMap.fromEntries(Iter.fromArray(userProfilesEntries), Principal.equal, Principal.hash);
        sessions := TrieMap.fromEntries(Iter.fromArray(sessionsEntries), Text.equal, Text.hash);
        userProfilesEntries := [];
        sessionsEntries := [];
    };

    // Authentication functions
    public shared (msg) func registerUser(username : Text, email : Text, initialRole : UserRole) : async Result.Result<UserProfile, AuthError> {
        let caller = msg.caller;

        // Don't allow anonymous principals to register
        if (Principal.equal(caller, ANON_PRINCIPAL)) {
            return #err(#NotAuthorized);
        };
        let profileOpt = userProfiles.get(caller);

        // Check if user already exists
        switch (profileOpt) {
            case (?existingProfile) {
                // Check if the principal already exists
                if (Principal.equal(existingProfile.principal, caller)) {
                    return #err(#AlreadyExists);
                } else {
                    // Continue with profile creation since principal doesn't exist

                    let newProfile : UserProfile = {
                        principal = caller;
                        roles = [initialRole];
                        username = username;
                        image = null;
                        email = email;
                        createdAt = Time.now();
                        lastLogin = null;
                    };

                    userProfiles.put(caller, newProfile);
                    return #ok(newProfile);
                };
            };
            case (null) {
                // Handle case where profile doesn't exist at all

                let newProfile : UserProfile = {
                    principal = caller;
                    roles = [initialRole];
                    username = username;
                    image = null;
                    email = email;
                    createdAt = Time.now();
                    lastLogin = null;
                };

                userProfiles.put(caller, newProfile);
                return #ok(newProfile);
            };
        };
    };

    public shared query (msg) func getMyProfile() : async Result.Result<UserProfile, AuthError> {
        let caller = msg.caller;

        // Don't allow anonymous principals
        if (Principal.equal(caller, ANON_PRINCIPAL)) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(caller)) {
            case (?profile) {
                return #ok(profile);
            };
            case null {
                return #err(#ProfileNotFound);
            };
        };
    };

    public shared (msg) func updateProfile(username : Text, email : Text, image : ?Types.Document) : async Result.Result<UserProfile, AuthError> {
        let caller = msg.caller;

        if (Principal.equal(caller, ANON_PRINCIPAL)) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(caller)) {
            case (?profile) {
                let updatedProfile : UserProfile = {
                    principal = profile.principal;
                    roles = profile.roles;
                    username = username;
                    email = email;
                    image = image;
                    createdAt = profile.createdAt;
                    lastLogin = profile.lastLogin;
                };

                userProfiles.put(caller, updatedProfile);
                return #ok(updatedProfile);
            };
            case null {
                return #err(#ProfileNotFound);
            };
        };
    };

    // Session management
    public shared (msg) func login(email : Text) : async Result.Result<Text, AuthError> {
        let caller = msg.caller;

        if (Principal.equal(caller, ANON_PRINCIPAL)) {
            return #err(#NotAuthorized);
        };

        // Check if user exists, if not, create a profile with Investor role
        let profile = switch (userProfiles.get(caller)) {
            case (?existingProfile) {
                // Update last login time
                if (existingProfile.email == email) {
                    let updatedProfile : UserProfile = {
                        principal = existingProfile.principal;
                        roles = existingProfile.roles;
                        username = existingProfile.username;
                        email = existingProfile.email;
                        createdAt = existingProfile.createdAt;
                        lastLogin = ?Time.now();
                        image = existingProfile.image;
                    }; // This closing brace was missing
                    userProfiles.put(caller, updatedProfile);
                    updatedProfile;
                } else {
                    return #err(#ProfileNotFound);
                };
            };
            case null {
                return #err(#ProfileNotFound);
            };
        };
        // Create session
        let now = Time.now();
        let sessionId = generateSessionId(caller, now);
        let sessionData : SessionData = {
            principal = caller;
            expiresAt = now + SESSION_EXPIRY_NANOS;
            createdAt = now;
        };

        sessions.put(sessionId, sessionData);
        return #ok(sessionId);
    };

    public shared (msg) func logout(sessionId : Text) : async Result.Result<(), AuthError> {
        let caller = msg.caller;

        switch (sessions.get(sessionId)) {
            case (?session) {
                if (Principal.equal(session.principal, caller)) {
                    sessions.delete(sessionId);
                    return #ok();
                } else {
                    return #err(#NotAuthorized);
                };
            };
            case null {
                return #err(#InvalidToken);
            };
        };
    };

    public shared query (msg) func validateSession(sessionId : Text) : async Result.Result<Principal, AuthError> {
        switch (sessions.get(sessionId)) {
            case (?session) {
                if (session.expiresAt < Time.now()) {
                    return #err(#SessionExpired);
                };
                return #ok(session.principal);
            };
            case null {
                return #err(#InvalidToken);
            };
        };
    };

    // Role management
    public shared (msg) func addRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError> {
        let caller = msg.caller;

        // Only admins can add roles
        if (not (await isAdmin(caller))) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(targetPrincipal)) {
            case (?profile) {
                // Check if role already exists
                let hasRole = Array.find<UserRole>(profile.roles, func(r) { r == role }) != null;

                if (hasRole) {
                    return #ok(profile); // Role already exists, return current profile
                };

                // Add the new role
                let updatedRoles = Buffer.fromArray<UserRole>(profile.roles);
                updatedRoles.add(role);

                let updatedProfile : UserProfile = {
                    principal = profile.principal;
                    roles = Buffer.toArray(updatedRoles);
                    username = profile.username;
                    email = profile.email;
                    createdAt = profile.createdAt;
                    lastLogin = profile.lastLogin;
                    image = profile.image;
                };

                userProfiles.put(targetPrincipal, updatedProfile);
                return #ok(updatedProfile);
            };
            case null {
                return #err(#ProfileNotFound);
            };
        };
    };

    public shared (msg) func removeRole(targetPrincipal : Principal, role : UserRole) : async Result.Result<UserProfile, AuthError> {
        let caller = msg.caller;

        // Only admins can remove roles
        if (not (await isAdmin(caller))) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(targetPrincipal)) {
            case (?profile) {
                // Filter out the role to remove
                let updatedRolesBuffer = Buffer.Buffer<UserRole>(profile.roles.size());

                for (r in profile.roles.vals()) {
                    if (r != role) {
                        updatedRolesBuffer.add(r);
                    };
                };

                // Ensure at least one role remains
                if (updatedRolesBuffer.size() == 0) {
                    updatedRolesBuffer.add(#Investor); // Default role
                };

                let updatedProfile : UserProfile = {
                    principal = profile.principal;
                    roles = Buffer.toArray(updatedRolesBuffer);
                    username = profile.username;
                    email = profile.email;
                    createdAt = profile.createdAt;
                    lastLogin = profile.lastLogin;
                    image = profile.image;
                };

                userProfiles.put(targetPrincipal, updatedProfile);
                return #ok(updatedProfile);
            };
            case null {
                return #err(#ProfileNotFound);
            };
        };
    };

    // Permission helpers
    public shared query (msg) func hasRole(principal : Principal, role : UserRole) : async Bool {
        switch (userProfiles.get(principal)) {
            case (?profile) {
                return Array.find<UserRole>(profile.roles, func(r) { r == role }) != null;
            };
            case null {
                return false;
            };
        };
    };

    public shared query func isAdmin(principal : Principal) : async Bool {
        if (Principal.equal(principal, adminPrincipal)) {
            return true; // The initial admin principal is always an admin
        };

        switch (userProfiles.get(principal)) {
            case (?profile) {
                return Array.find<UserRole>(profile.roles, func(r) { r == #Admin }) != null;
            };
            case null {
                return false;
            };
        };
    };

    public shared query func isMSME(principal : Principal) : async Bool {
        switch (userProfiles.get(principal)) {
            case (?profile) {
                return Array.find<UserRole>(profile.roles, func(r) { r == #MSME }) != null;
            };
            case null {
                return false;
            };
        };
    };

    public shared query func isInvestor(principal : Principal) : async Bool {
        switch (userProfiles.get(principal)) {
            case (?profile) {
                return Array.find<UserRole>(profile.roles, func(r) { r == #Investor }) != null;
            };
            case null {
                return false;
            };
        };
    };

    public shared query func isVerifier(principal : Principal) : async Bool {
        switch (userProfiles.get(principal)) {
            case (?profile) {
                return Array.find<UserRole>(profile.roles, func(r) { r == #Verifier }) != null;
            };
            case null {
                return false;
            };
        };
    };

    // Admin functions
    public shared (msg) func setAdminPrincipal(newAdmin : Principal) : async Result.Result<(), AuthError> {
        let caller = msg.caller;

        if (not (await isAdmin(caller))) {
            return #err(#NotAuthorized);
        };

        adminPrincipal := newAdmin;

        // Ensure admin has an admin profile
        switch (userProfiles.get(newAdmin)) {
            case (?profile) {
                // Check if admin role already exists
                let hasAdminRole = Array.find<UserRole>(profile.roles, func(r) { r == #Admin }) != null;

                if (not hasAdminRole) {
                    // Add admin role
                    let updatedRoles = Buffer.fromArray<UserRole>(profile.roles);
                    updatedRoles.add(#Admin);

                    let updatedProfile : UserProfile = {
                        principal = profile.principal;
                        roles = Buffer.toArray(updatedRoles);
                        username = profile.username;
                        email = profile.email;
                        createdAt = profile.createdAt;
                        lastLogin = profile.lastLogin;
                        image = profile.image;
                    };

                    userProfiles.put(newAdmin, updatedProfile);
                };
            };
            case null {
                // Create admin profile
                let newProfile : UserProfile = {
                    principal = newAdmin;
                    roles = [#Admin];
                    username = "";
                    email = "";
                    createdAt = Time.now();
                    lastLogin = null;
                    image = null;
                };

                userProfiles.put(newAdmin, newProfile);
            };
        };

        return #ok();
    };

    // User management for admins
    public shared (msg) func getAllUsers() : async Result.Result<[UserProfile], AuthError> {
        let caller = msg.caller;

        if (not (await isAdmin(caller))) {
            return #err(#NotAuthorized);
        };

        let usersBuffer = Buffer.Buffer<UserProfile>(userProfiles.size());
        for ((_, profile) in userProfiles.entries()) {
            usersBuffer.add(profile);
        };

        return #ok(Buffer.toArray(usersBuffer));
    };

    public shared (msg) func getUserByPrincipal(principal : Principal) : async Result.Result<UserProfile, AuthError> {
        let caller = msg.caller;

        // User can view their own profile, or admin can view any profile
        if (not (Principal.equal(caller, principal) or (await isAdmin(caller)))) {
            return #err(#NotAuthorized);
        };

        switch (userProfiles.get(principal)) {
            case (?profile) {
                return #ok(profile);
            };
            case null {
                return #err(#ProfileNotFound);
            };
        };
    };

    public shared func hasProfile(userPrincipal : Principal) : async Bool {
        let result = await getUserByPrincipal(userPrincipal);
        switch (result) {
            case (#ok(_)) { true };
            case (#err(_)) { false };
        };
    };

    // Helper for cleaning expired sessions
    public shared (msg) func cleanExpiredSessions() : async Result.Result<Nat, AuthError> {
        let caller = msg.caller;

        if (not (await isAdmin(caller))) {
            return #err(#NotAuthorized);
        };

        let now = Time.now();
        let expiredSessionIds = Buffer.Buffer<Text>(0);

        for ((id, session) in sessions.entries()) {
            if (session.expiresAt < now) {
                expiredSessionIds.add(id);
            };
        };

        for (id in expiredSessionIds.vals()) {
            sessions.delete(id);
        };

        return #ok(expiredSessionIds.size());
    };

    // Helper functions
    private func generateSessionId(principal : Principal, timestamp : Int) : Text {
        let principalText = Principal.toText(principal);
        let timestampText = Int.toText(timestamp);
        let combined = principalText # ":" # timestampText;

        return combined; // In production, this should be hashed or use a more secure method
    };

};
