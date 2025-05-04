

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, ShoppingCart, Clock, CheckCircle2, AlertCircle } from "lucide-react"
interface ActivityFeedProps {
  transactions: { id: string; nftTitle: string; company: string; amount: string; date: string; status: string }[]
}
export default function ActivityFeed({ transactions }: ActivityFeedProps) {
  // Mock activity data


  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-zinc-100">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 hover:bg-zinc-50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.status === "completed" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                    }`}
                >
                  {transaction.status === "completed" ? (
                    <ShoppingCart className="h-5 w-5" />
                  ) : (
                    <DollarSign className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{transaction.nftTitle}</p>
                      <div className="flex items-center text-xs text-zinc-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {transaction.date}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`font-medium ${transaction.status === "completed" ? "text-zinc-900" : "text-emerald-600"}`}
                      >
                        {transaction.status === "completed" ? "-" : "+"}
                        {transaction.amount}
                      </span>
                      <Badge
                        className={`mt-1 ${transaction.status === "received"
                          ? "bg-emerald-100 text-emerald-700"
                          : transaction.status === "upcoming"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {transaction.status === "completed" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : transaction.status === "pending" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
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
