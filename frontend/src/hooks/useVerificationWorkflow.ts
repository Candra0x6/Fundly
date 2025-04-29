import { useState, useCallback } from 'react';
import { useVerificationWorkflowActor } from '../utility/actors/verificationWorkflow';
import { Principal } from '@dfinity/principal';
import { DocumentStatus, DocumentType, Error, UserRole, VerificationOfficer, VerificationRequest, VerificationStatus } from '@declarations/verification_workflow/verification_workflow.did';

// Types based on the Motoko canister
export type MSMEID = string;



export type Result<T, E> = { ok: T } | { err: E };

/**
 * Hook for interacting with the Verification Workflow canister
 * @returns Object with functions to interact with the verification workflow
 */
export function useVerificationWorkflow() {
  const actor = useVerificationWorkflowActor();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Set the MSME Registration canister ID (admin only)
   * @param canisterId - The Principal ID of the MSME Registration canister
   * @returns Promise with the result
   */
  const setMSMERegistrationCanister = useCallback(
    async (canisterId: Principal): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.setMSMERegistrationCanister(canisterId);
        return result;
      } catch (e) {
        console.error("Failed to set MSME Registration canister:", e);
        setError("Failed to set MSME Registration canister");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Add a verification officer (admin only)
   * @param officerId - The Principal ID of the officer
   * @param name - The name of the officer
   * @param department - The department the officer belongs to
   * @returns Promise with the result
   */
  const addVerificationOfficer = useCallback(
    async (officerId: Principal, name: string, department: string): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.addVerificationOfficer(officerId, name, department);
        return result;
      } catch (e) {
        console.error("Failed to add verification officer:", e);
        setError("Failed to add verification officer");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Remove a verification officer (admin only)
   * @param officerId - The Principal ID of the officer to remove
   * @returns Promise with the result
   */
  const removeVerificationOfficer = useCallback(
    async (officerId: Principal): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.removeVerificationOfficer(officerId);
        return result;
      } catch (e) {
        console.error("Failed to remove verification officer:", e);
        setError("Failed to remove verification officer");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Create a new verification request
   * @param msmeId - The ID of the MSME
   * @param requiredDocuments - Array of required document names
   * @returns Promise with the request ID
   */
  const createVerificationRequest = useCallback(
    async (msmeId: MSMEID, requiredDocuments: string[]): Promise<Result<string, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.createVerificationRequest(msmeId, requiredDocuments);
        return result;
      } catch (e) {
        console.error("Failed to create verification request:", e);
        setError("Failed to create verification request");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Assign a verification request to an officer
   * @param requestId - The ID of the request
   * @param officerId - The Principal ID of the officer
   * @returns Promise with the result
   */
  const assignRequest = useCallback(
    async (requestId: string, officerId: Principal): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.assignRequest(requestId, officerId);
        return result;
      } catch (e) {
        console.error("Failed to assign request:", e);
        setError("Failed to assign request");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Add a comment to a verification request
   * @param requestId - The ID of the request
   * @param text - The comment text
   * @param isInternal - Whether the comment is for internal use only
   * @returns Promise with the result
   */
  const addComment = useCallback(
    async (requestId: string, text: string, isInternal: boolean): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.addComment(requestId, text, isInternal);
        return result;
      } catch (e) {
        console.error("Failed to add comment:", e);
        setError("Failed to add comment");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Upload a document for a verification request
   * @param requestId - The ID of the request
   * @param name - The document name
   * @param documentType - The type of document
   * @param assetId - The ID of the asset
   * @param role - The role of the user
   * @returns Promise with the result
   */
  const uploadDocument = useCallback(
    async (requestId: string, name: string, documentType: DocumentType, assetId: string, role: UserRole): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.uploadDocument(requestId, name, documentType, assetId, role);
        return result;
      } catch (e) {
        console.error("Failed to upload document:", e);
        setError("Failed to upload document");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Review a document in a verification request
   * @param requestId - The ID of the request
   * @param documentId - The ID of the document
   * @param status - The new status for the document
   * @param comments - Optional review comments
   * @returns Promise with the result
   */
  const reviewDocument = useCallback(
    async (
      requestId: string,
      documentId: string,
      status: DocumentStatus,
      comments?: string
    ): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.reviewDocument(requestId, documentId, status, comments ? [comments] : []);
        return result;
      } catch (e) {
        console.error("Failed to review document:", e);
        setError("Failed to review document");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Update the status of a verification request
   * @param requestId - The ID of the request
   * @param status - The new status
   * @returns Promise with the result
   */
  const updateVerificationStatus = useCallback(
    async (requestId: string, status: VerificationStatus): Promise<Result<null, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.updateVerificationStatus(requestId, status);
        return result;
      } catch (e) {
        console.error("Failed to update verification status:", e);
        setError("Failed to update verification status");
        return { err: { SystemError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get a verification request by ID
   * @param requestId - The ID of the request
   * @returns Promise with the verification request
   */
  const getVerificationRequest = useCallback(
    async (requestId: string): Promise<Result<VerificationRequest, Error>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getVerificationRequest(requestId);
        return result;
      } catch (e) {
        console.error("Failed to get verification request:", e);
        setError("Failed to get verification request");
        return { err: { NotFound: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get all verification officers
   * @returns Promise with array of verification officers
   */
  const getVerificationOfficers = useCallback(
    async (): Promise<VerificationOfficer[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getVerificationOfficers();
        return result;
      } catch (e) {
        console.error("Failed to get verification officers:", e);
        setError("Failed to get verification officers");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get all pending verification requests
   * @returns Promise with array of pending verification requests
   */
  const getPendingVerificationRequests = useCallback(
    async (): Promise<VerificationRequest[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getPendingVerificationRequests();
        return result;
      } catch (e) {
        console.error("Failed to get pending verification requests:", e);
        setError("Failed to get pending verification requests");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get verification requests assigned to an officer
   * @param officerId - The Principal ID of the officer
   * @returns Promise with array of assigned verification requests
   */
  const getRequestsAssignedToOfficer = useCallback(
    async (officerId: Principal): Promise<VerificationRequest[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getRequestsAssignedToOfficer(officerId);
        return result;
      } catch (e) {
        console.error("Failed to get assigned requests:", e);
        setError("Failed to get assigned requests");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get verification requests for an MSME
   * @param msmeId - The ID of the MSME
   * @returns Promise with array of verification requests for the MSME
   */
  const getRequestsForMSME = useCallback(
    async (msmeId: MSMEID): Promise<VerificationRequest[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getRequestsForMSME(msmeId);
        return result;
      } catch (e) {
        console.error("Failed to get MSME requests:", e);
        setError("Failed to get MSME requests");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  return {
    loading,
    error,
    setMSMERegistrationCanister,
    addVerificationOfficer,
    removeVerificationOfficer,
    createVerificationRequest,
    assignRequest,
    addComment,
    uploadDocument,
    reviewDocument,
    updateVerificationStatus,
    getVerificationRequest,
    getVerificationOfficers,
    getPendingVerificationRequests,
    getRequestsAssignedToOfficer,
    getRequestsForMSME
  };
}