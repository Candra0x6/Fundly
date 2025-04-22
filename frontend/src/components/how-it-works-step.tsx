"use client"

import { motion } from "framer-motion"

interface HowItWorksStepProps {
  number: number
  title: string
  description: string
}

export default function HowItWorksStep({ number, title, description }: HowItWorksStepProps) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: number * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-100 rounded-full blur-md transform scale-110"></div>
        <div className="relative h-16 w-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-600">{description}</p>
    </motion.div>
  )
}
