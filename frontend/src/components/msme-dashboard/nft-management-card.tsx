

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Users, DollarSign, Calendar, BarChart3, ArrowRight } from "lucide-react"
import { NFT } from "@declarations/nft_canister/nft_canister.did"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"
import { Principal } from "@dfinity/principal"
interface NFTManagementCardProps {
  nft: NFT
}

export default function NFTManagementCard({ nft }: NFTManagementCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden h-full">
        <div className="aspect-video bg-zinc-100 relative">
          <SingleAssetPreview assetId={nft.metadata.image.assetId} />

        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold">{nft.metadata.name}</h3>
          <p className="mb-3">{nft.metadata.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Price
              </p>
              <p className="font-medium">{Number(nft.metadata.price)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Royality
              </p>
              <p className="font-medium text-emerald-600">{Number(nft.metadata.royalties) / 100}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Return Rate
              </p>
              <p className="font-medium">{Number(nft.metadata.revenueShare) / 100}%</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Distribution
              </p>
              <p className="font-medium">{Principal.from(nft.owner.owner).toString()}</p>
            </div>
          </div>

          <Button variant="outline" className="w-full text-sm">
            Manage NFT
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
