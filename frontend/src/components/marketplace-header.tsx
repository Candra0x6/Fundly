

import { motion } from "framer-motion"

export default function MarketplaceHeader() {
  return (
    <section className="bg-gradient-to-r from-emerald-500 to-teal-600 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">NFT Marketplace</h1>
          <p className="text-white/90 text-lg mb-6">
            Browse and invest in revenue-sharing NFTs from verified MSMEs across Southeast Asia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-sm font-medium mb-1">Available NFTs</p>
              <p className="text-2xl font-bold">42</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-sm font-medium mb-1">Verified MSMEs</p>
              <p className="text-2xl font-bold">28</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-sm font-medium mb-1">Total Invested</p>
              <p className="text-2xl font-bold">$3.2M</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl">
              <p className="text-sm font-medium mb-1">Avg. Return Rate</p>
              <p className="text-2xl font-bold">12.5%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
