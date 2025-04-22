"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

// Mock data for verification metrics
const metrics = [
  {
    title: "Pending Verifications",
    value: 24,
    change: "+5 from yesterday",
    icon: Clock,
    color: "text-amber-500",
  },
  {
    title: "Completed Today",
    value: 8,
    change: "75% completion rate",
    icon: CheckCircle,
    color: "text-emerald-500",
  },
  {
    title: "Flagged for Review",
    value: 3,
    change: "12% of total",
    icon: AlertTriangle,
    color: "text-red-500",
  },
]

export function VerificationMetrics() {
  return (
    <>
      {metrics.map((metric, index) => {
        const Icon = metric.icon

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</CardTitle>
              <Icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
