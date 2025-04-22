"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Building, MapPin } from "lucide-react"

interface NFTProps {
  id: string
  title: string
  company: string
  price: string
  returnRate: string
  timeframe: string
  raised: string
  image: string
  industry: string
  location: string
  verified: boolean
}

export default function NFTCard({ nft }: { nft: NFTProps }) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative h-40 bg-zinc-100 overflow-hidden">
        <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
          <Building className="h-3 w-3 text-emerald-600" />
          {nft.industry}
        </div>
        {nft.verified && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Verified
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-zinc-900 line-clamp-1">{nft.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
          <span>{nft.company}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{nft.location}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Price</p>
            <p className="font-medium">{nft.price}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Expected Return</p>
            <p className="font-medium text-emerald-600">{nft.returnRate}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Distribution</p>
            <p className="font-medium">{nft.timeframe}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Funding Raised</p>
            <p className="font-medium">{nft.raised}</p>
          </div>
        </div>

        <div className="w-full bg-zinc-100 h-2 rounded-full mb-4">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: nft.raised }}></div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-xs">
            View Details
          </Button>
          <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-xs">Invest Now</Button>
        </div>
      </div>
    </motion.div>
  )
}
