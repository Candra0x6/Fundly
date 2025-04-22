export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'InvalidInput' : IDL.Null,
    'SystemError' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const MSMEID = IDL.Text;
  const Result_2 = IDL.Variant({ 'ok' : IDL.Text, 'err' : Error });
  const VerificationStatus = IDL.Variant({
    'NeedsMoreInfo' : IDL.Null,
    'Approved' : IDL.Null,
    'InReview' : IDL.Null,
    'Rejected' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const DocumentStatus = IDL.Variant({
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Time = IDL.Int;
  const Document = IDL.Record({
    'id' : IDL.Text,
    'status' : DocumentStatus,
    'documentType' : IDL.Text,
    'name' : IDL.Text,
    'reviewComments' : IDL.Opt(IDL.Text),
    'uploadedAt' : Time,
    'uploadedBy' : IDL.Principal,
    'fileUrl' : IDL.Text,
  });
  const VerificationComment = IDL.Record({
    'id' : IDL.Text,
    'text' : IDL.Text,
    'author' : IDL.Principal,
    'isInternal' : IDL.Bool,
    'timestamp' : Time,
  });
  const VerificationRequest = IDL.Record({
    'id' : IDL.Text,
    'status' : VerificationStatus,
    'msmeId' : MSMEID,
    'documents' : IDL.Vec(Document),
    'assignedTo' : IDL.Opt(IDL.Principal),
    'requiredDocuments' : IDL.Vec(IDL.Text),
    'createdAt' : Time,
    'updatedAt' : Time,
    'comments' : IDL.Vec(VerificationComment),
  });
  const VerificationOfficer = IDL.Record({
    'id' : IDL.Principal,
    'name' : IDL.Text,
    'addedAt' : Time,
    'department' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : VerificationRequest, 'err' : Error });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Text, IDL.Text, IDL.Bool], [Result], []),
    'addVerificationOfficer' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'assignRequest' : IDL.Func([IDL.Text, IDL.Principal], [Result], []),
    'createVerificationRequest' : IDL.Func(
        [MSMEID, IDL.Vec(IDL.Text)],
        [Result_2],
        [],
      ),
    'getPendingVerificationRequests' : IDL.Func(
        [],
        [IDL.Vec(VerificationRequest)],
        ['query'],
      ),
    'getRequestsAssignedToOfficer' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(VerificationRequest)],
        ['query'],
      ),
    'getRequestsForMSME' : IDL.Func(
        [MSMEID],
        [IDL.Vec(VerificationRequest)],
        ['query'],
      ),
    'getVerificationOfficers' : IDL.Func(
        [],
        [IDL.Vec(VerificationOfficer)],
        ['query'],
      ),
    'getVerificationRequest' : IDL.Func([IDL.Text], [Result_1], ['query']),
    'removeVerificationOfficer' : IDL.Func([IDL.Principal], [Result], []),
    'reviewDocument' : IDL.Func(
        [IDL.Text, IDL.Text, DocumentStatus, IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
    'setMSMERegistrationCanister' : IDL.Func([IDL.Principal], [Result], []),
    'updateVerificationStatus' : IDL.Func(
        [IDL.Text, VerificationStatus],
        [Result],
        [],
      ),
    'uploadDocument' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
