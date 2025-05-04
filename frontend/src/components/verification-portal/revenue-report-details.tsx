

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Revenue } from "@declarations/revenue_reporting/revenue_reporting.did"
interface RevenueReportDetailsProps {
  revenueReport: Revenue
}


export function RevenueReportDetails({ revenueReport }: RevenueReportDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Report Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>

          </TabsList>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h4>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{Number(revenueReport.amount)}$</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Previous Period</h4>
                <p className="text-gray-900 dark:text-white">{revenueReport.description}</p>
              </div>


            </div>
          </TabsContent>


        </Tabs>
      </CardContent>
    </Card>
  )
}
