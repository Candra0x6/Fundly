"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Users, DollarSign, Calendar, BarChart3, ArrowRight } from "lucide-react"
import { ICRC7TokenMetadata } from "@declarations/nft_canister/nft_canister.did"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"
interface NFTManagementCardProps {
  nft: ICRC7TokenMetadata
}

export default function NFTManagementCard({ nft }: NFTManagementCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden h-full">
        <div className="aspect-video bg-zinc-100 relative">
          <SingleAssetPreview assetId={nft.image.assetId} />
          <Badge
            className={`absolute top-3 right-3 ${nft.image.status && 'Approved' in nft.image.status
                ? "bg-emerald-100 text-emerald-700"
                : nft.image.status && 'Rejected' in nft.image.status
                  ? "bg-red-100 text-red-700"
                  : "bg-zinc-100 text-zinc-700"
              }`}
          >
            {nft.image.status && 'Approved' in nft.image.status ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : (
              <Calendar className="h-3 w-3 mr-1" />
            )}
            {nft.image.status && 'Approved' in nft.image.status ? (
              "Approved"
            ) : (
              "Rejected"
            )}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3">{nft.name}</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Investors
              </p>
              <p className="font-medium">10</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Total Raised
              </p>
              <p className="font-medium text-emerald-600">10</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Return Rate
              </p>
              <p className="font-medium">10</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Distribution
              </p>
              <p className="font-medium">{nft.revenueShare}</p>
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
