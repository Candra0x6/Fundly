import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Types "../../types/lib";
import Int "mo:base/Int";
import Bool "mo:base/Bool";
import AuthenticationCanister "canister:authentication";
import MSMERegistrationCanister "canister:msme_registration";
actor VerificationWorkflow {
    // Typesz
    type MSMEID = Types.MSMEID;

    type VerificationOfficer = {
        id : Principal;
        name : Text;
        department : Text;
        addedAt : Time.Time;
    };

    type VerificationStatus = {
        #Pending;
        #InReview;
        #Approved;
        #Rejected;
        #NeedsMoreInfo;
    };

    type VerificationRequest = {
        id : Text;
        msmeId : MSMEID;
        status : VerificationStatus;
        createdAt : Time.Time;
        updatedAt : Time.Time;
        assignedTo : ?Principal;
        documents : [Types.Document];
    };

    type VerificationComment = {
        id : Text;
        author : Principal;
        text : Text;
        timestamp : Time.Time;
        isInternal : Bool; // True if visible only to verification officers
    };

    type Error = {
        #NotFound;
        #Unauthorized;
        #AlreadyExists;
        #InvalidInput;
        #SystemError;
    };

    public type RequestWithMSMEDetails = {
        request : VerificationRequest;
        msmeDetails : ?Types.MSME;
    };
    // State variables
    private stable var nextRequestId : Nat = 1;
    private stable var verificationOfficersEntries : [(Principal, VerificationOfficer)] = [];
    private stable var verificationRequestsEntries : [(Text, VerificationRequest)] = [];

    private let verificationOfficers = HashMap.fromIter<Principal, VerificationOfficer>(
        verificationOfficersEntries.vals(),
        10,
        Principal.equal,
        Principal.hash,
    );

    private let verificationRequests = HashMap.fromIter<Text, VerificationRequest>(
        verificationRequestsEntries.vals(),
        10,
        Text.equal,
        Text.hash,
    );

    public shared ({ caller }) func addVerificationOfficer(
        officerId : Principal,
        name : Text,
        department : Text,
    ) : async Result.Result<(), Error> {
        // Ensure the officer doesn't already exist
        switch (verificationOfficers.get(officerId)) {
            case (null) {
                let officer : VerificationOfficer = {
                    id = officerId;
                    name = name;
                    department = department;
                    addedAt = Time.now();
                };
                verificationOfficers.put(officerId, officer);
                #ok();
            };
            case (_) {
                #err(#AlreadyExists);
            };
        };
    };

    public shared ({ caller }) func removeVerificationOfficer(officerId : Principal) : async Result.Result<(), Error> {
        if (not _isVerificationOfficer(caller)) {
            return #err(#Unauthorized);
        };

        // Check if the officer exists
        switch (verificationOfficers.get(officerId)) {
            case (null) {
                #err(#NotFound);
            };
            case (_) {
                verificationOfficers.delete(officerId);
                #ok();
            };
        };
    };

    // MSME verification request functions
    public shared ({ caller }) func createVerificationRequest(
        msmeId : MSMEID,
        documents : [Types.Document],
    ) : async Result.Result<Text, Error> {

        let requestId = _generateRequestId();
        let request : VerificationRequest = {
            id = requestId;
            msmeId = msmeId;
            status = #Pending;
            createdAt = Time.now();
            updatedAt = Time.now();
            assignedTo = null;
            documents = documents;
        };

        verificationRequests.put(requestId, request);
        #ok(requestId);
    };

    public shared ({ caller }) func assignRequest(
        requestId : Text,
        officerId : Principal,
    ) : async Result.Result<(), Error> {
        if (not _isVerificationOfficer(caller)) {
            return #err(#Unauthorized);
        };

        // Ensure the officer exists
        switch (verificationOfficers.get(officerId)) {
            case (null) {
                return #err(#NotFound);
            };
            case (_) {};
        };

        // Update the request
        switch (verificationRequests.get(requestId)) {
            case (null) {
                #err(#NotFound);
            };
            case (?request) {
                let updatedRequest = {
                    id = request.id;
                    msmeId = request.msmeId;
                    status = #InReview;
                    createdAt = request.createdAt;
                    updatedAt = Time.now();
                    assignedTo = ?officerId;
                    documents = request.documents;
                };
                verificationRequests.put(requestId, updatedRequest);
                #ok();
            };
        };
    };

    public shared ({ caller }) func reviewDocument(
        requestId : Text,
        documentId : Text,
        status : Types.DocumentStatus,
    ) : async Result.Result<(), Error> {
        if (not _isVerificationOfficer(caller)) {
            return #err(#Unauthorized);
        };

        switch (verificationRequests.get(requestId)) {
            case (null) {
                #err(#NotFound);
            };
            case (?request) {
                let documentsBuffer = Buffer.fromArray<Types.Document>(request.documents);
                var documentFound = false;

                let updatedDocuments = Array.map<Types.Document, Types.Document>(
                    request.documents,
                    func(doc : Types.Document) : Types.Document {
                        if (doc.id == documentId) {
                            documentFound := true;
                            return {
                                id = doc.id;
                                name = doc.name;
                                docType = doc.docType;
                                assetId = doc.assetId;
                                uploadDate = doc.uploadDate;
                                verified = doc.verified;
                                assetCanisterId = doc.assetCanisterId;
                            };
                        } else {
                            return doc;
                        };
                    },
                );

                if (not documentFound) {
                    return #err(#NotFound);
                };

                let updatedRequest = {
                    id = request.id;
                    msmeId = request.msmeId;
                    status = request.status;
                    createdAt = request.createdAt;
                    updatedAt = Time.now();
                    assignedTo = request.assignedTo;
                    documents = updatedDocuments;
                };
                verificationRequests.put(requestId, updatedRequest);
                #ok();
            };
        };
    };

    public shared ({ caller }) func updateVerificationStatus(
        requestId : Text,
        status : VerificationStatus,
        docStatus : Bool,
        documentId : Text,
    ) : async Result.Result<(), Error> {
        // Check authorization first
        if (not _isVerificationOfficer(caller)) {
            return #err(#Unauthorized);
        };

        // Validate request exists
        switch (verificationRequests.get(requestId)) {
            case (null) {
                return #err(#NotFound);
            };
            case (?request) {
                // First do the cross-canister call
                // This ensures we don't update our state if the remote call fails
                let result = await MSMERegistrationCanister.updatedDocumentVerified(
                    request.msmeId,
                    documentId,
                    docStatus,
                );
                Debug.print("Result: " # debug_show (result));

                switch (result) {
                    case (#err(_e)) {
                        return #err(#SystemError);
                    };
                    case (#ok()) {
                        let updatedRequest = {
                            id = request.id;
                            msmeId = request.msmeId;
                            status = status;
                            createdAt = request.createdAt;
                            updatedAt = Time.now();
                            assignedTo = request.assignedTo;
                            documents = request.documents;
                        };
                        verificationRequests.put(requestId, updatedRequest);
                        return #ok();
                    };
                };
            };
        };
    };

    // Query functions
    public query func getVerificationRequest(
        requestId : Text
    ) : async Result.Result<VerificationRequest, Error> {
        switch (verificationRequests.get(requestId)) {
            case (null) { #err(#NotFound) };
            case (?request) { #ok(request) };
        };
    };

    public query ({ caller }) func getVerificationOfficers() : async [VerificationOfficer] {
        if (not _isVerificationOfficer(caller)) {
            return [];
        };

        let buffer = Buffer.Buffer<VerificationOfficer>(10);
        for ((_, officer) in verificationOfficers.entries()) {
            buffer.add(officer);
        };

        Buffer.toArray(buffer);
    };

    public query func getPendingVerificationRequests() : async [VerificationRequest] {
        let buffer = Buffer.Buffer<VerificationRequest>(10);
        for ((_, request) in verificationRequests.entries()) {
            if (request.status == #Pending) {
                buffer.add(request);
            };
        };

        Buffer.toArray(buffer);
    };

    public query func getRequestsAssignedToOfficer(officerId : Principal) : async [VerificationRequest] {
        let buffer = Buffer.Buffer<VerificationRequest>(10);
        for ((_, request) in verificationRequests.entries()) {
            switch (request.assignedTo) {
                case (?assignedOfficer) {
                    if (Principal.equal(assignedOfficer, officerId)) {
                        buffer.add(request);
                    };
                };
                case (_) {};
            };
        };

        Buffer.toArray(buffer);
    };

    public query func getRequestsForMSME(msmeId : MSMEID) : async [VerificationRequest] {
        let buffer = Buffer.Buffer<VerificationRequest>(10);
        for ((_, request) in verificationRequests.entries()) {
            if (request.msmeId == msmeId) {
                buffer.add(request);
            };
        };

        Buffer.toArray(buffer);
    };

    public shared func getAllRequestsWithMSMEDetails() : async [RequestWithMSMEDetails] {
        let buffer = Buffer.Buffer<RequestWithMSMEDetails>(10);

        for ((_, request) in verificationRequests.entries()) {
            // Get MSME details for each request
            let msmeResult = await MSMERegistrationCanister.getMSME(request.msmeId);

            let msmeDetails = switch (msmeResult) {
                case (#ok(msme)) { ?msme };
                case (#err(_)) { null };
            };

            let requestWithDetails : RequestWithMSMEDetails = {
                request = request;
                msmeDetails = msmeDetails;
            };

            buffer.add(requestWithDetails);
        };

        Buffer.toArray(buffer);
    };
    // Helper functions
    private func _generateRequestId() : Text {
        let id = "VR" # Nat.toText(nextRequestId);
        nextRequestId += 1;
        id;
    };

    private func _generateCommentId() : Text {
        "CM" # Nat.toText(Int.abs(Time.now()));
    };

    private func _generateDocumentId() : Text {
        "DOC" # Nat.toText(Int.abs(Time.now()));
    };

    private func _isVerificationOfficer(caller : Principal) : Bool {
        Option.isSome(verificationOfficers.get(caller));
    };

    // System functions for stable memory
    system func preupgrade() {
        verificationOfficersEntries := Iter.toArray(verificationOfficers.entries());
        verificationRequestsEntries := Iter.toArray(verificationRequests.entries());
    };

    system func postupgrade() {
        verificationOfficersEntries := [];
        verificationRequestsEntries := [];
    };
};
