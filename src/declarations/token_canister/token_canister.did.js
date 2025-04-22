export const idlFactory = ({ IDL }) => {
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Memo = IDL.Vec(IDL.Nat8);
  const Timestamp = IDL.Nat64;
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'from' : Account,
    'memo' : IDL.Opt(Memo),
    'operation' : IDL.Text,
    'timestamp' : Timestamp,
    'amount' : IDL.Nat,
  });
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const TransferArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(Memo),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : IDL.Nat,
  });
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : TransferError });
  const Allowance = IDL.Record({
    'allowance' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const ApproveArgs = IDL.Record({
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(Memo),
    'from_subaccount' : IDL.Opt(Subaccount),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : IDL.Nat,
    'expected_allowance' : IDL.Opt(IDL.Nat),
    'expires_at' : IDL.Opt(IDL.Nat64),
    'spender' : Account,
  });
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : ApproveError });
  const TransferFromArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'spender_subaccount' : IDL.Opt(Subaccount),
    'from' : Account,
    'memo' : IDL.Opt(Memo),
    'created_at_time' : IDL.Opt(Timestamp),
    'amount' : IDL.Nat,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'burn' : IDL.Func([Account, IDL.Nat], [Result_1], []),
    'getRecentTransactions' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'getTransaction' : IDL.Func([IDL.Nat], [IDL.Opt(Transaction)], ['query']),
    'icrc1_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
        ['query'],
      ),
    'icrc1_minter' : IDL.Func([], [IDL.Principal], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_transfer' : IDL.Func([TransferArgs], [Result_2], []),
    'icrc2_allowance' : IDL.Func(
        [IDL.Record({ 'account' : Account, 'spender' : Account })],
        [Allowance],
        ['query'],
      ),
    'icrc2_approve' : IDL.Func([ApproveArgs], [Result_3], []),
    'icrc2_transfer_from' : IDL.Func([TransferFromArgs], [Result_2], []),
    'initialize' : IDL.Func([], [], []),
    'mint' : IDL.Func([Account, IDL.Nat], [Result_1], []),
    'setFee' : IDL.Func([IDL.Nat], [Result], []),
    'setMinter' : IDL.Func([IDL.Principal], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
