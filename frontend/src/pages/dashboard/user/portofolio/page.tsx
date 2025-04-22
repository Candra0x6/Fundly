"use client"

import { useState } from "react"
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

export default function InvestorPortfolioPage() {
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "James Chen",
    role: "investor",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "January 2023",
  }

  // Mock portfolio data
  const portfolio = {
    totalValue: "$42,500",
    totalInvested: "$40,000",
    totalGrowth: "+6.25%",
    totalEarnings: "$5,320",
    activeInvestments: 8,
    diversification: {
      industries: [
        { name: "Renewable Energy", percentage: 35 },
        { name: "Agriculture", percentage: 25 },
        { name: "Education", percentage: 20 },
        { name: "Healthcare", percentage: 10 },
        { name: "Fintech", percentage: 10 },
      ],
      countries: [
        { name: "Singapore", percentage: 40 },
        { name: "Malaysia", percentage: 25 },
        { name: "Indonesia", percentage: 20 },
        { name: "Philippines", percentage: 10 },
        { name: "Thailand", percentage: 5 },
      ],
      returnRates: [
        { name: "High (15%+)", percentage: 30 },
        { name: "Medium (10-15%)", percentage: 45 },
        { name: "Low (5-10%)", percentage: 25 },
      ],
    },
  }

  // Mock owned NFTs
  const ownedNFTs = [
    {
      id: "1",
      title: "GreenTech Q3 Revenue Share",
      company: "GreenTech Solutions",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$5,000",
      earnings: "$750",
      nextPayout: "Oct 15, 2023",
      returnRate: "15%",
      industry: "Renewable Energy",
      country: "Singapore",
      purchaseDate: "Jul 15, 2023",
      status: "active",
    },
    {
      id: "2",
      title: "Harvest Season Revenue",
      company: "Organic Harvest Co.",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$3,500",
      earnings: "$280",
      nextPayout: "Nov 30, 2023",
      returnRate: "8%",
      industry: "Agriculture",
      country: "Indonesia",
      purchaseDate: "Aug 5, 2023",
      status: "active",
    },
    {
      id: "3",
      title: "EdTech Platform Expansion",
      company: "EduTech Innovations",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$7,500",
      earnings: "$1,125",
      nextPayout: "Dec 15, 2023",
      returnRate: "15%",
      industry: "Education",
      country: "Philippines",
      purchaseDate: "Jun 22, 2023",
      status: "active",
    },
    {
      id: "4",
      title: "Healthcare App Development",
      company: "MediTech Solutions",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$6,200",
      earnings: "$620",
      nextPayout: "Oct 30, 2023",
      returnRate: "10%",
      industry: "Healthcare",
      country: "Singapore",
      purchaseDate: "Jul 30, 2023",
      status: "active",
    },
    {
      id: "5",
      title: "Sustainable Fashion Line",
      company: "EcoWear Designs",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$4,800",
      earnings: "$480",
      nextPayout: "Nov 15, 2023",
      returnRate: "10%",
      industry: "Fashion",
      country: "Thailand",
      purchaseDate: "Aug 10, 2023",
      status: "active",
    },
    {
      id: "6",
      title: "Local Food Delivery Network",
      company: "FoodConnect",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$3,200",
      earnings: "$384",
      nextPayout: "Oct 20, 2023",
      returnRate: "12%",
      industry: "Food & Beverage",
      country: "Malaysia",
      purchaseDate: "Jul 5, 2023",
      status: "active",
    },
    {
      id: "7",
      title: "Eco-Tourism Expansion",
      company: "NatureTrek Adventures",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$5,500",
      earnings: "$825",
      nextPayout: "Dec 5, 2023",
      returnRate: "15%",
      industry: "Tourism",
      country: "Indonesia",
      purchaseDate: "Jun 15, 2023",
      status: "active",
    },
    {
      id: "8",
      title: "Fintech Payment Solution",
      company: "PayEase",
      image: "/placeholder.svg?height=120&width=200",
      invested: "$4,300",
      earnings: "$645",
      nextPayout: "Nov 10, 2023",
      returnRate: "15%",
      industry: "Fintech",
      country: "Singapore",
      purchaseDate: "Jul 20, 2023",
      status: "active",
    },
  ]

  // Handle NFT transfer
  const handleTransferClick = (nftId: string) => {
    setSelectedNFT(nftId)
    setShowTransferModal(true)
  }

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
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Investment
              </Button>
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
                  <p className="text-2xl font-bold">{portfolio.totalValue}</p>
                  <span className="text-xs text-emerald-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {portfolio.totalGrowth}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Total invested: {portfolio.totalInvested}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-zinc-500">Total Earnings</p>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold">{portfolio.totalEarnings}</p>
                <p className="text-xs text-zinc-500 mt-1">Lifetime earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-zinc-500">Active Investments</p>
                  <BarChart3 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-bold">{portfolio.activeInvestments}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="industry">
                  <TabsList className="mb-4">
                    <TabsTrigger value="industry">By Industry</TabsTrigger>
                    <TabsTrigger value="country">By Country</TabsTrigger>
                    <TabsTrigger value="return">By Return Rate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="industry">
                    <PortfolioDistribution data={portfolio.diversification.industries} />
                  </TabsContent>

                  <TabsContent value="country">
                    <PortfolioDistribution data={portfolio.diversification.countries} />
                  </TabsContent>

                  <TabsContent value="return">
                    <PortfolioDistribution data={portfolio.diversification.returnRates} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

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

          <Tabs defaultValue="grid">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="earnings">Earnings History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ownedNFTs.map((nft) => (
                  <div key={nft.id} className="relative">
                    <OwnedNFTCard nft={nft} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => handleTransferClick(nft.id)}
                    >
                      Transfer
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-zinc-50">
                          <th className="text-left py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            NFT
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Company
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Industry
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Invested
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Earnings
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Return Rate
                          </th>
                          <th className="text-right py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Next Payout
                          </th>
                          <th className="text-center py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {ownedNFTs.map((nft) => (
                          <tr key={nft.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-md bg-zinc-100 overflow-hidden">
                                  <img
                                    src={nft.image || "/placeholder.svg"}
                                    alt={nft.title}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <span className="font-medium">{nft.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-zinc-600">{nft.company}</td>
                            <td className="py-3 px-4 text-zinc-600">{nft.industry}</td>
                            <td className="py-3 px-4 text-right font-medium">{nft.invested}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{nft.earnings}</td>
                            <td className="py-3 px-4 text-right font-medium text-emerald-600">{nft.returnRate}</td>
                            <td className="py-3 px-4 text-right text-zinc-600">{nft.nextPayout}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => handleTransferClick(nft.id)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <EarningsHistory />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* NFT Transfer Modal */}
      {showTransferModal && (
        <NFTTransferModal nftId={selectedNFT} onClose={() => setShowTransferModal(false)} nfts={ownedNFTs} />
      )}

    </div>
  )
}
