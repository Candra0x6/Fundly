"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { MSME, Roadmap } from "@declarations/msme_registration/msme_registration.did"

interface MSMERoadmapProps {
  msme: MSME
}

export default function MSMERoadmap({ msme }: MSMERoadmapProps) {
  if (!msme.roadmap || msme.roadmap.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No roadmap information available</p>
      </div>
    )
  }

  console.log(msme)

  return (

    <div className="space-y-6">
      {msme.roadmap.map((phase: Roadmap[], index) => (
        <RoadmapPhase key={index} phase={phase} index={index} />
      ))}
    </div>
  )
}

interface RoadmapPhaseProps {
  phase: Roadmap[]
  index: number
}

function RoadmapPhase({ phase, index }: RoadmapPhaseProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "upcoming":
        return "bg-zinc-100 text-zinc-700"
      default:
        return "bg-zinc-100 text-zinc-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "upcoming":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{phase[0].title}</h3>

          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Timeline</h4>
                <p className="text-zinc-600">
                  {phase[0].timeline}
                </p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-zinc-600">{phase[0].description}</p>
              </div>
            </div>

            {phase[0].milestones && phase[0].milestones.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Milestones</h4>
                <div className="space-y-2">
                  {/* @ts-ignore */}
                  {phase[0].milestones.map((milestone, milestoneIndex) => (
                    <div key={milestoneIndex} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${milestone.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : milestone.status === "in-progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-zinc-200 text-zinc-500"
                          }`}
                      >
                        {milestone.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : milestone.status === "in-progress" ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <span className={milestone.status === "completed" ? "text-zinc-900" : "text-zinc-500"}>
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
