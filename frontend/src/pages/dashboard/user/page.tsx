"use client"

import { useEffect, useState } from "react"
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
  Filter,
  Calendar,
  DollarSign,
  Zap,
  Settings,
  User,
} from "lucide-react"
import ActivityFeed from "@/components/dashboard/activity-feed"
import OwnedNFTCard from "@/components/dashboard/owned-nft-card"
import { useNftActor } from "@/utility/actors/nftActor"
import { useAuth } from "@/utility/use-auth-client"
import { Principal } from "@dfinity/principal"
import { getSession } from "@/utility/session"

import { useRevenueActor } from "@/utility/actors/revanueActor"
import buildFullPortfolioData, { PortfolioInvestmentData } from "@/utility/datas/portfolioData"
export default function InvestorDashboardPage() {
  const { principal } = useAuth()
  const nftActor = useNftActor()
  const revenueActor = useRevenueActor()
  const user = getSession("user")
  const [portfolio, setPortfolio] = useState<PortfolioInvestmentData>()


  // Mock upcoming

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
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Welc  ome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">Welcome back, {user.name}</h1>
                  <p className="text-zinc-500">
                    Here's what's happening with your investments today, {new Date().toLocaleDateString()}
                  </p>
                </div>

              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-zinc-500">Total Invested</p>
                    <DollarSign className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold">{portfolio?.statistics.totalInvested}</p>
                  <div className="flex items-center mt-1 text-xs text-emerald-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {portfolio?.statistics.portfolioGrowth} from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-zinc-500">Total Earnings</p>
                    <Wallet className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold">{portfolio?.statistics.totalEarnings}</p>
                  <p className="text-xs text-zinc-500 mt-1">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-zinc-500">Active Investments</p>
                    <BarChart3 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold">{portfolio?.statistics.activeInvestments}</p>
                  <p className="text-xs text-zinc-500 mt-1">Across {portfolio?.statistics.activeInvestments} MSMEs</p>
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
            </motion.div>

            {/* Tabs for different sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Tabs defaultValue="owned">
                <TabsList className="mb-6">
                  <TabsTrigger value="owned">My NFTs</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="owned">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your NFT Investments</h2>
                    <Button variant="outline" className="text-sm flex items-center gap-1">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {portfolio?.ownedNFTs.map((nft) => (
                      <OwnedNFTCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                </TabsContent>


                <TabsContent value="activity">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <Button variant="outline" className="text-sm">
                      View All
                    </Button>
                  </div>

                  <ActivityFeed transactions={portfolio?.history || []} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>


        </div>
      </main>

    </div>
  )
}
