import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ContactInfo {
  'email' : string,
  'website' : [] | [string],
  'phone' : [] | [string],
  'socialMedia' : [] | [Array<SocialMediaAccount>],
}
export interface Document {
  'id' : string,
  'verified' : boolean,
  'assetId' : [] | [string],
  'name' : string,
  'assetCanisterId' : [] | [string],
  'docType' : DocumentType,
  'uploadDate' : Time,
}
export type DocumentType = { 'BusinessPlan' : null } |
  { 'TeamProfile' : null } |
  { 'FinancialStatement' : null } |
  { 'TaxDocument' : null } |
  { 'Other' : string } |
  { 'ImpactReport' : null } |
  { 'BusinessRegistration' : null };
export interface FinancialInfo {
  'employeeCount' : [] | [bigint],
  'fundingPurpose' : [] | [string],
  'establishedYear' : [] | [bigint],
  'revenueModel' : [] | [string],
  'fundingGoal' : [] | [bigint],
  'annualRevenue' : [] | [bigint],
}
export interface MSME {
  'id' : string,
  'documents' : Array<Document>,
  'contactInfo' : ContactInfo,
  'updateHistory' : Array<UpdateRecord>,
  'owner' : Principal,
  'name' : string,
  'description' : string,
  'category' : string,
  'socialImpactMetrics' : Array<string>,
  'registrationDate' : Time,
  'location' : string,
  'verificationStatus' : VerificationStatus,
  'financialInfo' : [] | [FinancialInfo],
}
export type MSMEError = { 'OperationFailed' : string } |
  { 'VerificationError' : null } |
  { 'AlreadyRegistered' : null } |
  { 'DocumentError' : null } |
  { 'NotFound' : null } |
  { 'ValidationError' : null } |
  { 'Unauthorized' : null };
export interface MSMERegistrationArgs {
  'contactInfo' : ContactInfo,
  'name' : string,
  'description' : string,
  'category' : string,
  'socialImpactMetrics' : Array<string>,
  'location' : string,
  'financialInfo' : [] | [FinancialInfo],
}
export type Result = { 'ok' : null } |
  { 'err' : MSMEError };
export type Result_1 = { 'ok' : string } |
  { 'err' : MSMEError };
export interface SocialMediaAccount { 'platform' : string, 'handle' : string }
export type Time = bigint;
export interface UpdateRecord {
  'updateTime' : Time,
  'updateType' : UpdateType,
  'updatedBy' : Principal,
  'details' : string,
}
export type UpdateType = { 'DocumentAdded' : null } |
  { 'OwnerChanged' : null } |
  { 'VerificationStatusChanged' : null } |
  { 'ProfileUpdated' : null } |
  { 'DocumentVerified' : null } |
  { 'Created' : null };
export interface VerificationData {
  'verificationDate' : Time,
  'expiryDate' : [] | [Time],
  'credentials' : [] | [string],
  'verificationLevel' : bigint,
  'verifiedBy' : Principal,
}
export type VerificationField = { 'ImpactCredentials' : null } |
  { 'Identity' : null } |
  { 'FinancialRecords' : null } |
  { 'Other' : string } |
  { 'BusinessRegistration' : null };
export type VerificationStatus = { 'UnderReview' : null } |
  { 'Rejected' : string } |
  { 'Unverified' : null } |
  { 'PartiallyVerified' : Array<VerificationField> } |
  { 'Verified' : VerificationData };
export interface VerifierInfo {
  'active' : boolean,
  'name' : string,
  'addedOn' : Time,
  'specialization' : Array<string>,
  'verificationLevel' : bigint,
}
export interface _SERVICE {
  'addDocument' : ActorMethod<
    [string, string, DocumentType, [] | [string]],
    Result_1
  >,
  'getAllMSMEs' : ActorMethod<[], Array<string>>,
  'getAllVerifiers' : ActorMethod<[], Array<[Principal, VerifierInfo]>>,
  'getMSME' : ActorMethod<[string], [] | [MSME]>,
  'getMSMEsByCategory' : ActorMethod<[string], Array<string>>,
  'getMSMEsByLocation' : ActorMethod<[string], Array<string>>,
  'getOwnedMSMEs' : ActorMethod<[Principal], Array<string>>,
  'registerMSME' : ActorMethod<[MSMERegistrationArgs], Result_1>,
  'registerVerifier' : ActorMethod<
    [Principal, string, Array<string>, bigint],
    Result
  >,
  'requestVerification' : ActorMethod<[string], Result>,
  'setAssetCanisterId' : ActorMethod<[string], Result>,
  'setVerificationCanisterId' : ActorMethod<[string], Result>,
  'transferOwnership' : ActorMethod<[string, Principal], Result>,
  'updateAdmin' : ActorMethod<[Principal], Result>,
  'updateMSMEProfile' : ActorMethod<
    [
      string,
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [ContactInfo],
      [] | [FinancialInfo],
      [] | [Array<string>],
    ],
    Result
  >,
  'updateVerificationStatus' : ActorMethod<
    [string, VerificationStatus],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
