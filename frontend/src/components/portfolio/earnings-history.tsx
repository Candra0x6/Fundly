"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock } from "lucide-react"

export default function EarningsHistory() {
  // Mock earnings history data
  const earnings = [
    {
      id: "1",
      nftTitle: "GreenTech Q3 Revenue Share",
      company: "GreenTech Solutions",
      amount: "$750",
      date: "Sep 15, 2023",
      status: "received",
    },
    {
      id: "2",
      nftTitle: "Harvest Season Revenue",
      company: "Organic Harvest Co.",
      amount: "$280",
      date: "Sep 30, 2023",
      status: "received",
    },
    {
      id: "3",
      nftTitle: "EdTech Platform Expansion",
      company: "EduTech Innovations",
      amount: "$1,125",
      date: "Sep 5, 2023",
      status: "received",
    },
    {
      id: "4",
      nftTitle: "Healthcare App Development",
      company: "MediTech Solutions",
      amount: "$620",
      date: "Aug 30, 2023",
      status: "received",
    },
    {
      id: "5",
      nftTitle: "Sustainable Fashion Line",
      company: "EcoWear Designs",
      amount: "$480",
      date: "Aug 15, 2023",
      status: "received",
    },
    {
      id: "6",
      nftTitle: "GreenTech Q3 Revenue Share",
      company: "GreenTech Solutions",
      amount: "$750",
      date: "Oct 15, 2023",
      status: "upcoming",
    },
    {
      id: "7",
      nftTitle: "Local Food Delivery Network",
      company: "FoodConnect",
      amount: "$384",
      date: "Oct 20, 2023",
      status: "upcoming",
    },
    {
      id: "8",
      nftTitle: "Harvest Season Revenue",
      company: "Organic Harvest Co.",
      amount: "$280",
      date: "Nov 30, 2023",
      status: "upcoming",
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50">
                <th className="text-left py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">NFT</th>
                <th className="text-left py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">Company</th>
                <th className="text-right py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">Amount</th>
                <th className="text-right py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">Date</th>
                <th className="text-center py-3 px-4 font-medium text-zinc-500 border-b border-zinc-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((earning, index) => (
                <motion.tr
                  key={earning.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-zinc-100 hover:bg-zinc-50"
                >
                  <td className="py-3 px-4 font-medium">{earning.nftTitle}</td>
                  <td className="py-3 px-4 text-zinc-600">{earning.company}</td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-600">{earning.amount}</td>
                  <td className="py-3 px-4 text-right text-zinc-600">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar className="h-3 w-3" />
                      {earning.date}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <Badge
                        className={`${
                          earning.status === "received"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {earning.status === "received" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {earning.status === "received" ? "Received" : "Upcoming"}
                      </Badge>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
