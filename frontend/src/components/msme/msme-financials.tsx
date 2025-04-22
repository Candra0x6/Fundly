"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, DollarSign, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react"

interface MSMEFinancialsProps {
  msmeId: string
}

export default function MSMEFinancials({ msmeId }: MSMEFinancialsProps) {
  return (
    <div className="space-y-8">
      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Annual Revenue</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                $2.4M
                <span className="text-sm font-normal text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  18%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-zinc-100 rounded-md overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "75%" }}></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Profit Margin</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                22%
                <span className="text-sm font-normal text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  5%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-zinc-100 rounded-md overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "22%" }}></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Customer Growth</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                35%
                <span className="text-sm font-normal text-emerald-600 flex items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  12%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-zinc-100 rounded-md overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "35%" }}></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-1"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Operating Costs</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                $1.8M
                <span className="text-sm font-normal text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  3%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-zinc-100 rounded-md overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "60%" }}></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Financial Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>View detailed financial data across different time periods</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="mb-4">
                <TabsTrigger value="revenue" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Revenue
                </TabsTrigger>
                <TabsTrigger value="profit" className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Profit
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex items-center gap-1">
                  <BarChart className="h-4 w-4" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="breakdown" className="flex items-center gap-1">
                  <PieChart className="h-4 w-4" />
                  Breakdown
                </TabsTrigger>
              </TabsList>

              <TabsContent value="revenue">
                <div className="aspect-[3/1] bg-zinc-50 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-zinc-300 mx-auto mb-2" />
                    <p className="text-zinc-500">Revenue chart visualization would appear here</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="profit">
                <div className="aspect-[3/1] bg-zinc-50 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-zinc-300 mx-auto mb-2" />
                    <p className="text-zinc-500">Profit chart visualization would appear here</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="expenses">
                <div className="aspect-[3/1] bg-zinc-50 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <BarChart className="h-12 w-12 text-zinc-300 mx-auto mb-2" />
                    <p className="text-zinc-500">Expenses chart visualization would appear here</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breakdown">
                <div className="aspect-[3/1] bg-zinc-50 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-zinc-300 mx-auto mb-2" />
                    <p className="text-zinc-500">Financial breakdown visualization would appear here</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Financial Projections</CardTitle>
            <CardDescription>
              5-year financial projections based on current growth rates and market conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 px-4 font-medium text-zinc-500">Metric</th>
                    <th className="text-right py-2 px-4 font-medium text-zinc-500">Year 1</th>
                    <th className="text-right py-2 px-4 font-medium text-zinc-500">Year 2</th>
                    <th className="text-right py-2 px-4 font-medium text-zinc-500">Year 3</th>
                    <th className="text-right py-2 px-4 font-medium text-zinc-500">Year 4</th>
                    <th className="text-right py-2 px-4 font-medium text-zinc-500">Year 5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 px-4 font-medium">Revenue</td>
                    <td className="text-right py-3 px-4">$2.4M</td>
                    <td className="text-right py-3 px-4">$3.1M</td>
                    <td className="text-right py-3 px-4">$4.2M</td>
                    <td className="text-right py-3 px-4">$5.5M</td>
                    <td className="text-right py-3 px-4">$7.2M</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 px-4 font-medium">Expenses</td>
                    <td className="text-right py-3 px-4">$1.8M</td>
                    <td className="text-right py-3 px-4">$2.2M</td>
                    <td className="text-right py-3 px-4">$2.9M</td>
                    <td className="text-right py-3 px-4">$3.7M</td>
                    <td className="text-right py-3 px-4">$4.8M</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 px-4 font-medium">Profit</td>
                    <td className="text-right py-3 px-4">$0.6M</td>
                    <td className="text-right py-3 px-4">$0.9M</td>
                    <td className="text-right py-3 px-4">$1.3M</td>
                    <td className="text-right py-3 px-4">$1.8M</td>
                    <td className="text-right py-3 px-4">$2.4M</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="py-3 px-4 font-medium">Profit Margin</td>
                    <td className="text-right py-3 px-4">25%</td>
                    <td className="text-right py-3 px-4">29%</td>
                    <td className="text-right py-3 px-4">31%</td>
                    <td className="text-right py-3 px-4">33%</td>
                    <td className="text-right py-3 px-4">33%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Customer Base</td>
                    <td className="text-right py-3 px-4">5,000</td>
                    <td className="text-right py-3 px-4">7,500</td>
                    <td className="text-right py-3 px-4">11,250</td>
                    <td className="text-right py-3 px-4">16,875</td>
                    <td className="text-right py-3 px-4">25,300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
