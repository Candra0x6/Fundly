export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'MSME' : IDL.Null,
    'Admin' : IDL.Null,
    'Investor' : IDL.Null,
    'Verifier' : IDL.Null,
  });
  const Time = IDL.Int;
  const UserProfile = IDL.Record({
    'principal' : IDL.Principal,
    'username' : IDL.Opt(IDL.Text),
    'createdAt' : Time,
    'email' : IDL.Opt(IDL.Text),
    'lastLogin' : IDL.Opt(Time),
    'roles' : IDL.Vec(UserRole),
  });
  const AuthError = IDL.Variant({
    'OperationFailed' : IDL.Null,
    'ProfileNotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'InvalidToken' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'SessionExpired' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : UserProfile, 'err' : AuthError });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : AuthError });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Vec(UserProfile),
    'err' : AuthError,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Text, 'err' : AuthError });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : AuthError });
  const Result = IDL.Variant({ 'ok' : IDL.Principal, 'err' : AuthError });
  return IDL.Service({
    'addRole' : IDL.Func([IDL.Principal, UserRole], [Result_1], []),
    'cleanExpiredSessions' : IDL.Func([], [Result_5], []),
    'getAllUsers' : IDL.Func([], [Result_4], []),
    'getMyProfile' : IDL.Func([], [Result_1], ['query']),
    'getUserByPrincipal' : IDL.Func([IDL.Principal], [Result_1], []),
    'hasProfile' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'hasRole' : IDL.Func([IDL.Principal, UserRole], [IDL.Bool], ['query']),
    'isAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'isInvestor' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'isMSME' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'isVerifier' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'login' : IDL.Func([], [Result_3], []),
    'logout' : IDL.Func([IDL.Text], [Result_2], []),
    'registerUser' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), UserRole],
        [Result_1],
        [],
      ),
    'removeRole' : IDL.Func([IDL.Principal, UserRole], [Result_1], []),
    'setAdminPrincipal' : IDL.Func([IDL.Principal], [Result_2], []),
    'updateProfile' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result_1],
        [],
      ),
    'validateSession' : IDL.Func([IDL.Text], [Result], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
