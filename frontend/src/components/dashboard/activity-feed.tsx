"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, ShoppingCart, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function ActivityFeed() {
  // Mock activity data
  const activities = [
    {
      id: "1",
      type: "purchase",
      title: "Purchased GreenTech Q3 Revenue Share NFT",
      amount: "$5,000",
      date: "Oct 2, 2023",
      time: "10:23 AM",
      status: "completed",
    },
    {
      id: "2",
      type: "earning",
      title: "Received earnings from Organic Harvest Co.",
      amount: "$280",
      date: "Sep 30, 2023",
      time: "12:00 PM",
      status: "completed",
    },
    {
      id: "3",
      type: "purchase",
      title: "Purchased EdTech Platform Expansion NFT",
      amount: "$7,500",
      date: "Sep 25, 2023",
      time: "3:45 PM",
      status: "completed",
    },
    {
      id: "4",
      type: "earning",
      title: "Received earnings from GreenTech Solutions",
      amount: "$750",
      date: "Sep 15, 2023",
      time: "12:00 PM",
      status: "completed",
    },
    {
      id: "5",
      type: "purchase",
      title: "Purchased Harvest Season Revenue NFT",
      amount: "$3,500",
      date: "Sep 10, 2023",
      time: "11:30 AM",
      status: "completed",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-100">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "purchase" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {activity.type === "purchase" ? (
                    <ShoppingCart className="h-5 w-5" />
                  ) : (
                    <DollarSign className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center text-xs text-zinc-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.date} at {activity.time}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-medium ${activity.type === "purchase" ? "text-zinc-900" : "text-emerald-600"}`}
                      >
                        {activity.type === "purchase" ? "-" : "+"}
                        {activity.amount}
                      </span>
                      <Badge
                        className={`mt-1 ${
                          activity.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : activity.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {activity.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : activity.status === "pending" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
