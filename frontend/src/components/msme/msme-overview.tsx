"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Lightbulb, Award, BarChart3, Rocket } from "lucide-react"
import { MSME } from "@declarations/msme_registration/msme_registration.did"

interface MSMEOverviewProps {
  msme: MSME
}

export default function MSMEOverview({ msme }: MSMEOverviewProps) {
  if (!msme.overview || msme.overview.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No overview information available</p>
      </div>
    )
  }

  const overview = msme.overview[0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverviewCard
          title="Mission"
          description={overview.mission}
          icon={<Target className="h-5 w-5" />}
          color="bg-blue-100 text-blue-700"
        />
        <OverviewCard
          title="Vision"
          description={overview.vision}
          icon={<Eye className="h-5 w-5" />}
          color="bg-purple-100 text-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverviewCard
          title="Impact"
          description={overview.impact}
          icon={<Lightbulb className="h-5 w-5" />}
          color="bg-emerald-100 text-emerald-700"
        />
        <OverviewCard
          title="Unique Value Proposition"
          description={overview.uniqueValueProposition}
          icon={<Rocket className="h-5 w-5" />}
          color="bg-orange-100 text-orange-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OverviewCard
          title="Market Opportunity"
          description={overview.marketOpportunity}
          icon={<BarChart3 className="h-5 w-5" />}
          color="bg-rose-100 text-rose-700"
        />
        <OverviewCard
          title="Key Achievements"
          description={overview.keyAchievements}
          icon={<Award className="h-5 w-5" />}
          color="bg-yellow-100 text-yellow-700"
        />
      </div>
    </div>
  )
}

interface OverviewCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

function OverviewCard({ title, description, icon, color }: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-zinc-600">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
