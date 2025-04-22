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
  Filter,
  Calendar,
  DollarSign,
  Zap,
  Settings,
  User,
} from "lucide-react"
import ActivityFeed from "@/components/dashboard/activity-feed"
import NotificationPanel from "@/components/dashboard/notification-panel"
import OwnedNFTCard from "@/components/dashboard/owned-nft-card"
import MarketplaceHighlight from "@/components/dashboard/marketplace-highlight"

export default function InvestorDashboardPage() {
  const [showNotifications, setShowNotifications] = useState(false)

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "James Chen",
    role: "investor",
    avatar: "/placeholder.svg?height=40&width=40",
    joinDate: "January 2023",
  }

  // Mock statistics based on user role
  const statistics = {
    totalInvested: "$42,500",
    totalEarnings: "$5,320",
    activeInvestments: "8",
    portfolioGrowth: "+12.4%",
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
    },
  ]

  // Mock marketplace highlights
  const marketplaceHighlights = [
    {
      id: "1",
      title: "Healthcare App Development",
      company: "MediTech Solutions",
      image: "/placeholder.svg?height=120&width=200",
      price: "$6,200",
      returnRate: "10-12%",
      timeframe: "Quarterly",
      raised: "55%",
    },
    {
      id: "2",
      title: "Sustainable Fashion Line",
      company: "EcoWear Designs",
      image: "/placeholder.svg?height=120&width=200",
      price: "$4,800",
      returnRate: "9-11%",
      timeframe: "Bi-annual",
      raised: "65%",
    },
    {
      id: "3",
      title: "Local Food Delivery Network",
      company: "FoodConnect",
      image: "/placeholder.svg?height=120&width=200",
      price: "$3,200",
      returnRate: "11-14%",
      timeframe: "Quarterly",
      raised: "80%",
    },
  ]

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: "1",
      title: "Quarterly Earnings Distribution",
      date: "October 15, 2023",
      type: "payout",
    },
    {
      id: "2",
      title: "Investor Webinar: Market Trends",
      date: "October 20, 2023",
      type: "webinar",
    },
    {
      id: "3",
      title: "New NFT Launch: TechFin Solutions",
      date: "October 25, 2023",
      type: "launch",
    },
  ]

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
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Funds
                  </Button>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Explore NFTs
                  </Button>
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
                  <p className="text-2xl font-bold">{statistics.totalInvested}</p>
                  <div className="flex items-center mt-1 text-xs text-emerald-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {statistics.portfolioGrowth} from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-zinc-500">Total Earnings</p>
                    <Wallet className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold">{statistics.totalEarnings}</p>
                  <p className="text-xs text-zinc-500 mt-1">Lifetime earnings</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-zinc-500">Active Investments</p>
                    <BarChart3 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold">{statistics.activeInvestments}</p>
                  <p className="text-xs text-zinc-500 mt-1">Across 5 MSMEs</p>
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
                  <TabsTrigger value="marketplace">Marketplace Highlights</TabsTrigger>
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
                    {ownedNFTs.map((nft) => (
                      <OwnedNFTCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="marketplace">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Trending Opportunities</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                      <Button className="bg-emerald-500 hover:bg-emerald-600 text-sm">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {marketplaceHighlights.map((nft) => (
                      <MarketplaceHighlight key={nft.id} nft={nft} />
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

                  <ActivityFeed />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-6">
            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Upcoming Events</span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${event.type === "payout"
                            ? "bg-emerald-100 text-emerald-600"
                            : event.type === "webinar"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-purple-100 text-purple-600"
                            }`}
                        >
                          {event.type === "payout" ? (
                            <DollarSign className="h-5 w-5" />
                          ) : event.type === "webinar" ? (
                            <User className="h-5 w-5" />
                          ) : (
                            <Zap className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center text-xs text-zinc-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start bg-emerald-500 hover:bg-emerald-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Invest in New NFT
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Wallet className="h-4 w-4 mr-2" />
                      Withdraw Earnings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Portfolio Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications Panel (conditionally rendered) */}
            {showNotifications && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              </motion.div>
            )}
          </div>
        </div>
      </main>

    </div>
  )
}
