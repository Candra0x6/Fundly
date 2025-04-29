import { useState } from 'react';
import { useNftActor } from '@/utility/actors/nftActor';
import { Principal } from '@dfinity/principal';
import { toast } from 'react-hot-toast';
import { useTokenActor } from '@/utility/actors/tokenActor';
import { useAuth } from '@/utility/use-auth-client';

export const useBuyNFT = () => {
  const nftActor = useNftActor();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenActor = useTokenActor();
  const { principal } = useAuth()
  /**
   * Hook for buying an NFT
   * @param tokenId - The ID of the NFT to buy
   * @returns Promise with the result
   */
  const buyNFT = async (tokenId: bigint) => {
    setLoading(true);
    setError(null);



    try {
      // Convert string to Principal
      const result = await nftActor.buyNFT(tokenId);
      const token = await tokenActor.getBalance()
      console.log(token)
      if ('err' in result) {
        // Handle error
        setError(result.err);
        toast.error(`Failed to purchase NFT: ${result.err}`);
        console.log(result)
        return null;
      } else {
        // Purchase successful
        toast.success('NFT purchased successfully!');
        return result.ok;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error buying NFT: ${errorMessage}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buyNFT, loading, error };
};
