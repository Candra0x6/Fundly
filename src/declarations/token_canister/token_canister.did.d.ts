import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface Allowance {
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export interface ApproveArgs {
  'fee' : [] | [bigint],
  'memo' : [] | [Memo],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [Timestamp],
  'amount' : bigint,
  'expected_allowance' : [] | [bigint],
  'expires_at' : [] | [bigint],
  'spender' : Account,
}
export type ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'AllowanceChanged' : { 'current_allowance' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type Memo = Uint8Array | number[];
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : TransferError };
export type Result_3 = { 'ok' : bigint } |
  { 'err' : ApproveError };
export type Subaccount = Uint8Array | number[];
export type Timestamp = bigint;
export interface Transaction {
  'id' : bigint,
  'to' : Account,
  'fee' : [] | [bigint],
  'from' : Account,
  'memo' : [] | [Memo],
  'operation' : string,
  'timestamp' : Timestamp,
  'amount' : bigint,
}
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'memo' : [] | [Memo],
  'from_subaccount' : [] | [Subaccount],
  'created_at_time' : [] | [Timestamp],
  'amount' : bigint,
}
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export interface TransferFromArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'spender_subaccount' : [] | [Subaccount],
  'from' : Account,
  'memo' : [] | [Memo],
  'created_at_time' : [] | [Timestamp],
  'amount' : bigint,
}
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export interface _SERVICE {
  'burn' : ActorMethod<[Account, bigint], Result_1>,
  'getRecentTransactions' : ActorMethod<[bigint], Array<Transaction>>,
  'getTransaction' : ActorMethod<[bigint], [] | [Transaction]>,
  'icrc1_balance_of' : ActorMethod<[Account], bigint>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, Value]>>,
  'icrc1_minter' : ActorMethod<[], Principal>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], Result_2>,
  'icrc2_allowance' : ActorMethod<
    [{ 'account' : Account, 'spender' : Account }],
    Allowance
  >,
  'icrc2_approve' : ActorMethod<[ApproveArgs], Result_3>,
  'icrc2_transfer_from' : ActorMethod<[TransferFromArgs], Result_2>,
  'initialize' : ActorMethod<[], undefined>,
  'mint' : ActorMethod<[Account, bigint], Result_1>,
  'setFee' : ActorMethod<[bigint], Result>,
  'setMinter' : ActorMethod<[Principal], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
