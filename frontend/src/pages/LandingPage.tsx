import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Shield, Zap, Users } from "lucide-react"
import VerificationStep from "@/components/verification-step"
import InvestmentStep from "@/components/investment-step"
import StatCard from "@/components/stat-card"
import TestimonialCard from "@/components/testimonial-card"
import FeaturedMSME from "@/components/featured-msme"
import FeaturedNFT from "@/components/featured-nft"
import MSMEIntegrationFlow from "@/components/landing-page/msme-integration-flow"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <MSMEIntegrationFlow />
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-zinc-600">
              Our platform connects MSMEs seeking funding with investors looking for opportunities, using NFTs to
              represent revenue shares.
            </p>
          </div>

          {/* Two Columns */}
          <div className="grid md:grid-cols-2 gap-16">
            {/* MSME Verification Flow */}
            <div id="msmes">
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold">For MSMEs</h3>
                </div>
                <p className="text-zinc-600 mb-8">
                  Get verified and create NFTs representing shares of your future revenue to raise capital for your
                  business.
                </p>
                <div className="space-y-6">
                  <VerificationStep
                    number={1}
                    title="Register Account"
                    description="Create your business account on our platform"
                  />
                  <VerificationStep
                    number={2}
                    title="Provide Business Information"
                    description="Enter your business details and financial information"
                  />
                  <VerificationStep
                    number={3}
                    title="Upload Verification Documents"
                    description="Submit required documents for verification"
                  />
                  <VerificationStep
                    number={4}
                    title="Verification Review"
                    description="Our team reviews your documents and information"
                  />
                  <VerificationStep
                    number={5}
                    title="Approval"
                    description="Once approved, you can create NFTs for investment"
                  />
                </div>
                <div className="mt-8">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                    Register as MSME
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* NFT Investment Flow */}
            <div id="investors">
              <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold">For Investors</h3>
                </div>
                <p className="text-zinc-600 mb-8">
                  Browse and invest in NFTs that represent revenue shares of verified MSMEs and earn returns as they
                  grow.
                </p>
                <div className="space-y-6">
                  <InvestmentStep
                    number={1}
                    title="Browse Marketplace"
                    description="Explore available NFTs from verified MSMEs"
                  />
                  <InvestmentStep
                    number={2}
                    title="Select NFT"
                    description="Choose an NFT that matches your investment criteria"
                  />
                  <InvestmentStep
                    number={3}
                    title="View Details"
                    description="Analyze business information and revenue projections"
                  />
                  <InvestmentStep number={4} title="Purchase NFT" description="Buy the NFT using FND tokens" />
                  <InvestmentStep
                    number={5}
                    title="Receive Distributions"
                    description="Earn returns when the MSME reports revenue"
                  />
                </div>
                <div className="mt-8">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-xl">
                    Register as Investor
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-zinc-600">Hear from MSMEs and investors who have found success on our platform.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="As a small business owner, traditional funding was always a challenge. With Fundify, we were able to raise capital quickly and transparently while maintaining control of our business."
              author="Maria Santos"
              role="CEO, GreenTech Solutions"
              type="msme"
            />
            <TestimonialCard
              quote="The platform makes it easy to discover promising MSMEs and invest in their growth. The transparency and verification process gives me confidence in my investments."
              author="James Chen"
              role="Angel Investor"
              type="investor"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Join our platform today and be part of the future of MSME financing and investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-emerald-600 hover:bg-zinc-100 h-12 px-6 rounded-xl">
                Register as MSME
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-6 rounded-xl">
                Register as Investor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

    </div>
  )
}
