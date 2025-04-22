import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Asset {
  'id' : string,
  'contentType' : string,
  'owner' : Principal,
  'data' : Uint8Array | number[],
  'createdAt' : Time,
  'relatedEntity' : [] | [{ 'entityId' : string, 'entityType' : string }],
}
export type AssetError = { 'StorageFull' : null } |
  { 'NotFound' : null } |
  { 'ValidationError' : null } |
  { 'Unauthorized' : null };
export type AssetId = string;
export type ChunkId = bigint;
export interface ChunkedAsset {
  'id' : AssetId,
  'contentType' : string,
  'owner' : Principal,
  'createdAt' : Time,
  'chunkIds' : Array<ChunkId>,
  'totalSize' : bigint,
  'relatedEntity' : [] | [{ 'entityId' : string, 'entityType' : string }],
}
export type Result = { 'ok' : ChunkId } |
  { 'err' : AssetError };
export type Result_1 = { 'ok' : AssetId } |
  { 'err' : AssetError };
export type Time = bigint;
export interface _SERVICE {
  'beginChunkedAsset' : ActorMethod<
    [string, bigint, [] | [{ 'entityId' : string, 'entityType' : string }]],
    Result_1
  >,
  'getAsset' : ActorMethod<[AssetId], [] | [Asset]>,
  'getChunk' : ActorMethod<[ChunkId], [] | [Uint8Array | number[]]>,
  'getChunkedAssetInfo' : ActorMethod<[AssetId], [] | [ChunkedAsset]>,
  'storeAsset' : ActorMethod<
    [
      string,
      Uint8Array | number[],
      [] | [{ 'entityId' : string, 'entityType' : string }],
    ],
    Result_1
  >,
  'uploadChunk' : ActorMethod<[AssetId, Uint8Array | number[]], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
