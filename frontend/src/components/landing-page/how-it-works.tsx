"use client";

import { motion } from "framer-motion";
import {
  Building,
  Users,
  FileText,
  BarChart3,
  Wallet,
  ArrowRight,
  Upload,
  PieChart,
  Coins,
  BadgeCheck,
  Shield,
  Badge,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerificationStep from "../verification-step";
import InvestmentStep from "../investment-step";

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState("msmes");

  const msmeSteps = [
    {
      icon: FileText,
      title: "Apply",
      description:
        "Complete your business profile and funding application with details about your MSME, revenue history, and growth plans.",
    },
    {
      icon: Upload,
      title: "Verification",
      description:
        "Upload financial documents and verification materials that will be securely stored on IPFS for investor review.",
    },
    {
      icon: Coins,
      title: "Funding",
      description:
        "Once approved, your funding opportunity is listed on the marketplace where investors can purchase revenue-sharing NFTs.",
    },
    {
      icon: BarChart3,
      title: "Report Revenue",
      description:
        "Submit monthly revenue reports with supporting documentation to maintain transparency with your investors.",
    },
    {
      icon: Wallet,
      title: "Share Revenue",
      description:
        "The platform automatically calculates and distributes the agreed percentage of revenue to NFT holders in ImpactID tokens.",
    },
  ];

  const investorSteps = [
    {
      icon: Building,
      title: "Browse MSMEs",
      description:
        "Explore a diverse range of verified MSMEs seeking funding across different sectors, locations, and revenue stages.",
    },
    {
      icon: PieChart,
      title: "Analyze Opportunities",
      description:
        "Review business profiles, financial history, and projected returns to make informed investment decisions.",
    },
    {
      icon: Wallet,
      title: "Purchase NFTs",
      description:
        "Buy revenue-sharing NFTs representing your stake in the MSME's future revenue, with transparent terms and conditions.",
    },
    {
      icon: BadgeCheck,
      title: "Verify Reports",
      description:
        "Access monthly revenue reports and supporting documentation stored on IPFS to ensure transparency.",
    },
    {
      icon: Coins,
      title: "Receive Returns",
      description:
        "Automatically receive your share of the MSME's revenue in ImpactID tokens based on your NFT holdings.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20  max-w-6xl mx-auto">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4"
          >
            <span className="text-sm text-emerald-700 tracking-wide font-medium">Guide Lines</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-foreground">
            Step-by-Step
          </h2>
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

  );
}
