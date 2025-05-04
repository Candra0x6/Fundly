

import { motion } from "framer-motion"
import { ArrowUpRight, TrendingUp, Users, Building, Coins } from "lucide-react"

export default function StatisticsSection() {
  const stats = [
    {
      title: "Total Investments",
      value: "$5.2M",
      change: "+24%",
      icon: Coins,
      description: "Capital deployed to MSMEs",
    },
    {
      title: "MSMEs Funded",
      value: "720+",
      change: "+12%",
      icon: Building,
      description: "Across 15 countries",
    },
    {
      title: "Active Investors",
      value: "15K+",
      change: "+32%",
      icon: Users,
      description: "From 40+ countries",
    },
    {
      title: "Avg. ROI",
      value: "18.5%",
      change: "+3.2%",
      icon: TrendingUp,
      description: "Annual returns",
    },
  ]

  return (
    <section className="w-full py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-rose-50/50" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-rose-100/50 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 backdrop-blur-sm border border-indigo-200/50 mb-4"
          >
            <span className="text-sm text-indigo-700 font-medium tracking-wide">Platform Impact</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-slate-800"
          >
            Real Impact in{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-600">Numbers</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-600 max-w-2xl mx-auto"
          >
            Our platform is creating measurable impact for MSMEs and investors alike. Here's how we're transforming
            local economies through decentralized finance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-100/80 rounded-lg">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex items-center text-emerald-600 text-sm font-medium">
                  {stat.change} <ArrowUpRight className="h-3 w-3 ml-1" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-slate-500 font-medium mb-1">{stat.title}</p>
              <p className="text-slate-400 text-sm">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="/marketplace"
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            View detailed impact report <ArrowUpRight className="h-4 w-4 ml-1" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
