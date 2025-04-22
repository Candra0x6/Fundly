"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function ActiveFilters() {
  // Sample active filters
  const activeFilters = [
    { id: 1, category: "Industry", value: "Renewable Energy" },
    { id: 2, category: "Return", value: "10% - 15%" },
    { id: 3, category: "Price", value: "1,000 - 5,000 FND" },
  ]

  if (activeFilters.length === 0) return null

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeFilters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm"
        >
          <span className="text-emerald-500 font-medium">{filter.category}:</span>
          <span>{filter.value}</span>
          <button className="text-emerald-500 hover:text-emerald-700">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button className="text-sm text-zinc-500 hover:text-zinc-700 underline">Clear All</button>
    </motion.div>
  )
}
