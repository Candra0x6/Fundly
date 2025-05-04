;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Plus,
  FileText,
  ArrowRight,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  Filter,
} from "lucide-react";
import NFTManagementCard from "@/components/msme-dashboard/nft-management-card";
import RevenueReportingForm from "@/components/msme-dashboard/revenue-reporting-form";
import DocumentCard from "@/components/msme-dashboard/document-card";
import RevenueChart from "@/components/msme-dashboard/revenue-chart";
import DistributionChart from "@/components/msme-dashboard/distribution-chart";
import { useMsmeActor } from "@/utility/actors/msmeActor";
import { getSession } from "@/utility/session";
import MSMEInfoPage from "@/components/msme-registration/msme-info";
import { useNftActor } from "@/utility/actors/nftActor";
import { MSME } from "@declarations/msme_registration/msme_registration.did";
import { NFT } from "@declarations/nft_canister/nft_canister.did";
import { useRevenueActor } from "@/utility/actors/revanueActor";
import { formatToDisplayData, RevenueData, QuarterlyRevenueData } from "@/utility/converts/formatRevenue";
import { convertBigNumber } from "@/utility/converts/convertBigNumber";

export default function MSMEDashboardPage() {
  const [showReportingForm, setShowReportingForm] = useState(false);
  const [msme, setMsme] = useState<{ ok: MSME }>()
  const [nftsData, setNftsData] = useState<NFT[] | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)

  const msmeActor = useMsmeActor()
  const msmeId = getSession("msme_id")
  const nftActor = useNftActor()
  const revenueActor = useRevenueActor()

  useEffect(() => {
    const fetchMSME = async () => {
      const msme = await msmeActor.getMSME(msmeId)
      // @ts-ignore
      setMsme(msme)
    }
    const fetchNfts = async () => {
      const nfts = await nftActor.getNFTsByMSME(msmeId)
      // @ts-ignore
      setNftsData(nfts.ok)

      console.log(nfts)
    }

    const fetchRevenue = async () => {
      const revenue = await revenueActor.getMSMERevenues(msmeId)
      // @ts-ignore
      const formattedRevenue = formatToDisplayData(revenue)
      setRevenueData(formattedRevenue)
    }



    fetchMSME()
    fetchNfts()
    fetchRevenue()
  }, [msmeId])



  return (
    <div className="min-h-screen bg-white">
      {
        msmeId && msme?.ok ? (

          <main className="container mx-auto px-4 py-8">

            {/* Dashboard Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    Dashboard
                  </h1>
                  <p className="text-zinc-500">
                    Manage your NFTs, revenue reporting, and business documents
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-500">Total Revenue</p>
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">
                        {convertBigNumber(Number(msme?.ok.financialInfo.annualRevenue)) + " $FND"}
                      </p>

                    </div>
                    <p className="text-xs text-zinc-500 mt-1">MSME Annual Revenue</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-500">Total Distributed</p>
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold">
                      {revenueData?.totalDistributed}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">To NFT holders</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-500">Active NFTs</p>
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold">{nftsData?.length || 0}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      investors
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-500">Employees</p>
                      <Calendar className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold">
                      {msme?.ok.teamMembers.length}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Employees in the company
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Main Dashboard Tabs */}
            <Tabs defaultValue="nfts">
              <TabsList className="mb-6">
                <TabsTrigger value="nfts" className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  NFT Management
                </TabsTrigger>
                <TabsTrigger value="revenue" className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Revenue Reporting
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* NFT Management Tab */}
              <TabsContent value="nfts">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your NFT Offerings</h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600"
                      size="sm"
                      onClick={() =>
                        (window.location.href = "/dashboard/msme/create-nft")
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create New NFT
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {nftsData ? nftsData.map((nft) => (
                    <NFTManagementCard key={nft.id} nft={nft} />
                  )) : (
                    <div className="col-span-3 text-center">
                      <p className="text-zinc-500">No NFTs found</p>
                    </div>
                  )}
                </div>


              </TabsContent>

              {/* Revenue Reporting Tab */}
              <TabsContent value="revenue">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Revenue Reporting</h2>
                  <Button
                    className="bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => setShowReportingForm(!showReportingForm)}
                  >
                    {showReportingForm ? "Cancel" : "Report Revenue"}
                  </Button>
                </div>

                {showReportingForm ? (
                  <RevenueReportingForm
                    onCancel={() => setShowReportingForm(false)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Revenue Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RevenueChart data={revenueData?.quarterlyRevenue as QuarterlyRevenueData[]} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          Distribution History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {revenueData?.quarterlyRevenue.map((quarter, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{quarter.quarter}</p>
                                <div className="flex items-center text-xs text-zinc-500 mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {index === 0
                                    ? "Jan - Mar 2023"
                                    : index === 1
                                      ? "Apr - Jun 2023"
                                      : index === 2
                                        ? "Jul - Sep 2023"
                                        : "Oct - Dec 2023"}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ${(quarter.revenue / 1000).toFixed(1)}K
                                </p>
                                <p className="text-xs text-emerald-600">
                                  ${(quarter.distributions / 1000).toFixed(1)}K
                                  distributed
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Document Management</h2>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2 gap-4">
                  {msme.ok.documents.map((document) => (
                    <DocumentCard key={document.id} document={document} />
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 mx-auto"
                  >
                    View All Documents
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Analytics & Insights</h2>
                  <p className="text-zinc-500">
                    Data-driven insights to help grow your business
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Investor Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DistributionChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-500">
                              Average Return Rate
                            </p>
                            <p className="font-medium">14.2%</p>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-500">
                              Funding Success Rate
                            </p>
                            <p className="font-medium">85%</p>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-500">
                              Investor Satisfaction
                            </p>
                            <p className="font-medium">92%</p>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: "92%" }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-zinc-500">
                              Distribution Timeliness
                            </p>
                            <p className="font-medium">98%</p>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: "98%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-emerald-700">
                              Increase NFT Offerings
                            </p>
                            <p className="text-sm text-emerald-600 mt-1">
                              Based on your growth rate, consider creating 2 more
                              NFT offerings to meet investor demand.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <DollarSign className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-700">
                              Optimize Return Rates
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                              Your 15-18% return rate NFTs are performing 30% better
                              than others. Consider this range for future offerings.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-purple-700">
                              Distribution Schedule
                            </p>
                            <p className="text-sm text-purple-600 mt-1">
                              Quarterly distributions are most popular with
                              investors. Consider aligning future NFTs to this
                              schedule.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        ) : (
          <MSMEInfoPage />
        )
      }

      {/* Footer */}

    </div>
  );
}
