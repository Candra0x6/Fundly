"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  ExternalLink,
  X,
  Mail,
  Phone,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NFT, ICRC7TokenMetadata } from "@declarations/nft_canister/nft_canister.did"
import { MSME } from "@declarations/msme_registration/msme_registration.did"
import { SingleAssetPreview } from "./examples/AssetPreviewExample"
import { useNavigate } from "react-router-dom"
type DetailsData = {
  nft: NFT
  msmeData: MSME[]
}

type NFTCardProps = {
  detailsData: DetailsData
}

export default function NFTCard({ detailsData }: NFTCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { nft, msmeData } = detailsData
  const navigate = useNavigate()


  return (
    <>
      <motion.div
        className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="relative h-40 bg-zinc-100 overflow-hidden">
          <SingleAssetPreview
            assetId={nft.metadata.image.assetId}
            className="object-cover h-full"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <Building className="h-3 w-3 text-emerald-600" />
            {msmeData[0]?.details.name}
          </div>

        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-zinc-900 line-clamp-1">{nft.metadata.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-zinc-500 mb-3">
            <span>{msmeData[0]?.details.name}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{msmeData[0]?.contactInfo.city}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Price</p>
              <p className="font-medium">{Number(nft.metadata.price)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Expected Return</p>
              <p className="font-medium text-emerald-600">{Number(nft.metadata.revenueShare) / 100}%</p>
            </div>


          </div>

          <div className="flex w-full">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger className="w-full">
                <Button variant="outline" className="w-full text-xs">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-semibold">{nft.metadata.name}</DialogTitle>

                  </div>
                  <DialogDescription className="flex items-center gap-1 text-sm">
                    <span>{msmeData[0]?.details.name}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{msmeData[0]?.contactInfo.city}</span>
                    </div>
                    {Object.keys(msmeData[0]?.verificationStatus)[0] === "Verified" ? (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Verified</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Clock className="h-3 w-3" />
                          <span>Unverified</span>
                        </div>
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <Tabs defaultValue="nft" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="nft">NFT Details</TabsTrigger>
                      <TabsTrigger value="msme">MSME Details</TabsTrigger>
                    </TabsList>

                    {/* NFT Details Tab */}
                    <TabsContent value="nft" className="mt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <div className="rounded-xl overflow-hidden border border-zinc-100">
                            <SingleAssetPreview
                              assetId={nft.metadata.image.assetId}
                              className="w-full aspect-square object-cover"
                            />
                          </div>

                          <div className="mt-4 space-y-3">


                            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 mt-2">Invest Now</Button>
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Description</h3>
                            <p className="text-zinc-600">{nft.metadata.description}</p>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-zinc-500 mb-1">Price</h4>
                              <p className="font-medium">{Number(nft.metadata.price)}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-zinc-500 mb-1">Expected Return</h4>
                              <p className="font-medium text-emerald-600">{Number(nft.metadata.revenueShare) / 100}%</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-zinc-500 mb-1">Distribution</h4>
                              <p className="font-medium">{nft.metadata.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-zinc-500 mb-1">Focus Area</h4>
                              <p className="font-medium">{msmeData[0]?.details.focusArea}</p>
                            </div>

                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-3">Minted At</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm">
                                <span className="font-medium">Minted At:</span> {new Date(Number(nft.minted_at) / 1000000).toLocaleString()}
                              </span>
                            </div>

                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* MSME Details Tab */}
                    <TabsContent value="msme" className="mt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                          <div className="flex flex-col items-center p-4 border border-zinc-100 rounded-xl">
                            <SingleAssetPreview
                              assetId={msmeData[0]?.details.logo.assetId}
                              className="w-full aspect-square object-cover"
                            />
                            <h3 className="mt-3 text-lg font-semibold text-center">{msmeData[0]?.details.name}</h3>
                            <p className="text-sm text-zinc-500 text-center">{msmeData[0]?.details.focusArea}</p>

                            <div className="mt-4 w-full">
                              {Object.keys(msmeData[0]?.verificationStatus)[0] === "Verified" ? (
                                <div className="flex items-center justify-center gap-1 text-emerald-600 bg-emerald-50 py-1 px-3 rounded-full text-sm">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span>Verified Business</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 text-amber-600 bg-amber-50 py-1 px-3 rounded-full text-sm">
                                  <Clock className="h-4 w-4" />
                                  <span>Verification Pending</span>
                                </div>
                              )}
                            </div>


                          </div>

                          <div className="mt-4 border border-zinc-100 rounded-xl p-4">
                            <h3 className="font-medium mb-3">Contact Information</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-zinc-400" />
                                <span>{msmeData[0]?.contactInfo.website}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                <span>{msmeData[0]?.contactInfo.city}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-zinc-400" />
                                <span>{msmeData[0]?.contactInfo.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-zinc-400" />
                                <span>{msmeData[0]?.contactInfo.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">About {msmeData[0]?.details.name}</h3>
                            <p className="text-zinc-600">{msmeData[0]?.details.description}</p>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-3">Company Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Founded</h4>
                                <p className="font-medium">{new Date(Number(msmeData[0]?.details.foundingDate) / 1000000).toLocaleString()}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Registration Date</h4>
                                <p className="font-medium">{new Date(Number(msmeData[0]?.registrationDate) / 1000000).toLocaleString()}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Focus Area</h4>
                                <p className="font-medium">{msmeData[0]?.details.focusArea}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Location</h4>
                                <p className="font-medium">{msmeData[0]?.contactInfo.city}</p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-3">Founders</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {msmeData[0]?.teamMembers.map((founder, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                                  <SingleAssetPreview
                                    assetId={founder.image.assetId}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{founder.name}</p>
                                    <p className="text-sm text-zinc-500">{founder.position}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-3">Financial Overview</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Annual Revenue</h4>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-emerald-600" />
                                  <span className="font-medium">{Number(msmeData[0]?.financialInfo.annualRevenue) / 1000}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Funding Goal</h4>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                                  <span className="font-medium">{Number(msmeData[0]?.financialInfo.fundingGoal)}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Funding Purpose</h4>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{msmeData[0]?.financialInfo.fundingPurpose}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-zinc-500 mb-1">Employee Count</h4>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{Number(msmeData[0]?.financialInfo.employeeCount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="text-lg font-medium mb-3">Verification Information</h3>
                            <div className="p-4 rounded-lg border border-zinc-100">
                              <div className="flex items-center gap-2 mb-2">
                                {Object.keys(msmeData[0]?.verificationStatus)[0] === "Verified" ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                ) : (
                                  <Clock className="h-5 w-5 text-amber-600" />
                                )}
                                <span className="font-medium">Status: {Object.keys(msmeData[0]?.verificationStatus)[0]}</span>
                              </div>
                              {Object.keys(msmeData[0]?.verificationStatus)[0] === "Verified" && (
                                <div className="text-sm text-zinc-600">
                                  <p>
                                    This business has been verified by our team.
                                    Verification includes document checks, business registration validation, and
                                    financial statement review.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    </TabsContent>

                  </Tabs>
                  <Button variant="outline" className="w-full mt-2" onClick={() => navigate(`/msme/${msmeData[0]?.id}`)}  >Msme Profile <ExternalLink className="w-4 h-4" /></Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>
    </>
  )
}
