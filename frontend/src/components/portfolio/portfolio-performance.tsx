"use client"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

interface PortfolioPerformanceProps {
  type: "value" | "earnings" | "growth"
}

export default function PortfolioPerformance({ type }: PortfolioPerformanceProps) {
  // Mock data for the charts
  const valueData = [
    { month: "Apr", value: 30000 },
    { month: "May", value: 32000 },
    { month: "Jun", value: 35000 },
    { month: "Jul", value: 37500 },
    { month: "Aug", value: 39000 },
    { month: "Sep", value: 42500 },
  ]

  const earningsData = [
    { month: "Apr", value: 450 },
    { month: "May", value: 480 },
    { month: "Jun", value: 525 },
    { month: "Jul", value: 1125 },
    { month: "Aug", value: 1170 },
    { month: "Sep", value: 1570 },
  ]

  const growthData = [
    { month: "Apr", value: 0 },
    { month: "May", value: 6.7 },
    { month: "Jun", value: 9.4 },
    { month: "Jul", value: 7.1 },
    { month: "Aug", value: 4 },
    { month: "Sep", value: 9 },
  ]

  // Select the appropriate data based on the type
  const data = type === "value" ? valueData : type === "earnings" ? earningsData : growthData

  // Format the tooltip value based on the type
  const formatTooltipValue = (value: number) => {
    if (type === "value" || type === "earnings") {
      return `$${value.toLocaleString()}`
    } else {
      return `${value}%`
    }
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) =>
              type === "growth" ? `${value}%` : type === "value" ? `$${value / 1000}k` : `$${value}`
            }
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorValue)"
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
