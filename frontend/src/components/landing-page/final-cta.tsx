;

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building, Users } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="w-full py-24 bg-gradient-to-br from-indigo-50 to-slate-100 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">
                Ready to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-600">
                  Join
                </span>{" "}
                the Impact Revolution?
              </h2>

              <p className="text-slate-600 mb-8 text-lg">
                Whether you're an MSME looking for funding or an investor
                seeking impactful returns, Fundly connects you to
                opportunities that create real-world change.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
                    <Building className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">
                      For MSMEs
                    </h3>
                    <p className="text-slate-600">
                      Access capital without traditional debt, build a community
                      of supporters, and grow your business sustainably.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-2 bg-indigo-100 rounded-lg">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800 mb-1">
                      For Investors
                    </h3>
                    <p className="text-slate-600">
                      Diversify your portfolio with direct investments in real
                      businesses, earn monthly returns, and create measurable
                      impact.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-slate-800 text-center">
                Get Started Today
              </h3>

              <div className="space-y-6 mb-8">
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-lg p-4">
                  <h4 className="font-medium text-indigo-700 mb-2">
                    For MSMEs
                  </h4>
                  <p className="text-slate-600 mb-4">
                    Apply for funding and connect with investors who believe in
                    your vision.
                  </p>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    asChild
                  >
                    <a href="/msme/apply">
                      Apply for Funding <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="bg-rose-50/80 border border-rose-100 rounded-lg p-4">
                  <h4 className="font-medium text-rose-700 mb-2">
                    For Investors
                  </h4>
                  <p className="text-slate-600 mb-4">
                    Browse opportunities and start building your impact
                    investment portfolio.
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
                    asChild
                  >
                    <a href="/marketplace">
                      Explore Opportunities{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="text-center text-slate-500 text-sm">
                <p>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
