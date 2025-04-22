"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react"

interface MSMENFTsProps {
  msmeId: string
}

export default function MSMENFTs({ msmeId }: MSMENFTsProps) {
  // This would normally be fetched from an API based on the ID
  const nfts = {
    active: [
      {
        id: "1",
        title: "GreenTech Q3 Revenue Share",
        price: "5,000 FND",
        returnRate: "12-15%",
        timeframe: "Quarterly",
        raised: "75%",
        image: "/placeholder.svg?height=200&width=300",
        description:
          "This NFT represents a share of GreenTech Solutions' Q3 2023 revenue from our solar panel installations in Singapore. Holders will receive quarterly distributions based on our revenue performance.",
        benefits: [
          "Quarterly revenue distributions",
          "Priority access to new product launches",
          "Voting rights on future product development",
        ],
        unlockables: [
          "Exclusive webinar with our CTO",
          "Digital certificate of investment",
          "Access to investor-only community",
        ],
      },
      {
        id: "2",
        title: "Malaysia Expansion Revenue Share",
        price: "7,500 FND",
        returnRate: "15-18%",
        timeframe: "Bi-annual",
        raised: "40%",
        image: "/placeholder.svg?height=200&width=300",
        description:
          "This NFT represents a share of GreenTech Solutions' revenue from our expansion into the Malaysian market. Holders will receive bi-annual distributions based on our revenue performance in Malaysia.",
        benefits: [
          "Bi-annual revenue distributions",
          "Higher return potential from new market",
          "Extended distribution period (3 years)",
        ],
        unlockables: [
          "Virtual tour of our Malaysian operations",
          "Exclusive market research reports",
          "Invitation to launch event in Kuala Lumpur",
        ],
      },
      {
        id: "3",
        title: "Solar Panel X2 Production Revenue",
        price: "3,200 FND",
        returnRate: "10-12%",
        timeframe: "Monthly",
        raised: "90%",
        image: "/placeholder.svg?height=200&width=300",
        description:
          "This NFT represents a share of GreenTech Solutions' revenue from our premium Solar Panel X2 product line. Holders will receive monthly distributions based on sales performance.",
        benefits: ["Monthly revenue distributions", "More frequent payouts", "Direct tie to our flagship product"],
        unlockables: [
          "Product sample (miniature)",
          "Behind-the-scenes manufacturing video",
          "Discount on personal purchase",
        ],
      },
    ],
    past: [
      {
        id: "4",
        title: "GreenTech Q2 Revenue Share",
        price: "5,000 FND",
        returnRate: "12-14%",
        timeframe: "Quarterly",
        raised: "100%",
        image: "/placeholder.svg?height=200&width=300",
        description:
          "This NFT represented a share of GreenTech Solutions' Q2 2023 revenue from our solar panel installations in Singapore. Holders received quarterly distributions based on our revenue performance.",
        actualReturn: "13.5%",
        status: "completed",
      },
      {
        id: "5",
        title: "Product Development Fund",
        price: "10,000 FND",
        returnRate: "18-20%",
        timeframe: "Annual",
        raised: "100%",
        image: "/placeholder.svg?height=200&width=300",
        description:
          "This NFT represented a share of GreenTech Solutions' revenue from our new product development initiatives. Holders received annual distributions based on the performance of our new products.",
        actualReturn: "19.2%",
        status: "completed",
      },
    ],
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active NFTs</TabsTrigger>
          <TabsTrigger value="past">Past NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-6">
            {nfts.active.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-zinc-100">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{nft.title}</h3>
                        <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                      </div>
                      <p className="text-zinc-600 mb-4">{nft.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

                      <div className="w-full bg-zinc-100 h-2 rounded-full mb-6">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: nft.raised }}></div>
                      </div>

                      <div className="md:flex gap-8 mb-4">
                        <div className="mb-4 md:mb-0 md:w-1/2">
                          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            Benefits
                          </h4>
                          <ul className="space-y-1">
                            {nft.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-zinc-600 flex items-start gap-2">
                                <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-emerald-600 text-xs">✓</span>
                                </div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <Gift className="h-4 w-4 text-emerald-500" />
                            Unlockables
                          </h4>
                          <ul className="space-y-1">
                            {nft.unlockables.map((unlockable, idx) => (
                              <li key={idx} className="text-sm text-zinc-600 flex items-start gap-2">
                                <div className="h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-emerald-600 text-xs">✓</span>
                                </div>
                                {unlockable}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1">
                          <ArrowUpRight className="h-4 w-4" />
                          Invest Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nfts.past.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <div className="aspect-video bg-zinc-100">
                    <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{nft.title}</h3>
                      <Badge className="bg-zinc-100 text-zinc-700">Completed</Badge>
                    </div>
                    <p className="text-zinc-600 text-sm mb-4">{nft.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Price</p>
                        <p className="font-medium">{nft.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Expected Return</p>
                        <p className="font-medium">{nft.returnRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Actual Return</p>
                        <p className="font-medium text-emerald-600">{nft.actualReturn}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">Distribution</p>
                        <p className="font-medium">{nft.timeframe}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-2 text-sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
