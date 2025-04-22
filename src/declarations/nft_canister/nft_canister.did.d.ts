import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface DistributionRecord {
  'msmeId' : string,
  'tokenId' : TokenId,
  'timestamp' : Time,
  'amount' : bigint,
}
export interface ICRC7TokenMetadata {
  'revenueShare' : bigint,
  'msmeId' : string,
  'name' : string,
  'description' : string,
  'royalties' : [] | [bigint],
  'image' : [] | [string],
  'symbol' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : TokenId } |
  { 'err' : string };
export type Result_2 = { 'ok' : TransactionId } |
  { 'err' : TransferError };
export type Subaccount = Uint8Array | number[];
export type Time = bigint;
export type TokenId = bigint;
export type TransactionId = bigint;
export interface TransferArgs {
  'to' : Account,
  'token_id' : TokenId,
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [bigint],
}
export type TransferError = { 'NonExistingTokenId' : TokenId } |
  { 'Rejected' : null } |
  { 'Unauthorized' : null } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'InvalidRecipient' : null } |
  { 'TooOld' : null };
export interface _SERVICE {
  'getDistributionHistory' : ActorMethod<[TokenId], Array<DistributionRecord>>,
  'getRevenueShare' : ActorMethod<[TokenId], [] | [bigint]>,
  'getTokensByMSME' : ActorMethod<[string], Array<TokenId>>,
  'getTotalDistributed' : ActorMethod<[TokenId], bigint>,
  'icrc7_balance_of' : ActorMethod<[Account], bigint>,
  'icrc7_description' : ActorMethod<[], [] | [string]>,
  'icrc7_logo' : ActorMethod<[], [] | [string]>,
  'icrc7_metadata' : ActorMethod<[], Array<[string, string]>>,
  'icrc7_name' : ActorMethod<[], string>,
  'icrc7_owner_of' : ActorMethod<[TokenId], [] | [Account]>,
  'icrc7_symbol' : ActorMethod<[], string>,
  'icrc7_token_metadata' : ActorMethod<[TokenId], [] | [ICRC7TokenMetadata]>,
  'icrc7_total_supply' : ActorMethod<[], bigint>,
  'icrc7_transfer' : ActorMethod<[TransferArgs], Result_2>,
  'mintRevenueShareNFT' : ActorMethod<
    [string, string, string, bigint, [] | [string]],
    Result_1
  >,
  'recordDistribution' : ActorMethod<[TokenId, bigint, string], Result>,
  'setCanisterOwner' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
