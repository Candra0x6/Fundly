import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Document {
  'id' : string,
  'status' : DocumentStatus,
  'documentType' : string,
  'name' : string,
  'reviewComments' : [] | [string],
  'uploadedAt' : Time,
  'uploadedBy' : Principal,
  'fileUrl' : string,
}
export type DocumentStatus = { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Pending' : null };
export type Error = { 'InvalidInput' : null } |
  { 'SystemError' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyExists' : null };
export type MSMEID = string;
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : VerificationRequest } |
  { 'err' : Error };
export type Result_2 = { 'ok' : string } |
  { 'err' : Error };
export type Time = bigint;
export interface VerificationComment {
  'id' : string,
  'text' : string,
  'author' : Principal,
  'isInternal' : boolean,
  'timestamp' : Time,
}
export interface VerificationOfficer {
  'id' : Principal,
  'name' : string,
  'addedAt' : Time,
  'department' : string,
}
export interface VerificationRequest {
  'id' : string,
  'status' : VerificationStatus,
  'msmeId' : MSMEID,
  'documents' : Array<Document>,
  'assignedTo' : [] | [Principal],
  'requiredDocuments' : Array<string>,
  'createdAt' : Time,
  'updatedAt' : Time,
  'comments' : Array<VerificationComment>,
}
export type VerificationStatus = { 'NeedsMoreInfo' : null } |
  { 'Approved' : null } |
  { 'InReview' : null } |
  { 'Rejected' : null } |
  { 'Pending' : null };
export interface _SERVICE {
  'addComment' : ActorMethod<[string, string, boolean], Result>,
  'addVerificationOfficer' : ActorMethod<[Principal, string, string], Result>,
  'assignRequest' : ActorMethod<[string, Principal], Result>,
  'createVerificationRequest' : ActorMethod<[MSMEID, Array<string>], Result_2>,
  'getPendingVerificationRequests' : ActorMethod<
    [],
    Array<VerificationRequest>
  >,
  'getRequestsAssignedToOfficer' : ActorMethod<
    [Principal],
    Array<VerificationRequest>
  >,
  'getRequestsForMSME' : ActorMethod<[MSMEID], Array<VerificationRequest>>,
  'getVerificationOfficers' : ActorMethod<[], Array<VerificationOfficer>>,
  'getVerificationRequest' : ActorMethod<[string], Result_1>,
  'removeVerificationOfficer' : ActorMethod<[Principal], Result>,
  'reviewDocument' : ActorMethod<
    [string, string, DocumentStatus, [] | [string]],
    Result
  >,
  'setMSMERegistrationCanister' : ActorMethod<[Principal], Result>,
  'updateVerificationStatus' : ActorMethod<
    [string, VerificationStatus],
    Result
  >,
  'uploadDocument' : ActorMethod<[string, string, string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
