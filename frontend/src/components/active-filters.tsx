
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface Filter {
  id: string
  category: string
  value: string
}

interface ActiveFiltersProps {
  filters: Filter[]
  onRemoveFilter: (id: string) => void
  onClearAll: () => void
}

export default function ActiveFilters({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) {
  if (filters.length === 0) return null

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm"
        >
          <span className="text-emerald-500 font-medium">{filter.category}:</span>
          <span>{filter.value}</span>
          <button
            className="text-emerald-500 hover:text-emerald-700"
            onClick={() => onRemoveFilter(filter.id)}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        className="text-sm text-zinc-500 hover:text-zinc-700 underline"
        onClick={onClearAll}
      >
        Clear All
      </button>
    </motion.div>
  )
}
