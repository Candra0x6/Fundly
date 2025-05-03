"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Wallet,
  TrendingUp,
  Plus,
  ArrowRight,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Download,
  Share2,
} from "lucide-react"
import OwnedNFTCard from "@/components/dashboard/owned-nft-card"
import PortfolioDistribution from "@/components/portfolio/portfolio-distribution"
import PortfolioPerformance from "@/components/portfolio/portfolio-performance"
import EarningsHistory from "@/components/portfolio/earnings-history"
import NFTTransferModal from "@/components/portfolio/nft-transfer-modal"
import buildFullPortfolioData, { PortfolioInvestmentData } from "@/utility/datas/portfolioData"
import { Principal } from "@dfinity/principal"
import { useAuth } from "@/utility/use-auth-client"
import { useNftActor } from "@/utility/actors/nftActor"
import { useRevenueActor } from "@/utility/actors/revanueActor"
import { getSession } from "@/utility/session"
export default function InvestorPortfolioPage() {
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioInvestmentData>()
  const nftActor = useNftActor()
  const revenueActor = useRevenueActor()
  const { principal } = useAuth()
  // Handle NFT transfer

  useEffect(() => {
    const fetchData = async () => {
      const nfts = await nftActor.getNFTsByOwnerWithMSMEData(principal as Principal)
      const revenues = await revenueActor.getTransactionsWithRevenueByOwner(principal as Principal)

      const portfolioData = buildFullPortfolioData(principal as Principal, nfts, revenues)
      setPortfolio(portfolioData)
    }


    fetchData()

  }, [])
  return (
    <div className="min-h-screen bg-white">

      <main className="container mx-auto px-4 py-8">
        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Investment Portfolio</h1>
              <p className="text-zinc-500">Track and manage your NFT investments and earnings</p>
            </div>

          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-zinc-500">Portfolio Value</p>
                  <Wallet className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{portfolio?.portfolio.totalValue}</p>
                  <span className="text-xs text-emerald-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {portfolio?.portfolio.totalGrowth}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Total invested: {portfolio?.portfolio.totalInvested}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-zinc-500">Total Earnings</p>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold">{portfolio?.portfolio.totalEarnings}</p>
                <p className="text-xs text-zinc-500 mt-1">Lifetime earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-zinc-500">Active Investments</p>
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold">{portfolio?.portfolio.activeInvestments}</p>
                <p className="text-xs text-zinc-500 mt-1">Across 5 industries</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-zinc-500">Next Payout</p>
                  <Calendar className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold">Oct 15</p>
                <p className="text-xs text-zinc-500 mt-1">$750 estimated</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Portfolio Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="gap-6">

            {/* Portfolio Performance */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="value">
                  <TabsList className="mb-4">
                    <TabsTrigger value="value">Value</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="growth">Growth</TabsTrigger>
                  </TabsList>

                  <TabsContent value="value">
                    <PortfolioPerformance type="value" />
                  </TabsContent>

                  <TabsContent value="earnings">
                    <PortfolioPerformance type="earnings" />
                  </TabsContent>

                  <TabsContent value="growth">
                    <PortfolioPerformance type="growth" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* NFT Investments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your NFT Investments</h2>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Add NFT
              </Button>
            </div>
          </div>

          <Tabs defaultValue="earnings">
            <div className="flex items-center justify-between mb-6">
              <TabsList>

                <TabsTrigger value="earnings">Earnings History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="earnings">
              <EarningsHistory transactions={portfolio?.history || []} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* NFT Transfer Modal */}
      {showTransferModal && (
        <NFTTransferModal nftId={selectedNFT} onClose={() => setShowTransferModal(false)} nfts={portfolio?.ownedNFTs || []} />
      )}

    </div>
  )
}
