import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
    // MSME Types
    public type MSMEID = Text;

    public type MSMEProfile = {
        id : MSMEID;
        owner : Principal;
        name : Text;
        description : Text;
        registrationNumber : Text;
        contactInfo : ContactInfo;
        socialLinks : ?[SocialLink];
        industry : Text;
        establishmentDate : ?Time.Time;
        location : Location;
        teamSize : Nat;
        msmeType : MSMEType;
        verificationStatus : VerificationStatus;
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };

    public type ContactInfo = {
        email : Text;
        phone : Text;
        website : ?Text;
    };

    public type SocialLink = {
        platform : Text;
        url : Text;
    };

    public type Location = {
        address : Text;
        city : Text;
        state : Text;
        country : Text;
        postalCode : Text;
    };

    public type MSMEType = {
        #Micro;
        #Small;
        #Medium;
    };

    public type VerificationStatus = {
        #Unverified;
        #PendingVerification;
        #Verified;
        #Rejected;
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

    // Token Types
    public type TokenInfo = {
        tokenId : Nat;
        owner : Principal;
        msmeId : MSMEID;
        sharePercentage : Float;
        issuedAt : Time.Time;
    };
};
