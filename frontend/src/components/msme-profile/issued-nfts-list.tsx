"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, DollarSign, Users, Percent, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface NFT {
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
  creationDate: string
}

interface IssuedNFTsListProps {
  nfts: NFT[]
  isEditing: boolean
}

export default function IssuedNFTsList({ nfts, isEditing }: IssuedNFTsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)

  const filteredNFTs = nfts.filter((nft) => nft.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Issued NFTs</h2>
          <p className="text-zinc-500">Revenue share NFTs issued by this MSME</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Search NFTs..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          {isEditing && (
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Create New NFT
            </Button>
          )}
        </div>
      </div>

      {filteredNFTs.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-zinc-500">No NFTs found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNFTs.map((nft) => (
            <Card key={nft.id} className="overflow-hidden">
              <div className="relative h-40">
                <Image src={nft.image || "/placeholder.svg"} alt={nft.title} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-2">{nft.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant="outline"
                    className={
                      nft.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {nft.status === "active" ? "Active" : "Pending"}
                  </Badge>
                  <span className="text-sm text-zinc-500">{nft.price}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Percent className="h-3 w-3" />
                      <span>Return Rate</span>
                    </div>
                    <span className="font-medium">{nft.returnRate}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span>Timeframe</span>
                    </div>
                    <span className="font-medium">{nft.timeframe}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Users className="h-3 w-3" />
                      <span>Investors</span>
                    </div>
                    <span className="font-medium">{nft.investors}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <DollarSign className="h-3 w-3" />
                      <span>Total Raised</span>
                    </div>
                    <span className="font-medium">{nft.totalRaised}</span>
                  </div>
                </div>

                <div className="w-full bg-zinc-100 h-2 rounded-full mb-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: nft.raised }}></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Funding Progress</span>
                  <span className="font-medium">{nft.raised}</span>
                </div>

                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" onClick={() => setSelectedNFT(nft)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{selectedNFT?.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="relative h-48 w-full">
                          {selectedNFT && (
                            <Image
                              src={selectedNFT.image || "/placeholder.svg"}
                              alt={selectedNFT.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-zinc-500">Price</p>
                            <p className="font-medium">{selectedNFT?.price}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Return Rate</p>
                            <p className="font-medium">{selectedNFT?.returnRate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Timeframe</p>
                            <p className="font-medium">{selectedNFT?.timeframe}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Status</p>
                            <Badge
                              variant="outline"
                              className={
                                selectedNFT?.status === "active"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }
                            >
                              {selectedNFT?.status === "active" ? "Active" : "Pending"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Investors</p>
                            <p className="font-medium">{selectedNFT?.investors}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Total Raised</p>
                            <p className="font-medium">{selectedNFT?.totalRaised}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Creation Date</p>
                            <p className="font-medium">
                              {selectedNFT && new Date(selectedNFT.creationDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Funding Progress</p>
                            <p className="font-medium">{selectedNFT?.raised}</p>
                          </div>
                        </div>

                        <div className="w-full bg-zinc-100 h-2 rounded-full">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: selectedNFT?.raised }}></div>
                        </div>

                        {isEditing && (
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline">Edit NFT</Button>
                            <Button variant="destructive">Deactivate</Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isEditing && filteredNFTs.length > 0 && (
        <div className="text-center mt-6">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Load More NFTs
          </Button>
        </div>
      )}
    </div>
  )
}
