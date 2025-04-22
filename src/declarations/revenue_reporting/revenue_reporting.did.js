export const idlFactory = ({ IDL }) => {
  const RevenueError = IDL.Variant({
    'TransferError' : IDL.Text,
    'DistributionFailed' : IDL.Null,
    'NotFound' : IDL.Null,
    'ValidationError' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'NoTokensFound' : IDL.Null,
    'MSMENotFound' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : RevenueError });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Time = IDL.Int;
  const DistributionTx = IDL.Record({
    'tokenId' : IDL.Nat,
    'txId' : IDL.Opt(IDL.Nat),
    'recipient' : Account,
    'timestamp' : Time,
    'amount' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Vec(DistributionTx),
    'err' : RevenueError,
  });
  const Revenue = IDL.Record({
    'id' : IDL.Text,
    'msmeId' : IDL.Text,
    'distributed' : IDL.Bool,
    'distributionTxs' : IDL.Vec(DistributionTx),
    'description' : IDL.Text,
    'reportDate' : Time,
    'amount' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : RevenueError });
  return IDL.Service({
    'distributeRevenue' : IDL.Func([IDL.Text], [Result], []),
    'getDistributionDetails' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getMSMERevenues' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'getRevenue' : IDL.Func([IDL.Text], [IDL.Opt(Revenue)], ['query']),
    'reportRevenue' : IDL.Func([IDL.Text, IDL.Nat, IDL.Text], [Result_1], []),
    'setAdminPrincipal' : IDL.Func([IDL.Principal], [Result], []),
    'updateCanisterReferences' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
