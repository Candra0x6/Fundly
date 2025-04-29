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
import MSMEVerification from "@/components/msme/msme-verification"
import { useParams } from "react-router-dom"

export default function MSMEProfilePage() {
  // This would normally be fetched from an API based on the ID
  const params = useParams();

  const msme = {
    id: params.id,
    name: "GreenTech Solutions",
    logo: "/placeholder.svg?height=120&width=120",
    coverImage: "/placeholder.svg?height=400&width=1200",
    industry: "Renewable Energy",
    location: "Singapore",
    founded: "2018",
    verified: true,
    verificationDate: "June 15, 2023",
    description:
      "GreenTech Solutions is a leading provider of affordable solar solutions for residential buildings in Southeast Asia. Our mission is to make renewable energy accessible to all and contribute to a sustainable future.",
    website: "https://greentechsolutions.example",
    socialLinks: {
      linkedin: "https://linkedin.com/company/greentechsolutions",
      twitter: "https://twitter.com/greentechsolutions",
      facebook: "https://facebook.com/greentechsolutions",
    },
    stats: {
      totalRaised: "$1.2M",
      activeNFTs: 3,
      investors: 245,
      avgReturn: "12.5%",
    },
    tags: ["Solar Energy", "Sustainability", "Clean Tech", "Residential", "B2C"],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-zinc-100">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold">FND</span>
            </div>
            <span className="font-semibold text-xl">Fundify</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">
              For MSMEs
            </a>
            <a
              href="/marketplace"
              className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors"
            >
              Marketplace
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm">
              Log In
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-sm">Register</Button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="w-full h-64 bg-zinc-100 relative">
        <img
          src={msme.coverImage || "/placeholder.svg"}
          alt={`${msme.name} cover`}
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
                <img src={msme.logo || "/placeholder.svg"} alt={msme.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{msme.name}</h1>
                  {msme.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{msme.industry}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{msme.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Founded {msme.founded}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {msme.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-zinc-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-zinc-600 max-w-3xl">{msme.description}</p>
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="md:ml-auto flex flex-col items-end justify-between">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Total Raised</p>
                  <p className="font-bold text-emerald-600">{msme.stats.totalRaised}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Active NFTs</p>
                  <p className="font-bold">{msme.stats.activeNFTs}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Investors</p>
                  <p className="font-bold">{msme.stats.investors}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 mb-1">Avg. Return</p>
                  <p className="font-bold text-emerald-600">{msme.stats.avgReturn}</p>
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
                <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                  Website
                </Button>
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
            <TabsTrigger value="verification" className="rounded-md data-[state=active]:bg-white">
              Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MSMEOverview msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="financials">
            <MSMEFinancials msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="team">
            <MSMETeam msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="roadmap">
            <MSMERoadmap msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="gallery">
            <MSMEGallery msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="nfts">
            <MSMENFTs msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="documents">
            <MSMEDocuments msmeId={msme.id || ""} />
          </TabsContent>

          <TabsContent value="verification">
            <MSMEVerification msmeId={msme.id || ""} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-zinc-900 text-zinc-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <span className="text-white font-bold">FND</span>
                </div>
                <span className="font-semibold text-xl text-white">Fundify</span>
              </div>
              <p className="text-sm mb-4">
                Connecting MSMEs with investors through tokenized revenue sharing opportunities.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For MSMEs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Investors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Marketplace
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partnerships
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 mt-12 pt-8 text-sm text-center">
            <p>© 2025 Fundify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
