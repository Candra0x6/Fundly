import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AuthError = { 'OperationFailed' : null } |
  { 'ProfileNotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'InvalidToken' : null } |
  { 'AlreadyExists' : null } |
  { 'SessionExpired' : null };
export type Result = { 'ok' : Principal } |
  { 'err' : AuthError };
export type Result_1 = { 'ok' : UserProfile } |
  { 'err' : AuthError };
export type Result_2 = { 'ok' : null } |
  { 'err' : AuthError };
export type Result_3 = { 'ok' : string } |
  { 'err' : AuthError };
export type Result_4 = { 'ok' : Array<UserProfile> } |
  { 'err' : AuthError };
export type Result_5 = { 'ok' : bigint } |
  { 'err' : AuthError };
export type Time = bigint;
export interface UserProfile {
  'principal' : Principal,
  'username' : [] | [string],
  'createdAt' : Time,
  'email' : [] | [string],
  'lastLogin' : [] | [Time],
  'roles' : Array<UserRole>,
}
export type UserRole = { 'MSME' : null } |
  { 'Admin' : null } |
  { 'Investor' : null } |
  { 'Verifier' : null };
export interface _SERVICE {
  'addRole' : ActorMethod<[Principal, UserRole], Result_1>,
  'cleanExpiredSessions' : ActorMethod<[], Result_5>,
  'getAllUsers' : ActorMethod<[], Result_4>,
  'getMyProfile' : ActorMethod<[], Result_1>,
  'getUserByPrincipal' : ActorMethod<[Principal], Result_1>,
  'hasProfile' : ActorMethod<[Principal], boolean>,
  'hasRole' : ActorMethod<[Principal, UserRole], boolean>,
  'isAdmin' : ActorMethod<[Principal], boolean>,
  'isInvestor' : ActorMethod<[Principal], boolean>,
  'isMSME' : ActorMethod<[Principal], boolean>,
  'isVerifier' : ActorMethod<[Principal], boolean>,
  'login' : ActorMethod<[], Result_3>,
  'logout' : ActorMethod<[string], Result_2>,
  'registerUser' : ActorMethod<
    [[] | [string], [] | [string], UserRole],
    Result_1
  >,
  'removeRole' : ActorMethod<[Principal, UserRole], Result_1>,
  'setAdminPrincipal' : ActorMethod<[Principal], Result_2>,
  'updateProfile' : ActorMethod<[[] | [string], [] | [string]], Result_1>,
  'validateSession' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
