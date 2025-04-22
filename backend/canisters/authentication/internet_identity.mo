import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
    // Types for Internet Identity integration
    public type UserNumber = Nat64;
    public type PublicKey = Blob;
    public type CredentialId = Blob;
    public type DeviceKey = PublicKey;
    public type UserKey = PublicKey;
    public type SessionKey = PublicKey;
    public type FrontendHostname = Text;
    public type Timestamp = Nat64;

    // Challenge is used in the authentication handshake
    public type Challenge = {
        png_base64 : Text;
        challenge_key : ChallengeKey;
    };

    public type ChallengeKey = Text;

    // Device registration types
    public type DeviceData = {
        pubkey : DeviceKey;
        alias : Text;
        credential_id : ?CredentialId;
        purpose : Purpose;
        key_type : KeyType;
    };

    public type Purpose = {
        #authentication;
        #recovery;
    };

    public type KeyType = {
        #unknown;
        #platform;
        #cross_platform;
        #seed_phrase;
    };

    public type RegisterResponse = {
        #registered : { user_number : UserNumber };
        #bad_challenge;
        #canister_full;
    };

    // Authentication request and response
    public type GetDelegationResponse = {
        #signed_delegation : SignedDelegation;
        #no_such_delegation;
    };

    public type SignedDelegation = {
        delegation : Delegation;
        signature : Blob;
    };

    public type Delegation = {
        pubkey : PublicKey;
        expiration : Timestamp;
        targets : ?[Principal];
    };

    // Helper functions for working with Internet Identity
    public func principalToUserNumber(p : Principal) : UserNumber {
        let bytes = Blob.toArray(Principal.toBlob(p));

        // Internet Identity user principals are 29 bytes long
        if (bytes.size() != 29) {
            return 0; // Not an II principal
        };

        // The user number is encoded in the last 8 bytes
        let user_number_bytes = Array.subArray(bytes, bytes.size() - 8, 8);

        // Convert to UserNumber (Nat64)
        var num : Nat64 = 0;
        for (i in user_number_bytes.vals()) {
            num := num * 256 + Nat64.fromNat(Nat8.toNat(i));
        };

        return num;
    };

    // Validate that a principal comes from Internet Identity
    public func isInternetIdentityPrincipal(p : Principal) : Bool {
        let bytes = Blob.toArray(Principal.toBlob(p));

        // Internet Identity user principals are 29 bytes long
        if (bytes.size() != 29) {
            return false;
        };

        // The first 10 bytes of II principals form a specific pattern
        // This is a simplified check - in production you might want a more robust validation
        let prefix = Array.subArray(bytes, 0, 10);

        // Check some characteristics of II principals
        // This is not exhaustive but helps filter obvious non-II principals
        let user_number = principalToUserNumber(p);
        return user_number > 0;
    };

    // Extract the user number from an Internet Identity principal
    public func getUserNumber(p : Principal) : ?UserNumber {
        if (isInternetIdentityPrincipal(p)) {
            return ?principalToUserNumber(p);
        };
        return null;
    };
};
