

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Lock, Shield, Star, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
export default function MSMEInfoPage() {
  const [activeTab, setActiveTab] = useState("why")
  const navigate = useNavigate()
  const handleCreateStore = () => {
    navigate("/msme-registration")
  }

  return (


    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Create Your MSME Store</h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Before accessing our platform's services, you'll need to create an MSME store. This helps us provide you
            with tailored services and connect you with the right investors.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <Tabs defaultValue="why" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="why">Why Create an MSME Store</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
                <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <TabsContent value="why" className="mt-0">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Verified Business Identity</h3>
                      <p className="text-zinc-600">
                        Creating an MSME store establishes your business's verified identity on our platform. This
                        builds trust with potential investors and partners, showing that your business has been
                        properly vetted.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Access to All Features</h3>
                      <p className="text-zinc-600">
                        An MSME store is required to access all platform features, including creating NFTs,
                        connecting with investors, and tracking your business metrics. This ensures all businesses on
                        our platform meet our verification standards.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Regulatory Compliance</h3>
                      <p className="text-zinc-600">
                        Our MSME registration process ensures compliance with financial regulations and KYC (Know Your
                        Customer) requirements, protecting both your business and investors on the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="benefits" className="mt-0">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Star className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Increased Visibility to Investors</h3>
                      <p className="text-zinc-600">
                        Verified MSMEs receive priority placement in our marketplace, increasing your visibility to
                        potential investors. Your complete profile helps investors make informed decisions about
                        supporting your business.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Networking Opportunities</h3>
                      <p className="text-zinc-600">
                        Connect with other MSMEs and investors in your industry. Our platform facilitates meaningful
                        business relationships beyond just funding, including potential partnerships and mentorship
                        opportunities.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Streamlined Funding Process</h3>
                      <p className="text-zinc-600">
                        Once your MSME store is created and verified, the process of creating NFTs and receiving
                        funding becomes quick and seamless. Your verified profile removes barriers between your
                        business and potential investors.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Data Protection</h3>
                      <p className="text-zinc-600">
                        We implement industry-leading security measures to protect your business information. All data
                        is encrypted and stored securely, with strict access controls in place to prevent unauthorized
                        access.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Information Control</h3>
                      <p className="text-zinc-600">
                        You control what information is visible to investors and other platform users. Our granular
                        privacy settings allow you to determine exactly what aspects of your business profile are
                        public and private.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                      <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">Transparent Data Usage</h3>
                      <p className="text-zinc-600">
                        We're transparent about how your data is used. Your information is only used to improve your
                        experience on the platform, connect you with relevant investors, and ensure compliance with
                        regulations. We never sell your data to third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-zinc-100">
              <Button
                onClick={handleCreateStore}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 rounded-xl"
              >
                Create MSME Store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </CardFooter>
          </Tabs>
        </Card>

        <div className="mt-12 bg-zinc-50 rounded-xl p-6 border border-zinc-200">
          <h2 className="text-xl font-semibold mb-4">What to Expect During Registration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-zinc-200">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <span className="text-emerald-700 font-medium">1</span>
              </div>
              <h3 className="font-medium mb-2">Business Information</h3>
              <p className="text-sm text-zinc-600">
                You'll provide basic details about your business, including registration information, industry, and
                contact details.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-zinc-200">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <span className="text-emerald-700 font-medium">2</span>
              </div>
              <h3 className="font-medium mb-2">Document Verification</h3>
              <p className="text-sm text-zinc-600">
                Upload necessary documents to verify your business identity, such as registration certificates and tax
                documents.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-zinc-200">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <span className="text-emerald-700 font-medium">3</span>
              </div>
              <h3 className="font-medium mb-2">Review & Approval</h3>
              <p className="text-sm text-zinc-600">
                Our team will review your information, and once approved, you'll gain full access to the platform's
                features.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-zinc-500 text-sm">
            Need help with registration?{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
