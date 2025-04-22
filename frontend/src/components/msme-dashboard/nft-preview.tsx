"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, TrendingUp, Clock } from "lucide-react"

interface NFTPreviewProps {
  nft: {
    title: string
    description: string
    price: string
    returnRate: number[]
    timeframe: string
    duration: string
    image: string
  }
}

export default function NFTPreview({ nft }: NFTPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
    >
      <div className="aspect-video bg-zinc-100 relative">
        <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
        <Badge className="absolute top-3 right-3 bg-emerald-100 text-emerald-700">Preview</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-1">{nft.title || "NFT Title"}</h3>
        <p className="text-sm text-zinc-500 mb-3 line-clamp-2">
          {nft.description || "NFT description will appear here. Add details about what this NFT represents."}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Price
            </p>
            <p className="font-medium">{nft.price ? `$${nft.price}` : "$0.00"}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Return Rate
            </p>
            <p className="font-medium text-emerald-600">{nft.returnRate[0]}%</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Distribution
            </p>
            <p className="font-medium">
              {nft.timeframe === "monthly"
                ? "Monthly"
                : nft.timeframe === "quarterly"
                  ? "Quarterly"
                  : nft.timeframe === "biannual"
                    ? "Bi-annual"
                    : nft.timeframe === "annual"
                      ? "Annual"
                      : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Duration
            </p>
            <p className="font-medium">
              {nft.duration} {Number.parseInt(nft.duration) === 1 ? "Year" : "Years"}
            </p>
          </div>
        </div>

        <div className="w-full bg-zinc-100 h-2 rounded-full mb-2">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "0%" }}></div>
        </div>
        <p className="text-xs text-zinc-500 text-center">0% Funded</p>
      </div>
    </motion.div>
  )
}
