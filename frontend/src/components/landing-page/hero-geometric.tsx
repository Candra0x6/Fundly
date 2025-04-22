"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroGeometricProps {
  badge?: string;
  title1?: string;
  title2?: string;
}

export default function HeroGeometric({
  badge = "ImpactID Platform",
  title1 = "Empowering MSMEs",
  title2 = "Through NFT Investments",
}: HeroGeometricProps) {
  return (
    <section className="w-full min-h-[90vh] py-20 relative overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-300/20 to-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-r from-rose-300/20 to-rose-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-amber-300/20 to-amber-400/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm border border-indigo-200/50 mb-6"
          >
            <span className="text-sm text-indigo-700 font-medium tracking-wide">
              {badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="block text-slate-800">{title1}</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-600">
              {title2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl mb-8 max-w-3xl mx-auto"
          >
            A decentralized Web3 platform connecting micro, small, and medium
            enterprises with investors through revenue-sharing NFTs, creating
            transparent and impactful investment opportunities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-none"
              asChild
            >
              <Link to={""}>
                Explore Opportunities <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              asChild
            >
              <Link to="/guides">Learn More</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex items-center justify-center gap-8"
          >
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold text-indigo-700">500+</p>
              <p className="text-slate-600">MSMEs Funded</p>
            </div>
            <div className="h-12 w-px bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold text-indigo-700">$2.5M</p>
              <p className="text-slate-600">Total Investments</p>
            </div>
            <div className="h-12 w-px bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold text-indigo-700">12K+</p>
              <p className="text-slate-600">Active Investors</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 65C1248 70 1344 80 1392 85L1440 90V0H1392C1344 0 1248 0 1152 0C1056 0 960 0 864 0C768 0 672 0 576 0C480 0 384 0 288 0C192 0 96 0 48 0H0V120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
