"use client"

import { useMemo, useState } from "react"
import { format, subDays, subMonths } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AllTransactions } from "@/types/transaction"
interface TransactionChartProps {
  transactions: AllTransactions[]
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  const [timeRange, setTimeRange] = useState("30days")

  // Prepare data for chart based on time range
  const chartData = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let dateFormat: string
    let interval: "day" | "month"

    // Set start date and format based on selected time range
    switch (timeRange) {
      case "7days":
        startDate = subDays(now, 7)
        dateFormat = "MMM d"
        interval = "day"
        break
      case "30days":
        startDate = subDays(now, 30)
        dateFormat = "MMM d"
        interval = "day"
        break
      case "3months":
        startDate = subMonths(now, 3)
        dateFormat = "MMM"
        interval = "month"
        break
      case "6months":
        startDate = subMonths(now, 6)
        dateFormat = "MMM"
        interval = "month"
        break
      default:
        startDate = subDays(now, 30)
        dateFormat = "MMM d"
        interval = "day"
    }

    // Filter transactions within the selected time range
    const filteredTransactions = transactions.filter(
      (tx) => new Date(Number(tx.timestamp)) >= startDate && new Date(Number(tx.timestamp)) <= now,
    )

    // Group transactions by date
    const groupedData: Record<string, { date: string; incoming: number; outgoing: number }> = {}

    // Initialize data points
    if (interval === "day") {
      for (let i = 0; i <= (timeRange === "7days" ? 7 : 30); i++) {
        const date = subDays(now, i)
        const dateKey = format(date, "yyyy-MM-dd")
        const formattedDate = format(date, dateFormat)
        groupedData[dateKey] = { date: formattedDate, incoming: 0, outgoing: 0 }
      }
    } else {
      for (let i = 0; i < (timeRange === "3months" ? 3 : 6); i++) {
        const date = subMonths(now, i)
        const dateKey = format(date, "yyyy-MM")
        const formattedDate = format(date, dateFormat)
        groupedData[dateKey] = { date: formattedDate, incoming: 0, outgoing: 0 }
      }
    }

    // Populate data
    filteredTransactions.forEach((tx) => {
      const txDate = new Date(Number(tx.timestamp))
      const dateKey = interval === "day" ? format(txDate, "yyyy-MM-dd") : format(txDate, "yyyy-MM")

      if (!groupedData[dateKey]) return

      if ("amount" in tx) {
        if (tx.category === "distributionTx" || (tx.category === "tokenTx" && "to" in tx)) {
          groupedData[dateKey].incoming += Number(tx.amount)
        } else if (tx.category === "tokenTx" && "from" in tx) {
          groupedData[dateKey].outgoing += Number(tx.amount)
        }
      }
    })

    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }, [transactions, timeRange])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Transaction Volume</h3>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar dataKey="incoming" name="Incoming" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="outgoing" name="Outgoing" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
