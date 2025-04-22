export const idlFactory = ({ IDL }) => {
  const AssetId = IDL.Text;
  const AssetError = IDL.Variant({
    'StorageFull' : IDL.Null,
    'NotFound' : IDL.Null,
    'ValidationError' : IDL.Null,
    'Unauthorized' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : AssetId, 'err' : AssetError });
  const Time = IDL.Int;
  const Asset = IDL.Record({
    'id' : IDL.Text,
    'contentType' : IDL.Text,
    'owner' : IDL.Principal,
    'data' : IDL.Vec(IDL.Nat8),
    'createdAt' : Time,
    'relatedEntity' : IDL.Opt(
      IDL.Record({ 'entityId' : IDL.Text, 'entityType' : IDL.Text })
    ),
  });
  const ChunkId = IDL.Nat;
  const ChunkedAsset = IDL.Record({
    'id' : AssetId,
    'contentType' : IDL.Text,
    'owner' : IDL.Principal,
    'createdAt' : Time,
    'chunkIds' : IDL.Vec(ChunkId),
    'totalSize' : IDL.Nat,
    'relatedEntity' : IDL.Opt(
      IDL.Record({ 'entityId' : IDL.Text, 'entityType' : IDL.Text })
    ),
  });
  const Result = IDL.Variant({ 'ok' : ChunkId, 'err' : AssetError });
  return IDL.Service({
    'beginChunkedAsset' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat,
          IDL.Opt(
            IDL.Record({ 'entityId' : IDL.Text, 'entityType' : IDL.Text })
          ),
        ],
        [Result_1],
        [],
      ),
    'getAsset' : IDL.Func([AssetId], [IDL.Opt(Asset)], ['query']),
    'getChunk' : IDL.Func([ChunkId], [IDL.Opt(IDL.Vec(IDL.Nat8))], ['query']),
    'getChunkedAssetInfo' : IDL.Func(
        [AssetId],
        [IDL.Opt(ChunkedAsset)],
        ['query'],
      ),
    'storeAsset' : IDL.Func(
        [
          IDL.Text,
          IDL.Vec(IDL.Nat8),
          IDL.Opt(
            IDL.Record({ 'entityId' : IDL.Text, 'entityType' : IDL.Text })
          ),
        ],
        [Result_1],
        [],
      ),
    'uploadChunk' : IDL.Func([AssetId, IDL.Vec(IDL.Nat8)], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
