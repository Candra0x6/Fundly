import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
    // MSME Types
    public type MSMEID = Text;

    // MSME Registration Types

    public type MSME = {
        id : Text;
        details : BusinessDetails;
        contactInfo : ContactInfo;
        financialInfo : FinancialInfo;
        overview : ?Overview;
        teamMembers : [TeamMember];
        documents : [Document];
        gallery : ?[Gallery];
        roadmap : ?[Roadmap];
        registrationDate : Time.Time;
        verificationStatus : VerificationStatus;
        updateHistory : [UpdateRecord];
    };

    public type BusinessDetails = {
        name : Text;
        owner : Principal;
        focusArea : Text;
        industry : [Text];
        foundingDate : Time.Time;
        description : Text;
        logo : Document;
        coverImage : Document;
    };

    public type ContactInfo = {
        streetAddress : Text;
        city : Text;
        state : Text;
        country : Text;
        postalCode : Text;
        email : Text;
        phone : Text;
        website : ?Text;
    };

    public type FinancialInfo = {
        annualRevenue : Nat;
        employeeCount : Nat;
        fundingGoal : Nat;
        fundingPurpose : Text;
    };

    public type Document = {
        id : Text;
        name : Text;
        docType : DocumentType;
        assetCanisterId : ?Text;
        assetId : Text;
        uploadDate : Time.Time;
        verified : Bool;
    };

    public type TeamMember = {
        image : Document;
        name : Text;
        position : Text;
        email : Text;
        bio : Text;
    };

    public type Overview = {
        mission : Text;
        vision : Text;
        impact : Text;
        uniqueValueProposition : Text;
        marketOpportunity : Text;
        keyAchievements : [Text];
    };

    public type Gallery = {
        image : Document;
        title : Text;
        description : Text;
    };

    public type Roadmap = {
        title : Text;
        description : Text;
        timeline : Text;
        milestones : [Milestone];
    };

    public type Milestone = {
        title : Text;
        description : Text;
        status : Text;
    };

    public type DocumentType = {
        #BusinessRegistration;
        #FinancialStatement;
        #TaxDocument;
        #ImpactReport;
        #TeamProfile;
        #BusinessPlan;
        #Other : Text;
        #BusinessCoverImage;
        #BusinessLogo;
        #GalleryImage;
        #TeamMemberImage;
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

    // Revenue and Distribution Types
    public type RevenueReport = {
        id : Text;
        msmeId : MSMEID;
        reportPeriod : ReportPeriod;
        totalRevenue : Nat;
        distributionAmount : Nat;
        distributionStatus : DistributionStatus;
        createdAt : Time.Time;
        processedAt : ?Time.Time;
        reportedBy : Principal;
    };

    public type ReportPeriod = {
        startDate : Time.Time;
        endDate : Time.Time;
    };

    public type DistributionStatus = {
        #Pending;
        #InProgress;
        #Completed;
        #Failed;
    };

    public type Error = {
        #AlreadyRegistered;
        #NotFound;
        #Unauthorized;
        #ValidationError;
        #DocumentError;
        #VerificationError;
        #OperationFailed : Text;
    };
    // Token Types
    public type TokenInfo = {
        tokenId : Nat;
        owner : Principal;
        msmeId : MSMEID;
        sharePercentage : Float;
        issuedAt : Time.Time;
    };

    public type UserRole = {
        #Admin;
        #MSME;
        #Investor;
        #Verifier;
    };
    public type DocumentStatus = {
        #Pending;
        #Approved;
        #Rejected;
    };

};
