"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, CalendarDays } from "lucide-react"

interface MSMERoadmapProps {
  msmeId: string
}

export default function MSMERoadmap({ msmeId }: MSMERoadmapProps) {
  // This would normally be fetched from an API based on the ID
  const roadmap = [
    {
      id: "1",
      title: "Product Development Phase 1",
      description: "Development and testing of our next-generation solar panel design with 25% improved efficiency.",
      timeline: "Q1 2023 - Q2 2023",
      status: "completed",
      milestones: [
        { title: "Prototype Development", status: "completed" },
        { title: "Internal Testing", status: "completed" },
        { title: "Patent Filing", status: "completed" },
      ],
    },
    {
      id: "2",
      title: "Market Expansion: Malaysia",
      description: "Establishing operations and distribution networks in Malaysia to capture growing demand.",
      timeline: "Q2 2023 - Q4 2023",
      status: "in-progress",
      milestones: [
        { title: "Market Research", status: "completed" },
        { title: "Regulatory Approval", status: "completed" },
        { title: "Office Setup", status: "in-progress" },
        { title: "Team Hiring", status: "in-progress" },
        { title: "First Sales", status: "pending" },
      ],
    },
    {
      id: "3",
      title: "Mobile App Development",
      description:
        "Creating a user-friendly mobile app for customers to monitor their solar energy production and consumption.",
      timeline: "Q3 2023 - Q1 2024",
      status: "in-progress",
      milestones: [
        { title: "Requirements Gathering", status: "completed" },
        { title: "UI/UX Design", status: "completed" },
        { title: "Frontend Development", status: "in-progress" },
        { title: "Backend Development", status: "in-progress" },
        { title: "Testing", status: "pending" },
        { title: "Launch", status: "pending" },
      ],
    },
    {
      id: "4",
      title: "Product Development Phase 2",
      description: "Development of integrated battery storage solution to complement our solar panel systems.",
      timeline: "Q1 2024 - Q3 2024",
      status: "pending",
      milestones: [
        { title: "Research & Design", status: "pending" },
        { title: "Prototype Development", status: "pending" },
        { title: "Testing", status: "pending" },
        { title: "Manufacturing Setup", status: "pending" },
        { title: "Launch", status: "pending" },
      ],
    },
    {
      id: "5",
      title: "Market Expansion: Vietnam & Thailand",
      description: "Expanding operations to Vietnam and Thailand to further grow our presence in Southeast Asia.",
      timeline: "Q3 2024 - Q2 2025",
      status: "pending",
      milestones: [
        { title: "Market Research", status: "pending" },
        { title: "Regulatory Approval", status: "pending" },
        { title: "Office Setup", status: "pending" },
        { title: "Team Hiring", status: "pending" },
        { title: "First Sales", status: "pending" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {roadmap.map((phase, index) => (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{phase.title}</CardTitle>
                <Badge
                  className={`${phase.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : phase.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                >
                  {phase.status === "completed" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : phase.status === "in-progress" ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : (
                    <CalendarDays className="h-3 w-3 mr-1" />
                  )}
                  {phase.status === "completed"
                    ? "Completed"
                    : phase.status === "in-progress"
                      ? "In Progress"
                      : "Upcoming"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-zinc-500 mb-3">
                <CalendarDays className="h-4 w-4 mr-1" />
                {phase.timeline}
              </div>
              <p className="text-zinc-600 mb-4">{phase.description}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Milestones</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {phase.milestones.map((milestone, idx) => (
                    <div
                      key={idx}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${milestone.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : milestone.status === "in-progress"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-zinc-50 text-zinc-700"
                        }`}
                    >
                      {milestone.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : milestone.status === "in-progress" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <CalendarDays className="h-4 w-4" />
                      )}
                      {milestone.title}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
