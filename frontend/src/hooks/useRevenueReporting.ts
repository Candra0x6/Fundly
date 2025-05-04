import { useState, useCallback } from 'react';
import { useRevenueActor } from '../utility/actors/revanueActor';
import { Principal } from '@dfinity/principal';
import { DistributionTx, Revenue, RevenueError } from '@declarations/revenue_reporting/revenue_reporting.did';
import { Document } from '@declarations/msme_registration/msme_registration.did';

// Types based on the Motoko canister


export type Result<T, E> = { ok: T } | { err: E };

/**
 * Hook for interacting with the Revenue Reporting canister
 * @returns Object with functions to interact with the canister
 */

export function useRevenueReporting() {
  const actor = useRevenueActor();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Report new revenue
   * @param msmeId - The ID of the MSME
   * @param amount - The revenue amount
   * @param description - Description of the revenue
   * @param document - Document of the revenue
   * @returns Promise with the result
   */
  const reportRevenue = useCallback(
    async (msmeId: string, amount: bigint, description: string, document: Document): Promise<Result<string, RevenueError>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.reportRevenue(msmeId, amount, description, document);
        return result;
      } catch (e) {
        console.error("Failed to report revenue:", e);
        setError("Failed to report revenue");
        return { err: { ValidationError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get revenue by ID
   * @param id - The revenue ID
   * @returns Promise with the revenue or null if not found
   */
  const getRevenue = useCallback(
    async (id: string): Promise<Revenue | null> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getRevenue(id);
        // The result will be opt type in Candid, handle potential undefined
        if (!result) return null;
        return result.length > 0 ? (result[0] as Revenue) : null;
      } catch (e) {
        console.error("Failed to get revenue:", e);
        setError("Failed to get revenue details");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get all revenues for an MSME
   * @param msmeId - The MSME ID
   * @returns Promise with array of revenue IDs
   */
  const getMSMERevenues = useCallback(
    async (msmeId: string): Promise<string[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getMSMERevenues(msmeId);
        return result.map((r) => r.id);
      } catch (e) {
        console.error("Failed to get MSME revenues:", e);
        setError("Failed to get MSME revenues");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Distribute revenue to token holders
   * @param revenueId - The ID of the revenue to distribute
   * @returns Promise with the result
   */
  const distributeRevenue = useCallback(
    async (revenueId: string, msmeOwner: Principal): Promise<Result<null, RevenueError>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.distributeRevenue(revenueId);
        // @ts-ignore
        return result;
      } catch (e) {
        console.error("Failed to distribute revenue:", e);
        setError("Failed to distribute revenue");
        return { err: { ValidationError: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Get distribution details for a revenue
   * @param revenueId - The ID of the revenue
   * @returns Promise with the distribution transactions
   */
  const getDistributionDetails = useCallback(
    async (revenueId: string): Promise<Result<DistributionTx[], RevenueError>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.getDistributionDetails(revenueId);
        // For this function, we just return the result directly
        // The types should match after adjusting the Account type
        return result as unknown as Result<DistributionTx[], RevenueError>;
      } catch (e) {
        console.error("Failed to get distribution details:", e);
        setError("Failed to get distribution details");
        return { err: { NotFound: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );

  /**
   * Set admin principal (admin only)
   * @param newAdmin - The new admin principal
   * @returns Promise with the result
   */
  const setAdminPrincipal = useCallback(
    async (newAdmin: Principal): Promise<Result<null, RevenueError>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await actor.setAdminPrincipal(newAdmin);
        return result;
      } catch (e) {
        console.error("Failed to set admin principal:", e);
        setError("Failed to set admin principal");
        return { err: { Unauthorized: null } };
      } finally {
        setLoading(false);
      }
    },
    [actor]
  );



  return {
    loading,
    error,
    reportRevenue,
    getRevenue,
    getMSMERevenues,
    distributeRevenue,
    getDistributionDetails,
    setAdminPrincipal,
  };
}