// MSME Registration Canister
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Iter "mo:base/Iter";

actor MSMERegistration {
    // Enhanced Types
    public type MSME = {
        id : Text;
        name : Text;
        owner : Principal;
        description : Text;
        category : Text;
        location : Text;
        contactInfo : ContactInfo;
        financialInfo : ?FinancialInfo;
        socialImpactMetrics : [Text];
        documents : [Document];
        registrationDate : Time.Time;
        verificationStatus : VerificationStatus;
        updateHistory : [UpdateRecord];
    };

    public type ContactInfo = {
        email : Text;
        phone : ?Text;
        website : ?Text;
        socialMedia : ?[SocialMediaAccount];
    };

    public type SocialMediaAccount = {
        platform : Text;
        handle : Text;
    };

    public type FinancialInfo = {
        annualRevenue : ?Nat;
        establishedYear : ?Nat;
        employeeCount : ?Nat;
        fundingGoal : ?Nat;
        fundingPurpose : ?Text;
        revenueModel : ?Text;
    };

    public type Document = {
        id : Text;
        name : Text;
        docType : DocumentType;
        assetCanisterId : ?Text;
        assetId : ?Text;
        uploadDate : Time.Time;
        verified : Bool;
    };

    public type DocumentType = {
        #BusinessRegistration;
        #FinancialStatement;
        #TaxDocument;
        #ImpactReport;
        #TeamProfile;
        #BusinessPlan;
        #Other : Text;
    };

    public type VerificationStatus = {
        #Unverified;
        #UnderReview;
        #PartiallyVerified : [VerificationField];
        #Verified : VerificationData;
        #Rejected : Text;
    };

    public type VerificationField = {
        #Identity;
        #BusinessRegistration;
        #FinancialRecords;
        #ImpactCredentials;
        #Other : Text;
    };

    public type VerificationData = {
        verifiedBy : Principal;
        verificationDate : Time.Time;
        expiryDate : ?Time.Time;
        verificationLevel : Nat; // 1-3, with 3 being highest
        credentials : ?Text; // Reference to verification credential
    };

    public type UpdateRecord = {
        updateTime : Time.Time;
        updatedBy : Principal;
        updateType : UpdateType;
        details : Text;
    };

    public type UpdateType = {
        #Created;
        #ProfileUpdated;
        #DocumentAdded;
        #DocumentVerified;
        #VerificationStatusChanged;
        #OwnerChanged;
    };

    public type MSMEError = {
        #AlreadyRegistered;
        #NotFound;
        #Unauthorized;
        #ValidationError;
        #DocumentError;
        #VerificationError;
        #OperationFailed : Text;
    };

    public type MSMERegistrationArgs = {
        name : Text;
        description : Text;
        category : Text;
        location : Text;
        contactInfo : ContactInfo;
        financialInfo : ?FinancialInfo;
        socialImpactMetrics : [Text];
    };

    // State variables
    private var msmes = HashMap.HashMap<Text, MSME>(0, Text.equal, Text.hash);
    private var ownerToMSMEs = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);
    private var verifiersRegistry = HashMap.HashMap<Principal, VerifierInfo>(0, Principal.equal, Principal.hash);
    private var categoryToMSMEs = HashMap.HashMap<Text, [Text]>(0, Text.equal, Text.hash);
    private var locationToMSMEs = HashMap.HashMap<Text, [Text]>(0, Text.equal, Text.hash);

    // Stable storage for upgrades
    private stable var nextMSMEId : Nat = 0;
    private stable var admin : Principal = Principal.fromText("aaaaa-aa"); // Will be set to proper admin principal
    private stable var assetCanisterId : ?Text = null; // ID of the asset canister for document storage
    private stable var verificationCanisterId : ?Text = null; // ID of the verification workflow canister

    // Type for storing verifier information
    public type VerifierInfo = {
        name : Text;
        specialization : [Text];
        verificationLevel : Nat; // Maximum level this verifier can approve
        active : Bool;
        addedOn : Time.Time;
    };

    // Register a new MSME
    public shared (msg) func registerMSME(args : MSMERegistrationArgs) : async Result.Result<Text, MSMEError> {
        let owner = msg.caller;

        // Validate required fields
        if (args.name == "" or args.description == "" or args.category == "") {
            return #err(#ValidationError);
        };

        // Check if contact info is valid
        if (args.contactInfo.email == "") {
            return #err(#ValidationError);
        };

        let msmeId = nextMSMEId;
        let idText = Nat.toText(msmeId);

        // Create initial update record
        let initialUpdate : UpdateRecord = {
            updateTime = Time.now();
            updatedBy = owner;
            updateType = #Created;
            details = "MSME initially registered";
        };

        // Create MSME record with enhanced fields
        let msme : MSME = {
            id = idText;
            name = args.name;
            owner = owner;
            description = args.description;
            category = args.category;
            location = args.location;
            contactInfo = args.contactInfo;
            financialInfo = args.financialInfo;
            socialImpactMetrics = args.socialImpactMetrics;
            documents = [];
            registrationDate = Time.now();
            verificationStatus = #Unverified;
            updateHistory = [initialUpdate];
        };

        // Store the MSME
        msmes.put(idText, msme);

        // Update owner's MSME list
        _addMSMEToOwner(owner, idText);

        // Update category index
        _addMSMEToCategory(args.category, idText);

        // Update location index
        _addMSMEToLocation(args.location, idText);

        nextMSMEId += 1;
        return #ok(idText);
    };

    // Get MSME by ID
    public query func getMSME(id : Text) : async ?MSME {
        return msmes.get(id);
    };

    // Get all MSMEs owned by a principal
    public query func getOwnedMSMEs(owner : Principal) : async [Text] {
        switch (ownerToMSMEs.get(owner)) {
            case (null) { return [] };
            case (?ids) { return ids };
        };
    };

    // Get MSMEs by category
    public query func getMSMEsByCategory(category : Text) : async [Text] {
        switch (categoryToMSMEs.get(category)) {
            case (null) { return [] };
            case (?ids) { return ids };
        };
    };

    // Get MSMEs by location
    public query func getMSMEsByLocation(location : Text) : async [Text] {
        switch (locationToMSMEs.get(location)) {
            case (null) { return [] };
            case (?ids) { return ids };
        };
    };

    // Update MSME profile
    public shared (msg) func updateMSMEProfile(
        id : Text,
        name : ?Text,
        description : ?Text,
        category : ?Text,
        location : ?Text,
        contactInfo : ?ContactInfo,
        financialInfo : ?FinancialInfo,
        socialImpactMetrics : ?[Text],
    ) : async Result.Result<(), MSMEError> {
        switch (msmes.get(id)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership
                if (msme.owner != msg.caller and msg.caller != admin) {
                    return #err(#Unauthorized);
                };

                // Create update record
                let updateRecord : UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #ProfileUpdated;
                    details = "Profile information updated";
                };

                // Update the MSME record with provided fields
                let updatedMSME : MSME = {
                    id = msme.id;
                    name = Option.get(name, msme.name);
                    owner = msme.owner;
                    description = Option.get(description, msme.description);
                    category = Option.get(category, msme.category);
                    location = Option.get(location, msme.location);
                    contactInfo = Option.get(contactInfo, msme.contactInfo);
                    financialInfo = switch (financialInfo) {
                        case (null) { msme.financialInfo };
                        case (someInfo) { someInfo };
                    };
                    socialImpactMetrics = Option.get(socialImpactMetrics, msme.socialImpactMetrics);
                    documents = msme.documents;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                // Update category index if changed
                if (Option.isSome(category) and Option.get(category, msme.category) != msme.category) {
                    _removeMSMEFromCategory(msme.category, id);
                    _addMSMEToCategory(Option.get(category, msme.category), id);
                };

                // Update location index if changed
                if (Option.isSome(location) and Option.get(location, msme.location) != msme.location) {
                    _removeMSMEFromLocation(msme.location, id);
                    _addMSMEToLocation(Option.get(location, msme.location), id);
                };

                msmes.put(id, updatedMSME);
                return #ok();
            };
        };
    };

    // Add a document to an MSME
    public shared (msg) func addDocument(
        msmeId : Text,
        name : Text,
        docType : DocumentType,
        assetId : ?Text,
    ) : async Result.Result<Text, MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership
                if (msme.owner != msg.caller and msg.caller != admin) {
                    return #err(#Unauthorized);
                };

                let docId = msmeId # "-doc-" # Nat.toText(msme.documents.size());

                let document : Document = {
                    id = docId;
                    name = name;
                    docType = docType;
                    assetCanisterId = assetCanisterId;
                    assetId = assetId;
                    uploadDate = Time.now();
                    verified = false;
                };

                // Create update record
                let updateRecord : UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #DocumentAdded;
                    details = "Document added: " # name;
                };

                // Add document to MSME
                let updatedDocuments = Array.append(msme.documents, [document]);
                let updatedHistory = Array.append(msme.updateHistory, [updateRecord]);

                let updatedMSME : MSME = {
                    id = msme.id;
                    name = msme.name;
                    owner = msme.owner;
                    description = msme.description;
                    category = msme.category;
                    location = msme.location;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    socialImpactMetrics = msme.socialImpactMetrics;
                    documents = updatedDocuments;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = updatedHistory;
                };

                msmes.put(msmeId, updatedMSME);
                return #ok(docId);
            };
        };
    };

    // Verification request - change status to under review
    public shared (msg) func requestVerification(msmeId : Text) : async Result.Result<(), MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership
                if (msme.owner != msg.caller) {
                    return #err(#Unauthorized);
                };

                // Only allow unverified or rejected MSMEs to request verification
                switch (msme.verificationStatus) {
                    case (#Verified(_)) { return #err(#VerificationError) };
                    case (#UnderReview) { return #err(#VerificationError) };
                    case (#PartiallyVerified(_)) {
                        return #err(#VerificationError);
                    };
                    case (_) { /* Proceed */ };
                };

                // Create update record
                let updateRecord : UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #VerificationStatusChanged;
                    details = "Verification requested";
                };

                let updatedMSME : MSME = {
                    id = msme.id;
                    name = msme.name;
                    owner = msme.owner;
                    description = msme.description;
                    category = msme.category;
                    location = msme.location;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    socialImpactMetrics = msme.socialImpactMetrics;
                    documents = msme.documents;
                    registrationDate = msme.registrationDate;
                    verificationStatus = #UnderReview;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                msmes.put(msmeId, updatedMSME);

                // Notify the verification canister (would be implemented in production)
                // Here we would make a cross-canister call to the verification workflow canister

                return #ok();
            };
        };
    };

    // Update verification status (admin or verifier only)
    public shared (msg) func updateVerificationStatus(
        msmeId : Text,
        status : VerificationStatus,
    ) : async Result.Result<(), MSMEError> {
        // Check if caller is admin or a registered verifier
        if (msg.caller != admin and not _isVerifier(msg.caller)) {
            return #err(#Unauthorized);
        };

        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Create update record
                let updateRecord : UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #VerificationStatusChanged;
                    details = "Verification status updated";
                };

                let updatedMSME : MSME = {
                    id = msme.id;
                    name = msme.name;
                    owner = msme.owner;
                    description = msme.description;
                    category = msme.category;
                    location = msme.location;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    socialImpactMetrics = msme.socialImpactMetrics;
                    documents = msme.documents;
                    registrationDate = msme.registrationDate;
                    verificationStatus = status;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                msmes.put(msmeId, updatedMSME);
                return #ok();
            };
        };
    };

    // Transfer MSME ownership (current owner only)
    public shared (msg) func transferOwnership(
        msmeId : Text,
        newOwner : Principal,
    ) : async Result.Result<(), MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership
                if (msme.owner != msg.caller and msg.caller != admin) {
                    return #err(#Unauthorized);
                };

                // Create update record
                let updateRecord : UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #OwnerChanged;
                    details = "Ownership transferred to: " # Principal.toText(newOwner);
                };

                let updatedMSME : MSME = {
                    id = msme.id;
                    name = msme.name;
                    owner = newOwner;
                    description = msme.description;
                    category = msme.category;
                    location = msme.location;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    socialImpactMetrics = msme.socialImpactMetrics;
                    documents = msme.documents;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                // Update owner indices
                _removeMSMEFromOwner(msme.owner, msmeId);
                _addMSMEToOwner(newOwner, msmeId);

                msmes.put(msmeId, updatedMSME);
                return #ok();
            };
        };
    };

    // Admin functions

    // Register a verifier
    public shared (msg) func registerVerifier(
        verifier : Principal,
        name : Text,
        specialization : [Text],
        verificationLevel : Nat,
    ) : async Result.Result<(), MSMEError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        // Validate inputs
        if (verificationLevel < 1 or verificationLevel > 3) {
            return #err(#ValidationError);
        };

        let verifierInfo : VerifierInfo = {
            name = name;
            specialization = specialization;
            verificationLevel = verificationLevel;
            active = true;
            addedOn = Time.now();
        };

        verifiersRegistry.put(verifier, verifierInfo);
        return #ok();
    };

    // Update admin
    public shared (msg) func updateAdmin(newAdmin : Principal) : async Result.Result<(), MSMEError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        admin := newAdmin;
        return #ok();
    };

    // Set asset canister ID
    public shared (msg) func setAssetCanisterId(canisterId : Text) : async Result.Result<(), MSMEError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        assetCanisterId := ?canisterId;
        return #ok();
    };

    // Set verification canister ID
    public shared (msg) func setVerificationCanisterId(canisterId : Text) : async Result.Result<(), MSMEError> {
        if (msg.caller != admin) {
            return #err(#Unauthorized);
        };

        verificationCanisterId := ?canisterId;
        return #ok();
    };

    // Get all verifiers
    public query func getAllVerifiers() : async [(Principal, VerifierInfo)] {
        return Iter.toArray(verifiersRegistry.entries());
    };

    // Get all MSMEs
    public query func getAllMSMEs() : async [Text] {
        return Iter.toArray(
            Iter.map(
                msmes.entries(),
                func(entry : (Text, MSME)) : Text {
                    entry.0;
                },
            )
        );
    };

    // Helper functions
    private func _addMSMEToOwner(owner : Principal, msmeId : Text) {
        switch (ownerToMSMEs.get(owner)) {
            case (null) {
                ownerToMSMEs.put(owner, [msmeId]);
            };
            case (?existingIds) {
                ownerToMSMEs.put(owner, Array.append(existingIds, [msmeId]));
            };
        };
    };

    private func _removeMSMEFromOwner(owner : Principal, msmeId : Text) {
        switch (ownerToMSMEs.get(owner)) {
            case (null) { return };
            case (?existingIds) {
                let updatedIds = Array.filter<Text>(
                    existingIds,
                    func(id : Text) : Bool {
                        return id != msmeId;
                    },
                );
                ownerToMSMEs.put(owner, updatedIds);
            };
        };
    };

    private func _addMSMEToCategory(category : Text, msmeId : Text) {
        switch (categoryToMSMEs.get(category)) {
            case (null) {
                categoryToMSMEs.put(category, [msmeId]);
            };
            case (?existingIds) {
                categoryToMSMEs.put(category, Array.append(existingIds, [msmeId]));
            };
        };
    };

    private func _removeMSMEFromCategory(category : Text, msmeId : Text) {
        switch (categoryToMSMEs.get(category)) {
            case (null) { return };
            case (?existingIds) {
                let updatedIds = Array.filter<Text>(
                    existingIds,
                    func(id : Text) : Bool {
                        return id != msmeId;
                    },
                );
                categoryToMSMEs.put(category, updatedIds);
            };
        };
    };

    private func _addMSMEToLocation(location : Text, msmeId : Text) {
        switch (locationToMSMEs.get(location)) {
            case (null) {
                locationToMSMEs.put(location, [msmeId]);
            };
            case (?existingIds) {
                locationToMSMEs.put(location, Array.append(existingIds, [msmeId]));
            };
        };
    };

    private func _removeMSMEFromLocation(location : Text, msmeId : Text) {
        switch (locationToMSMEs.get(location)) {
            case (null) { return };
            case (?existingIds) {
                let updatedIds = Array.filter<Text>(
                    existingIds,
                    func(id : Text) : Bool {
                        return id != msmeId;
                    },
                );
                locationToMSMEs.put(location, updatedIds);
            };
        };
    };

    private func _isVerifier(principal : Principal) : Bool {
        switch (verifiersRegistry.get(principal)) {
            case (null) { false };
            case (?info) { info.active };
        };
    };

    // System functions for upgrade management
    system func preupgrade() {
        // To be implemented for production - save state to stable variables
    };

    system func postupgrade() {
        // To be implemented for production - restore state from stable variables
    };
};
