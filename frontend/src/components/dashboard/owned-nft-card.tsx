"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Calendar, TrendingUp, ArrowRight } from "lucide-react"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"

interface OwnedNFTCardProps {
  nft: {
    id: string
    title: string
    company: string
    image: string
    invested: string
    earnings: string
    nextPayout: string
    returnRate: string
  }
}

export default function OwnedNFTCard({ nft }: OwnedNFTCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden h-full">
        <div className="aspect-video bg-zinc-100 relative">
          <SingleAssetPreview assetId={nft.image} />
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-1">{nft.title}</h3>
          <p className="text-sm text-zinc-500 mb-4">{nft.company}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Invested
              </p>
              <p className="font-medium">{nft.invested}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Earnings
              </p>
              <p className="font-medium text-emerald-600">{nft.earnings}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Next Payout
              </p>
              <p className="font-medium">{nft.nextPayout}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Return Rate
              </p>
              <p className="font-medium text-emerald-600">{nft.returnRate}</p>
            </div>
          </div>

          <Button variant="outline" className="w-full text-sm">
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
