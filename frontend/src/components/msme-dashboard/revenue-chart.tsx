
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueChartProps {
  data: {
    quarter: string
    revenue: number
    distributions: number
  }[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="quarter" />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
          <Area
            type="monotone"
            dataKey="revenue"
            stackId="1"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="distributions"
            stackId="2"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
            name="Distributions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
