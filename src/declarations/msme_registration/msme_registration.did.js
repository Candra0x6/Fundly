export const idlFactory = ({ IDL }) => {
  const DocumentType = IDL.Variant({
    'BusinessPlan' : IDL.Null,
    'TeamProfile' : IDL.Null,
    'FinancialStatement' : IDL.Null,
    'TaxDocument' : IDL.Null,
    'Other' : IDL.Text,
    'ImpactReport' : IDL.Null,
    'BusinessRegistration' : IDL.Null,
  });
  const MSMEError = IDL.Variant({
    'OperationFailed' : IDL.Text,
    'VerificationError' : IDL.Null,
    'AlreadyRegistered' : IDL.Null,
    'DocumentError' : IDL.Null,
    'NotFound' : IDL.Null,
    'ValidationError' : IDL.Null,
    'Unauthorized' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : MSMEError });
  const Time = IDL.Int;
  const VerifierInfo = IDL.Record({
    'active' : IDL.Bool,
    'name' : IDL.Text,
    'addedOn' : Time,
    'specialization' : IDL.Vec(IDL.Text),
    'verificationLevel' : IDL.Nat,
  });
  const Document = IDL.Record({
    'id' : IDL.Text,
    'verified' : IDL.Bool,
    'assetId' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'assetCanisterId' : IDL.Opt(IDL.Text),
    'docType' : DocumentType,
    'uploadDate' : Time,
  });
  const SocialMediaAccount = IDL.Record({
    'platform' : IDL.Text,
    'handle' : IDL.Text,
  });
  const ContactInfo = IDL.Record({
    'email' : IDL.Text,
    'website' : IDL.Opt(IDL.Text),
    'phone' : IDL.Opt(IDL.Text),
    'socialMedia' : IDL.Opt(IDL.Vec(SocialMediaAccount)),
  });
  const UpdateType = IDL.Variant({
    'DocumentAdded' : IDL.Null,
    'OwnerChanged' : IDL.Null,
    'VerificationStatusChanged' : IDL.Null,
    'ProfileUpdated' : IDL.Null,
    'DocumentVerified' : IDL.Null,
    'Created' : IDL.Null,
  });
  const UpdateRecord = IDL.Record({
    'updateTime' : Time,
    'updateType' : UpdateType,
    'updatedBy' : IDL.Principal,
    'details' : IDL.Text,
  });
  const VerificationField = IDL.Variant({
    'ImpactCredentials' : IDL.Null,
    'Identity' : IDL.Null,
    'FinancialRecords' : IDL.Null,
    'Other' : IDL.Text,
    'BusinessRegistration' : IDL.Null,
  });
  const VerificationData = IDL.Record({
    'verificationDate' : Time,
    'expiryDate' : IDL.Opt(Time),
    'credentials' : IDL.Opt(IDL.Text),
    'verificationLevel' : IDL.Nat,
    'verifiedBy' : IDL.Principal,
  });
  const VerificationStatus = IDL.Variant({
    'UnderReview' : IDL.Null,
    'Rejected' : IDL.Text,
    'Unverified' : IDL.Null,
    'PartiallyVerified' : IDL.Vec(VerificationField),
    'Verified' : VerificationData,
  });
  const FinancialInfo = IDL.Record({
    'employeeCount' : IDL.Opt(IDL.Nat),
    'fundingPurpose' : IDL.Opt(IDL.Text),
    'establishedYear' : IDL.Opt(IDL.Nat),
    'revenueModel' : IDL.Opt(IDL.Text),
    'fundingGoal' : IDL.Opt(IDL.Nat),
    'annualRevenue' : IDL.Opt(IDL.Nat),
  });
  const MSME = IDL.Record({
    'id' : IDL.Text,
    'documents' : IDL.Vec(Document),
    'contactInfo' : ContactInfo,
    'updateHistory' : IDL.Vec(UpdateRecord),
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'category' : IDL.Text,
    'socialImpactMetrics' : IDL.Vec(IDL.Text),
    'registrationDate' : Time,
    'location' : IDL.Text,
    'verificationStatus' : VerificationStatus,
    'financialInfo' : IDL.Opt(FinancialInfo),
  });
  const MSMERegistrationArgs = IDL.Record({
    'contactInfo' : ContactInfo,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'category' : IDL.Text,
    'socialImpactMetrics' : IDL.Vec(IDL.Text),
    'location' : IDL.Text,
    'financialInfo' : IDL.Opt(FinancialInfo),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : MSMEError });
  return IDL.Service({
    'addDocument' : IDL.Func(
        [IDL.Text, IDL.Text, DocumentType, IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'getAllMSMEs' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'getAllVerifiers' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, VerifierInfo))],
        ['query'],
      ),
    'getMSME' : IDL.Func([IDL.Text], [IDL.Opt(MSME)], ['query']),
    'getMSMEsByCategory' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getMSMEsByLocation' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getOwnedMSMEs' : IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], ['query']),
    'registerMSME' : IDL.Func([MSMERegistrationArgs], [Result_1], []),
    'registerVerifier' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Vec(IDL.Text), IDL.Nat],
        [Result],
        [],
      ),
    'requestVerification' : IDL.Func([IDL.Text], [Result], []),
    'setAssetCanisterId' : IDL.Func([IDL.Text], [Result], []),
    'setVerificationCanisterId' : IDL.Func([IDL.Text], [Result], []),
    'transferOwnership' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'updateAdmin' : IDL.Func([IDL.Principal], [Result], []),
    'updateMSMEProfile' : IDL.Func(
        [
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(ContactInfo),
          IDL.Opt(FinancialInfo),
          IDL.Opt(IDL.Vec(IDL.Text)),
        ],
        [Result],
        [],
      ),
    'updateVerificationStatus' : IDL.Func(
        [IDL.Text, VerificationStatus],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
