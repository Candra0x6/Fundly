

import { motion } from "framer-motion"
import { Building2, User } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  type: "msme" | "investor"
}

export default function TestimonialCard({ quote, author, role, type }: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="mb-4">
        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
          {type === "msme" ? (
            <Building2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <User className="h-5 w-5 text-emerald-600" />
          )}
        </div>
        <p className="text-zinc-700 italic">"{quote}"</p>
      </div>
      <div className="border-t border-zinc-100 pt-4 mt-4">
        <p className="font-medium">{author}</p>
        <p className="text-zinc-500 text-sm">{role}</p>
      </div>
    </motion.div>
  )
}
