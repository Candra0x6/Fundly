"use client"

import { motion } from "framer-motion"
import { Shield, Zap, BarChart3, Globe } from "lucide-react"

const benefits = [
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Secure & Transparent",
    description:
      "All transactions and revenue reports are recorded on the blockchain, ensuring complete transparency and security for both MSMEs and investors.",
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Efficient Funding",
    description:
      "MSMEs can access capital quickly without traditional loan requirements, while investors can diversify across multiple businesses with minimal friction.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Revenue-Based Returns",
    description:
      "Investors earn returns based on actual business performance, creating alignment between MSME success and investor outcomes.",
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Social Impact",
    description:
      "Support local economic development in underserved areas while earning returns, creating a sustainable model for impact investing.",
  },
]

export default function TechnologyBenefits() {
  return (
    <section className="w-full py-20 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-4"
          >
            <span className="text-sm text-emerald-700 tracking-wide font-medium">Platform Benefits</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
          >
            Technology Benefits
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            Our platform leverages blockchain technology to create a transparent and efficient investment ecosystem
            connecting MSMEs with investors looking for both returns and impact.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-emerald-100/10 rounded-xl p-6 shadow-sm border border-primary/20"
            >
              <div className="bg-emerald-50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">{benefit.title}</h3>
              <p className="text-slate-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
