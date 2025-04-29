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
actor VerificationWorkflow {
    // Types
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
        comments : [VerificationComment];
        documents : [Document];
        requiredDocuments : [Text];
    };

    type VerificationComment = {
        id : Text;
        author : Principal;
        text : Text;
        timestamp : Time.Time;
        isInternal : Bool; // True if visible only to verification officers
    };

    type Document = {
        id : Text;
        name : Text;
        documentType : Types.DocumentType;
        assetId : Text;
        uploadedAt : Time.Time;
        uploadedBy : Principal;
        status : Types.DocumentStatus;
        reviewComments : ?Text;
    };

    type Error = {
        #NotFound;
        #Unauthorized;
        #AlreadyExists;
        #InvalidInput;
        #SystemError;
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

    // For connecting to the MSME Registration canister
    private var msmeRegistrationCanister : ?Principal = null;

    // System management functions
    public shared ({ caller }) func setMSMERegistrationCanister(canisterId : Principal) : async Result.Result<(), Error> {
        if (not _isAdmin(caller)) {
            return #err(#Unauthorized);
        };
        msmeRegistrationCanister := ?canisterId;
        #ok();
    };

    public shared ({ caller }) func addVerificationOfficer(
        officerId : Principal,
        name : Text,
        department : Text,
    ) : async Result.Result<(), Error> {
        if (not _isAdmin(caller)) {
            return #err(#Unauthorized);
        };

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
        if (not _isAdmin(caller)) {
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
        requiredDocuments : [Text],
    ) : async Result.Result<Text, Error> {
        // In a production app, we would verify caller is from MSME canister

        let requestId = _generateRequestId();
        let request : VerificationRequest = {
            id = requestId;
            msmeId = msmeId;
            status = #Pending;
            createdAt = Time.now();
            updatedAt = Time.now();
            assignedTo = null;
            comments = [];
            documents = [];
            requiredDocuments = requiredDocuments;
        };

        verificationRequests.put(requestId, request);
        #ok(requestId);
    };

    public shared ({ caller }) func assignRequest(
        requestId : Text,
        officerId : Principal,
    ) : async Result.Result<(), Error> {
        if (not _isVerificationOfficerOrAdmin(caller)) {
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
                    comments = request.comments;
                    documents = request.documents;
                    requiredDocuments = request.requiredDocuments;
                };
                verificationRequests.put(requestId, updatedRequest);
                #ok();
            };
        };
    };

    public shared ({ caller }) func addComment(
        requestId : Text,
        text : Text,
        isInternal : Bool,
    ) : async Result.Result<(), Error> {
        if (not _isVerificationOfficerOrAdmin(caller) and isInternal) {
            return #err(#Unauthorized);
        };

        // Update the request
        switch (verificationRequests.get(requestId)) {
            case (null) {
                #err(#NotFound);
            };
            case (?request) {
                let comment : VerificationComment = {
                    id = _generateCommentId();
                    author = caller;
                    text = text;
                    timestamp = Time.now();
                    isInternal = isInternal;
                };

                let commentsBuffer = Buffer.fromArray<VerificationComment>(request.comments);
                commentsBuffer.add(comment);

                let updatedRequest = {
                    id = request.id;
                    msmeId = request.msmeId;
                    status = request.status;
                    createdAt = request.createdAt;
                    updatedAt = Time.now();
                    assignedTo = request.assignedTo;
                    comments = Buffer.toArray(commentsBuffer);
                    documents = request.documents;
                    requiredDocuments = request.requiredDocuments;
                };
                verificationRequests.put(requestId, updatedRequest);
                #ok();
            };
        };
    };

    public shared ({ caller }) func uploadDocument(
        requestId : Text,
        name : Text,
        docType : Types.DocumentType,
        assetId : Text,
        role : Types.UserRole,
    ) : async Result.Result<(), Error> {

        if (role != #MSME) {
            return #err(#Unauthorized);
        };

        switch (verificationRequests.get(requestId)) {
            case (null) {
                #err(#NotFound);
            };
            case (?request) {
                let document : Document = {
                    id = _generateDocumentId();
                    name = name;
                    documentType = docType;
                    assetId = assetId;
                    uploadedAt = Time.now();
                    uploadedBy = caller;
                    status = #Pending;
                    reviewComments = null;
                };

                let documentsBuffer = Buffer.fromArray<Document>(request.documents);
                documentsBuffer.add(document);

                let updatedRequest = {
                    id = request.id;
                    msmeId = request.msmeId;
                    status = request.status;
                    createdAt = request.createdAt;
                    updatedAt = Time.now();
                    assignedTo = request.assignedTo;
                    comments = request.comments;
                    documents = Buffer.toArray(documentsBuffer);
                    requiredDocuments = request.requiredDocuments;
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
        comments : ?Text,
    ) : async Result.Result<(), Error> {
        if (not _isVerificationOfficerOrAdmin(caller)) {
            return #err(#Unauthorized);
        };

        switch (verificationRequests.get(requestId)) {
            case (null) {
                #err(#NotFound);
            };
            case (?request) {
                let documentsBuffer = Buffer.fromArray<Document>(request.documents);
                var documentFound = false;

                let updatedDocuments = Array.map<Document, Document>(
                    request.documents,
                    func(doc : Document) : Document {
                        if (doc.id == documentId) {
                            documentFound := true;
                            return {
                                id = doc.id;
                                name = doc.name;
                                documentType = doc.documentType;
                                assetId = doc.assetId;
                                uploadedAt = doc.uploadedAt;
                                uploadedBy = doc.uploadedBy;
                                status = status;
                                reviewComments = comments;
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
                    comments = request.comments;
                    documents = updatedDocuments;
                    requiredDocuments = request.requiredDocuments;
                };
                verificationRequests.put(requestId, updatedRequest);
                #ok();
            };
        };
    };

    public shared ({ caller }) func updateVerificationStatus(
        requestId : Text,
        status : VerificationStatus,
    ) : async Result.Result<(), Error> {
        if (not _isVerificationOfficerOrAdmin(caller)) {
            return #err(#Unauthorized);
        };

        switch (verificationRequests.get(requestId)) {
            case (null) {
                #err(#NotFound);
            };
            case (?request) {
                let updatedRequest = {
                    id = request.id;
                    msmeId = request.msmeId;
                    status = status;
                    createdAt = request.createdAt;
                    updatedAt = Time.now();
                    assignedTo = request.assignedTo;
                    comments = request.comments;
                    documents = request.documents;
                    requiredDocuments = request.requiredDocuments;
                };
                verificationRequests.put(requestId, updatedRequest);

                // Notify MSME canister about the status change
                // This would call the MSME canister to update status there
                // await _notifyMsmeCanister(request.msmeId, status);
                #ok();
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
        if (not _isVerificationOfficerOrAdmin(caller)) {
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

    private func _isAdmin(caller : Principal) : Bool {
        // In a real implementation, this would check against a list of admin principals
        // For now, just return true for simplicity in development
        true;
    };

    private func _isVerificationOfficer(caller : Principal) : Bool {
        Option.isSome(verificationOfficers.get(caller));
    };

    private func _isVerificationOfficerOrAdmin(caller : Principal) : Bool {
        _isVerificationOfficer(caller) or _isAdmin(caller);
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
