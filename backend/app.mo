import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";

actor class Backend() {
  public shared func greet(name : Text) : async Text {
    let message = "Hello, " # name # "!";
    return message;
  };

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

 public type UserRole = {
        #Admin;
        #MSME;
        #Investor;
        #Verifier;
    };

    public type UserProfile = {
        principal : Principal;
        roles : [UserRole];
        username : ?Text;
        email : ?Text;
        createdAt : Time.Time;
        lastLogin : ?Time.Time;
    };

    private var userProfiles = TrieMap.TrieMap<Principal, UserProfile>(Principal.equal, Principal.hash);

 public type AuthError = {
        #NotAuthorized;
        #ProfileNotFound;
        #AlreadyExists;
        #SessionExpired;
        #InvalidToken;
        #OperationFailed;
    };


 public shared (msg) func registerUser(username : ?Text, email : ?Text, initialRole : UserRole) : async Result.Result<UserProfile, AuthError> {
  let caller = msg.caller;


  let user : UserProfile = {
    principal = caller;
    roles = [initialRole];
    username = username;
    email = email;
    createdAt = Time.now();
    lastLogin = null;
  };
  userProfiles.put(caller, user);

  return #ok(user);
 }
  // Public function to get a user's profile
  // public query func getProfile(userPrincipal : Principal) : async ?UserProfile {
  //   return userProfiles.get(userPrincipal);
  // };

  // Public function to get the caller's profile
  // public shared query(msg) func getMyProfile() : async ?UserProfile {
  //   return userProfiles.get(msg.caller);
  // };

  // Public function to check if a user has registered a profile

};
