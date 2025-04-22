import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface DistributionTx {
  'tokenId' : bigint,
  'txId' : [] | [bigint],
  'recipient' : Account,
  'timestamp' : Time,
  'amount' : bigint,
}
export type Result = { 'ok' : null } |
  { 'err' : RevenueError };
export type Result_1 = { 'ok' : string } |
  { 'err' : RevenueError };
export type Result_2 = { 'ok' : Array<DistributionTx> } |
  { 'err' : RevenueError };
export interface Revenue {
  'id' : string,
  'msmeId' : string,
  'distributed' : boolean,
  'distributionTxs' : Array<DistributionTx>,
  'description' : string,
  'reportDate' : Time,
  'amount' : bigint,
}
export type RevenueError = { 'TransferError' : string } |
  { 'DistributionFailed' : null } |
  { 'NotFound' : null } |
  { 'ValidationError' : null } |
  { 'Unauthorized' : null } |
  { 'NoTokensFound' : null } |
  { 'MSMENotFound' : null };
export type Subaccount = Uint8Array | number[];
export type Time = bigint;
export interface _SERVICE {
  'distributeRevenue' : ActorMethod<[string], Result>,
  'getDistributionDetails' : ActorMethod<[string], Result_2>,
  'getMSMERevenues' : ActorMethod<[string], Array<string>>,
  'getRevenue' : ActorMethod<[string], [] | [Revenue]>,
  'reportRevenue' : ActorMethod<[string, bigint, string], Result_1>,
  'setAdminPrincipal' : ActorMethod<[Principal], Result>,
  'updateCanisterReferences' : ActorMethod<[string, string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
