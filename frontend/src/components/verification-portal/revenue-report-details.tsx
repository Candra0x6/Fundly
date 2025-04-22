"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RevenueReportDetailsProps {
  reportId: string
}

// Mock revenue data
const revenueData = {
  summary: {
    totalRevenue: "$45,000",
    previousPeriod: "$38,000",
    percentageChange: "+18.4%",
    averageMonthly: "$15,000",
    topProduct: "Organic Tomatoes",
    topProductRevenue: "$12,500",
  },
  monthly: [
    { month: "Apr", revenue: 14000 },
    { month: "May", revenue: 16000 },
    { month: "Jun", revenue: 15000 },
  ],
  categories: [
    { name: "Vegetables", revenue: 25000 },
    { name: "Fruits", revenue: 15000 },
    { name: "Herbs", revenue: 5000 },
  ],
  channels: [
    { name: "Direct Sales", revenue: 20000 },
    { name: "Wholesale", revenue: 15000 },
    { name: "Online", revenue: 10000 },
  ],
}

export function RevenueReportDetails({ reportId }: RevenueReportDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Report Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="channels">Sales Channels</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h4>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{revenueData.summary.totalRevenue}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Previous Period</h4>
                <p className="text-gray-900 dark:text-white">{revenueData.summary.previousPeriod}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Change</h4>
                <p className="text-emerald-600 dark:text-emerald-400">{revenueData.summary.percentageChange}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Monthly</h4>
                <p className="text-gray-900 dark:text-white">{revenueData.summary.averageMonthly}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Product</h4>
                <p className="text-gray-900 dark:text-white">{revenueData.summary.topProduct}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Product Revenue</h4>
                <p className="text-gray-900 dark:text-white">{revenueData.summary.topProductRevenue}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData.monthly} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData.categories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="channels">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData.channels} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
