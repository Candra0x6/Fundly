"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react"
import { useNftActor } from "@/utility/actors/nftActor"
import { useState, useEffect } from "react"
import { ICRC7TokenMetadata, NFT } from "@declarations/nft_canister/nft_canister.did"
import { useStorageActor } from "@/utility/actors/storageActor"
import { toast } from "react-hot-toast"
import { useAssetPreview } from "@/hooks/useAssetPreview"
import { useBuyNFT } from "@/hooks/useBuyNFT"
import { MSME } from "@declarations/msme_registration/msme_registration.did"

interface MSMENFTsProps {
  msme: MSME
}

export default function MSMENFTs({ msme }: MSMENFTsProps) {
  const nftActor = useNftActor()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    const fetchNfts = async () => {
      const result = await nftActor.getNFTsByMSME(msme.id)
      if ('ok' in result) {
        setNfts(result.ok)
        console.log(result.ok)
      }
    }
    fetchNfts()
  }, [])

  return (
    <div className="space-y-8">
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-6">
            {nfts.map((nft, index) => (
              <NFTCard key={nft.id} nft={nft} index={index} />
            ))}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

interface NFTCardProps {
  nft: NFT;
  index: number;
}

function NFTCard({ nft, index }: NFTCardProps) {
  // Extract assetId from the nft document if it exists
  const assetId = nft.metadata?.image?.assetId || null;

  // Use our custom hook to get the preview URL
  const { previewUrl, isLoading } = useAssetPreview(assetId);

  // Use our buyNFT hook
  const { buyNFT, loading: buyLoading, error: buyError } = useBuyNFT();

  // Default token canister ID - should be configured properly in a real app

  const handleBuyNFT = async () => {
    // Convert string to bigint for the tokenId if needed
    const tokenId = BigInt(nft.id);

    // Call the buyNFT function from our hook
    const result = await buyNFT(tokenId);

    if (result) {
      // Handle successful purchase, e.g., refresh NFT list
      console.log("Purchase successful", result);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <div className="md:flex">
          <div className="md:w-1/3 bg-zinc-100">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt={nft.metadata?.name || "NFT"}
              className="w-full h-full object-cover rounded-l-2xl"
              style={{ opacity: isLoading ? 0.6 : 1 }}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="md:w-2/3 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{nft.metadata?.name || "NFT"}</h3>
              <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
            </div>
            <p className="text-zinc-600 mb-4">{nft.metadata?.description || "NFT Description"}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-zinc-500 mb-1">Price</p>
                <p className="font-medium">{Number(nft.metadata?.price)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Expected Return</p>
                <p className="font-medium text-emerald-600">{Number(nft.metadata?.revenueShare) / 100}%</p>
              </div>

            </div>


            <div className="flex gap-3">

              <Button
                onClick={handleBuyNFT}
                className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1"
                disabled={buyLoading}
              >
                {buyLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4" />
                    Invest Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
