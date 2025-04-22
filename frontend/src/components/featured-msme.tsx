"use client"

import { motion } from "framer-motion"
import { CheckCircle2, MapPin, Building } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeaturedMSMEProps {
  name: string
  industry: string
  location: string
  verified: boolean
  image: string
  description: string
}

export default function FeaturedMSME({ name, industry, location, verified, image, description }: FeaturedMSMEProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="h-16 w-16 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{name}</h3>
            {verified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500 mt-1">
            <div className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span>{industry}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm text-zinc-600 mb-4">{description}</p>
      <Button variant="outline" className="w-full text-sm">
        View Profile
      </Button>
    </motion.div>
  )
}
