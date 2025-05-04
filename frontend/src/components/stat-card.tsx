

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StatCardProps {
  value: string
  label: string
  icon: ReactNode
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <motion.div
      className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-zinc-500">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </motion.div>
  )
}
