

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MarketplaceHighlightProps {
  nft: {
    id: string
    title: string
    company: string
    image: string
    price: string
    returnRate: string
    timeframe: string
    raised: string
  }
}

export default function MarketplaceHighlight({ nft }: MarketplaceHighlightProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden h-full">
        <div className="aspect-video bg-zinc-100 relative">
          <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
        </div>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-1">{nft.title}</h3>
          <p className="text-sm text-zinc-500 mb-4">{nft.company}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
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

          <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-sm">Invest Now</Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
