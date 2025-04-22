"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface VerificationStepProps {
  number: number
  title: string
  description: string
}

export default function VerificationStep({ number, title, description }: VerificationStepProps) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: number * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-sm">
          {number}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{title}</h4>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>
    </motion.div>
  )
}
