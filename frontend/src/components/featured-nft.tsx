

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface FeaturedNFTProps {
  title: string
  company: string
  price: string
  returnRate: string
  timeframe: string
  raised: string
  image: string
}

export default function FeaturedNFT({ title, company, price, returnRate, timeframe, raised, image }: FeaturedNFTProps) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="h-40 bg-zinc-100 overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-zinc-500 mb-4">{company}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Price</p>
            <p className="font-medium">{price}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Expected Return</p>
            <p className="font-medium text-emerald-600">{returnRate}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Distribution</p>
            <p className="font-medium">{timeframe}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Funding Raised</p>
            <p className="font-medium">{raised}</p>
          </div>
        </div>

        <div className="w-full bg-zinc-100 h-2 rounded-full mb-4">
          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: raised }}></div>
        </div>

        <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-sm">View Opportunity</Button>
      </div>
    </motion.div>
  )
}
