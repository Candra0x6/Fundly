"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Users, DollarSign, Calendar, BarChart3, ArrowRight } from "lucide-react"

interface NFTManagementCardProps {
  nft: {
    id: string
    title: string
    image: string
    price: string
    returnRate: string
    timeframe: string
    raised: string
    status: string
    investors: number
    totalRaised: string
  }
}

export default function NFTManagementCard({ nft }: NFTManagementCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden h-full">
        <div className="aspect-video bg-zinc-100 relative">
          <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
          <Badge
            className={`absolute top-3 right-3 ${
              nft.status === "active"
                ? "bg-emerald-100 text-emerald-700"
                : nft.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-zinc-100 text-zinc-700"
            }`}
          >
            {nft.status === "active" ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : (
              <Calendar className="h-3 w-3 mr-1" />
            )}
            {nft.status.charAt(0).toUpperCase() + nft.status.slice(1)}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3">{nft.title}</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Investors
              </p>
              <p className="font-medium">{nft.investors}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Total Raised
              </p>
              <p className="font-medium text-emerald-600">{nft.totalRaised}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <BarChart3 className="h-3 w-3" />
                Return Rate
              </p>
              <p className="font-medium">{nft.returnRate}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Distribution
              </p>
              <p className="font-medium">{nft.timeframe.charAt(0).toUpperCase() + nft.timeframe.slice(1)}</p>
            </div>
          </div>

          <div className="w-full bg-zinc-100 h-2 rounded-full mb-4">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: nft.raised }}></div>
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
