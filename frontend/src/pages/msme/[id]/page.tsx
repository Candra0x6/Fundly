import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MapPin, Building, Calendar, ArrowUpRight, Share2, Bookmark } from "lucide-react"
import MSMEOverview from "@/components/msme/msme-overview"
import MSMEFinancials from "@/components/msme/msme-financials"
import MSMETeam from "@/components/msme/msme-team"
import MSMERoadmap from "@/components/msme/msme-roadmap"
import MSMEGallery from "@/components/msme/msme-gallery"
import MSMENFTs from "@/components/msme/msme-nfts"
import MSMEDocuments from "@/components/msme/msme-documents"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useMsmeActor } from "@/utility/actors/msmeActor"
import { MSME } from "@declarations/msme_registration/msme_registration.did"
import MSMELoading from "@/components/skeleton/msme-loading"
import { SingleAssetPreview } from "@/components/examples/AssetPreviewExample"
import { convertBigNumber } from "@/utility/converts/convertBigNumber"

export default function MSMEProfilePage() {
  const params = useParams();
  const msmeActor = useMsmeActor()
  const [msme, setMsme] = useState<MSME | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMsme = async () => {
      setLoading(true)
      try {
        const result = await msmeActor.getMSME(params.id as string)
        if ("ok" in result) {
          setMsme(result.ok)
        }
      } catch (error) {
        console.error("Error fetching MSME:", error)
      } finally {
        setLoading(false)
      }
    }
    setTimeout(() => {
      fetchMsme()
    }, 1000)
  }, [])

  if (loading) {
    return <MSMELoading />
  }

  if (!msme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">MSME Not Found</h2>
          <p className="text-zinc-500">The MSME you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-white pt-16 ">

      {/* Cover Image */}
      <div className="w-full h-64 bg-zinc-100 relative">
        <SingleAssetPreview
          assetId={msme.details.coverImage?.assetId}
          className="w-full h-full object-cover"
        />
      </div>

      {/* MSME Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl border border-zinc-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-24 w-24 rounded-xl bg-white border border-zinc-200 shadow-sm overflow-hidden flex-shrink-0">
                <SingleAssetPreview
                  assetId={msme.details.logo?.assetId}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{msme.details.name}</h1>
                  {"Verified" in msme.verificationStatus && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{msme.details.focusArea}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{msme.contactInfo.city}, {msme.contactInfo.country}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Founded {new Date(Number(msme.details.foundingDate) / 1000000).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {msme.details.industry.map((industry, index) => (
                    <Badge key={index} variant="outline" className="bg-zinc-50">
                      {industry}
                    </Badge>
                  ))}
                </div>
                <p className="text-zinc-600 max-w-3xl">{msme.details.description}</p>
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="md:ml-auto flex flex-col items-end justify-between">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Annual Revenue</p>
                  <p className="font-bold text-emerald-600">${convertBigNumber(Number(msme.financialInfo.annualRevenue) / 1000)}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Employees</p>
                  <p className="font-bold">{Number(msme.financialInfo.employeeCount) / 1000}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Funding Goal</p>
                  <p className="font-bold">${convertBigNumber(Number(msme.financialInfo.fundingGoal) / 1000)}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Registration Date</p>
                  <p className="font-bold text-emerald-600">{new Date(Number(msme.registrationDate) / 1000000).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                {msme.contactInfo.website[0] && (
                  <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1" size="sm">
                    <ArrowUpRight className="h-4 w-4" />
                    Website
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-zinc-50 p-1 rounded-lg">
            <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="financials" className="rounded-md data-[state=active]:bg-white">
              Financials
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-md data-[state=active]:bg-white">
              Team
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="rounded-md data-[state=active]:bg-white">
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-md data-[state=active]:bg-white">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="nfts" className="rounded-md data-[state=active]:bg-white">
              NFTs
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-md data-[state=active]:bg-white">
              Documents
            </TabsTrigger>

          </TabsList>

          <TabsContent value="overview">
            <MSMEOverview msme={msme} />
          </TabsContent>

          <TabsContent value="financials">
            <MSMEFinancials msme={msme} />
          </TabsContent>

          <TabsContent value="team">
            <MSMETeam msme={msme} />
          </TabsContent>

          <TabsContent value="roadmap">
            <MSMERoadmap msme={msme} />
          </TabsContent>

          <TabsContent value="gallery">
            <MSMEGallery msme={msme} />
          </TabsContent>

          <TabsContent value="nfts">
            <MSMENFTs msme={msme} />
          </TabsContent>

          <TabsContent value="documents">
            <MSMEDocuments msme={msme} />
          </TabsContent>

        </Tabs>
      </div>


    </div>
  )
}
