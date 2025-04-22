export const idlFactory = ({ IDL }) => {
  const TokenId = IDL.Nat;
  const Time = IDL.Int;
  const DistributionRecord = IDL.Record({
    'msmeId' : IDL.Text,
    'tokenId' : TokenId,
    'timestamp' : Time,
    'amount' : IDL.Nat,
  });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const ICRC7TokenMetadata = IDL.Record({
    'revenueShare' : IDL.Nat,
    'msmeId' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'royalties' : IDL.Opt(IDL.Nat),
    'image' : IDL.Opt(IDL.Text),
    'symbol' : IDL.Text,
  });
  const TransferArgs = IDL.Record({
    'to' : Account,
    'token_id' : TokenId,
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(IDL.Nat64),
  });
  const TransactionId = IDL.Nat;
  const TransferError = IDL.Variant({
    'NonExistingTokenId' : TokenId,
    'Rejected' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InvalidRecipient' : IDL.Null,
    'TooOld' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'ok' : TransactionId, 'err' : TransferError });
  const Result_1 = IDL.Variant({ 'ok' : TokenId, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'getDistributionHistory' : IDL.Func(
        [TokenId],
        [IDL.Vec(DistributionRecord)],
        ['query'],
      ),
    'getRevenueShare' : IDL.Func([TokenId], [IDL.Opt(IDL.Nat)], ['query']),
    'getTokensByMSME' : IDL.Func([IDL.Text], [IDL.Vec(TokenId)], ['query']),
    'getTotalDistributed' : IDL.Func([TokenId], [IDL.Nat], ['query']),
    'icrc7_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc7_description' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_logo' : IDL.Func([], [IDL.Opt(IDL.Text)], ['query']),
    'icrc7_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
        ['query'],
      ),
    'icrc7_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_owner_of' : IDL.Func([TokenId], [IDL.Opt(Account)], ['query']),
    'icrc7_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc7_token_metadata' : IDL.Func(
        [TokenId],
        [IDL.Opt(ICRC7TokenMetadata)],
        ['query'],
      ),
    'icrc7_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc7_transfer' : IDL.Func([TransferArgs], [Result_2], []),
    'mintRevenueShareNFT' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'recordDistribution' : IDL.Func([TokenId, IDL.Nat, IDL.Text], [Result], []),
    'setCanisterOwner' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
