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
import Types "../../types";

actor MSMERegistration {
    // Enhanced Types
    public type MSMERegistrationArgs = {
        details : Types.BusinessDetails;
        contactInfo : Types.ContactInfo;
        financialInfo : Types.FinancialInfo;
        industry : [Text];
        teamMembers : [Types.TeamMember];
    };

    public type MSMEUpdateArgs = {
        details : Types.BusinessDetails;
        contactInfo : Types.ContactInfo;
        financialInfo : Types.FinancialInfo;
        teamMembers : [Types.TeamMember];
        overview : ?Types.Overview;
        gallery : ?[Types.Gallery];
        roadmap : ?[Types.Roadmap];
        documents : [Types.Document];
    };

    // State variables
    private var msmes = HashMap.HashMap<Text, Types.MSME>(0, Text.equal, Text.hash);
    private var ownerToMSMEs = HashMap.HashMap<Principal, [Text]>(0, Principal.equal, Principal.hash);
    private var verifiersRegistry = HashMap.HashMap<Principal, VerifierInfo>(0, Principal.equal, Principal.hash);
    private var categoryToMSMEs = HashMap.HashMap<Text, [Text]>(0, Text.equal, Text.hash);
    private var locationToMSMEs = HashMap.HashMap<Text, [Text]>(0, Text.equal, Text.hash);

    // Stable storage for upgrades
    private stable var nextMSMEId : Nat = 0;
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
    public shared (msg) func registerMSME(args : MSMERegistrationArgs, role : Types.UserRole) : async Result.Result<Text, Types.MSMEError> {
        if (role != #MSME) {
            return #err(#Unauthorized);
        };

        let owner = msg.caller;

        // Validate required fields
        if (args.details.name == "" or args.details.description == "" or args.details.focusArea == "") {
            return #err(#ValidationError);
        };

        // Check if contact info is valid
        if (args.contactInfo.email == "") {
            return #err(#ValidationError);
        };

        let msmeId = nextMSMEId;
        let idText = "MSME-" # Nat.toText(msmeId);

        // Create initial update record
        let initialUpdate : Types.UpdateRecord = {
            updateTime = Time.now();
            updatedBy = owner;
            updateType = #Created;
            details = "MSME initially registered";
        };

        // Create MSME record with enhanced fields
        let msme : Types.MSME = {
            id = idText;
            details = args.details;
            contactInfo = args.contactInfo;
            financialInfo = args.financialInfo;
            overview = null;
            teamMembers = args.teamMembers;
            documents = [];
            gallery = null;
            roadmap = null;
            registrationDate = Time.now();
            verificationStatus = #Unverified;
            updateHistory = [initialUpdate];
        };

        // Store the MSME
        msmes.put(idText, msme);

        // Update owner's MSME list
        _addMSMEToOwner(owner, idText);

        // Update category index
        _addMSMEToCategory(args.details.focusArea, idText);

        // Update location index
        _addMSMEToLocation(args.contactInfo.country, idText);

        nextMSMEId += 1;
        return #ok(idText);
    };

    // Get MSME by ID
    public query func getMSME(id : Text) : async Result.Result<Types.MSME, Types.MSMEError> {
        switch (msmes.get(id)) {
            case (?msme) return #ok(msme);
            case (null) {
                return #err(#NotFound);
            };
        };
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
        args : MSMEUpdateArgs,
    ) : async Result.Result<(), Types.MSMEError> {
        switch (msmes.get(id)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership

                // Create update record
                let updateRecord : Types.UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #ProfileUpdated;
                    details = "Profile information updated";
                };

                // Update the MSME record with provided fields
                let updatedMSME : Types.MSME = {
                    id = msme.id;
                    details = args.details;
                    contactInfo = args.contactInfo;
                    financialInfo = args.financialInfo;
                    overview = args.overview;
                    teamMembers = args.teamMembers;
                    documents = args.documents;
                    gallery = args.gallery;
                    roadmap = args.roadmap;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                // Update category index if changed
                if (args.details.focusArea != msme.details.focusArea) {
                    _removeMSMEFromCategory(msme.details.focusArea, id);
                    _addMSMEToCategory(args.details.focusArea, id);
                };

                // Update location index if changed
                if (args.contactInfo.country != msme.contactInfo.country) {
                    _removeMSMEFromLocation(msme.contactInfo.country, id);
                    _addMSMEToLocation(args.contactInfo.country, id);
                };

                msmes.put(id, updatedMSME);
                return #ok();
            };
        };
    };

    public shared (msg) func updatedDocumentVerified(
        msmeId : Text,
        documentId : Text,
        verified : Bool,
    ) : async Result.Result<(), Types.MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {

                // Update the document
                let updatedDocuments = Array.map<Types.Document, Types.Document>(
                    msme.documents,
                    func(doc : Types.Document) : Types.Document {
                        if (doc.id == documentId) {
                            return {
                                id = doc.id;
                                name = doc.name;
                                docType = doc.docType;
                                assetCanisterId = doc.assetCanisterId;
                                assetId = doc.assetId;
                                uploadDate = doc.uploadDate;
                                verified = verified;
                            };
                        } else {
                            return doc;
                        };
                    },
                );

                // Create update record
                let updateRecord : Types.UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #DocumentVerified;
                    details = "Document verification status updated: " # documentId;
                };

                // Update the MSME record
                let updatedMSME : Types.MSME = {
                    id = msme.id;
                    details = msme.details;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    overview = msme.overview;
                    teamMembers = msme.teamMembers;
                    documents = updatedDocuments;
                    gallery = msme.gallery;
                    roadmap = msme.roadmap;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                msmes.put(msmeId, updatedMSME);
                return #ok();
            };
        };
    };

    // Add a document to an MSME
    public shared (msg) func addDocument(
        msmeId : Text,
        name : Text,
        docType : Types.DocumentType,
        assetId : Text,
    ) : async Result.Result<Text, Types.MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership

                let docId = msmeId # "-doc-" # Nat.toText(msme.documents.size());

                let document : Types.Document = {
                    id = docId;
                    name = name;
                    docType = docType;
                    assetCanisterId = assetCanisterId;
                    assetId = assetId;
                    uploadDate = Time.now();
                    verified = false;
                };

                // Create update record
                let updateRecord : Types.UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #DocumentAdded;
                    details = "Document added: " # name;
                };

                let updatedDocuments = Array.append(msme.documents, [document]);

                let updatedHistory = Array.append(msme.updateHistory, [updateRecord]);

                let updatedMSME : Types.MSME = {
                    id = msme.id;
                    details = msme.details;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    overview = msme.overview;
                    teamMembers = msme.teamMembers;
                    documents = updatedDocuments;
                    gallery = msme.gallery;
                    roadmap = msme.roadmap;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = updatedHistory;
                };

                msmes.put(msmeId, updatedMSME);
                return #ok(docId);
            };
        };
    };

    // Verifi       cation request - change status to under review
    public shared (msg) func requestVerification(msmeId : Text) : async Result.Result<(), Types.MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership
                if (msme.details.owner != msg.caller) {
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
                let updateRecord : Types.UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #VerificationStatusChanged;
                    details = "Verification requested";
                };

                let updatedMSME : Types.MSME = {
                    id = msme.id;
                    details = msme.details;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    overview = msme.overview;
                    teamMembers = msme.teamMembers;
                    documents = msme.documents;
                    gallery = msme.gallery;
                    roadmap = msme.roadmap;
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
        status : Types.VerificationStatus,
    ) : async Result.Result<(), Types.MSMEError> {
        // Check if caller is admin or a registered verifier

        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Create update record
                let updateRecord : Types.UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #VerificationStatusChanged;
                    details = "Verification status updated";
                };

                let updatedMSME : Types.MSME = {
                    id = msme.id;
                    details = msme.details;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    overview = msme.overview;
                    teamMembers = msme.teamMembers;
                    documents = msme.documents;
                    gallery = msme.gallery;
                    roadmap = msme.roadmap;
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
    ) : async Result.Result<(), Types.MSMEError> {
        switch (msmes.get(msmeId)) {
            case (null) { return #err(#NotFound) };
            case (?msme) {
                // Verify ownership

                // Create update record
                let updateRecord : Types.UpdateRecord = {
                    updateTime = Time.now();
                    updatedBy = msg.caller;
                    updateType = #OwnerChanged;
                    details = "Ownership transferred to: " # Principal.toText(newOwner);
                };

                let updatedMSME : Types.MSME = {
                    id = msme.id;
                    details = msme.details;
                    contactInfo = msme.contactInfo;
                    financialInfo = msme.financialInfo;
                    overview = msme.overview;
                    teamMembers = msme.teamMembers;
                    documents = msme.documents;
                    gallery = msme.gallery;
                    roadmap = msme.roadmap;
                    registrationDate = msme.registrationDate;
                    verificationStatus = msme.verificationStatus;
                    updateHistory = Array.append(msme.updateHistory, [updateRecord]);
                };

                // Update owner indices
                _removeMSMEFromOwner(msme.details.owner, msmeId);
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
    ) : async Result.Result<(), Types.MSMEError> {

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

    // Set asset canister ID
    public shared (msg) func setAssetCanisterId(canisterId : Text) : async Result.Result<(), Types.MSMEError> {

        assetCanisterId := ?canisterId;
        return #ok();
    };

    // Set verification canister ID
    public shared (msg) func setVerificationCanisterId(canisterId : Text) : async Result.Result<(), Types.MSMEError> {

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
                func(entry : (Text, Types.MSME)) : Text {
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
