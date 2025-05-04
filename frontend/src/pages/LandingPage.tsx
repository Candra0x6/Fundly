import { Button } from "@/components/ui/button"

import TestimonialCard from "@/components/testimonial-card"
import MSMEIntegrationFlow from "@/components/landing-page/msme-integration-flow"
import { Badge } from "@/components/ui/badge"
import TechnologyBenefits from "@/components/landing-page/technology-benefits"
import WhyChooseUs from "@/components/landing-page/WhyChoose"
import HowItWorks from "@/components/landing-page/how-it-works"
import Testimonials from "@/components/landing-page/testimonials"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white ">

      {/* Hero Section */}
      <MSMEIntegrationFlow />

      <TechnologyBenefits />
      <WhyChooseUs />
      <HowItWorks />

      <Testimonials />


      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-emerald-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Join our platform today and be part of the future of MSME financing and investment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-emerald-600 hover:bg-zinc-100 h-12 px-6 rounded-xl">
                Register as MSME
              </Button>
              <Button variant="outline" className=" text-white h-12 px-6 rounded-xl bg-primary hover:bg-primary/80 hover:text-white">
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
