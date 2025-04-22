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
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    <section
      id="how-it-works"
      className="w-full py-20 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-rose-50/50" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200/50 mb-4"
          >
            <span className="text-sm text-indigo-700 font-medium tracking-wide">
              Platform Overview
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
          >
            How{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-600">
              ImpactID
            </span>{" "}
            Works
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            Our decentralized platform connects MSMEs with investors through a
            transparent, blockchain-powered revenue-sharing model.
          </motion.p>
        </div>

        <Tabs
          defaultValue="msmes"
          className="w-full max-w-4xl mx-auto"
          onValueChange={setActiveTab}
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-slate-100/80 backdrop-blur-sm">
              <TabsTrigger
                value="msmes"
                className={`px-6 py-2 ${activeTab === "msmes" ? "bg-white text-indigo-700" : "text-slate-600"}`}
              >
                <Building className="h-4 w-4 mr-2" />
                For MSMEs
              </TabsTrigger>
              <TabsTrigger
                value="investors"
                className={`px-6 py-2 ${activeTab === "investors" ? "bg-white text-indigo-700" : "text-slate-600"}`}
              >
                <Users className="h-4 w-4 mr-2" />
                For Investors
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="msmes" className="mt-0">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-indigo-100 transform -translate-x-1/2 hidden md:block" />

              {msmeSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 relative"
                >
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    {index % 2 === 0 ? (
                      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex md:flex-row-reverse items-center gap-4 mb-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <step.icon className="h-6 w-6 text-indigo-600" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  <div className="relative z-10 hidden md:block">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center border-4 border-white">
                      {index + 1}
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-8">
                    {index % 2 === 1 || window.innerWidth < 768 ? (
                      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <step.icon className="h-6 w-6 text-indigo-600" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
              >
                Apply for Funding <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="investors" className="mt-0">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-rose-100 transform -translate-x-1/2 hidden md:block" />

              {investorSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-12 relative"
                >
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    {index % 2 === 0 ? (
                      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex md:flex-row-reverse items-center gap-4 mb-3">
                          <div className="p-2 bg-rose-100 rounded-lg">
                            <step.icon className="h-6 w-6 text-rose-600" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  <div className="relative z-10 hidden md:block">
                    <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center border-4 border-white">
                      {index + 1}
                    </div>
                  </div>

                  <div className="md:w-1/2 md:pl-8">
                    {index % 2 === 1 || window.innerWidth < 768 ? (
                      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-2 bg-rose-100 rounded-lg">
                            <step.icon className="h-6 w-6 text-rose-600" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800"
              >
                Start Investing <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
