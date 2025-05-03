"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock } from "lucide-react"
type Transaction = {
  id: string;
  nftTitle: string;
  company: string;
  amount: string;
  date: string;
  status: string;
}
export default function EarningsHistory({ transactions }: { transactions: Transaction[] }) {
  // Mock earnings history data
  console.log("transactions", transactions)


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
              {transactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-zinc-100 hover:bg-zinc-50"
                >
                  <td className="py-3 px-4 font-medium">{transaction.nftTitle}</td>
                  <td className="py-3 px-4 text-zinc-600">{transaction.company}</td>
                  <td className="py-3 px-4 text-right font-medium text-emerald-600">{transaction.amount}</td>
                  <td className="py-3 px-4 text-right text-zinc-600">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar className="h-3 w-3" />
                      {transaction.date}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">
                      <Badge
                        className={`${transaction.status === "received"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {transaction.status === "received" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status === "received" ? "Received" : "Upcoming"}
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
