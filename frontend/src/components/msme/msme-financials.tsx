

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { MSME } from "@declarations/msme_registration/msme_registration.did"

interface MSMEFinancialsProps {
  msme: MSME
}

export default function MSMEFinancials({ msme }: MSMEFinancialsProps) {
  if (!msme.financialInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No financial information available</p>
      </div>
    )
  }

  const financialInfo = msme.financialInfo

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        <FinancialCard
          title="Annual Revenue"
          value={`$${financialInfo.annualRevenue.toString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="bg-emerald-100 text-emerald-700"
        />
        <FinancialCard
          title="Employee Count"
          value={financialInfo.employeeCount.toString()}
          icon={<Users className="h-5 w-5" />}
          color="bg-blue-100 text-blue-700"
        />
        <FinancialCard
          title="Funding Goal"
          value={`$${financialInfo.fundingGoal.toString()}`}
          icon={<Target className="h-5 w-5" />}
          color="bg-purple-100 text-purple-700"
        />

      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="mb-6">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="profit">Profit</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardContent className="p-6">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-zinc-500">Revenue chart coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card>
            <CardContent className="p-6">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-zinc-500">Profit chart coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-6">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-zinc-500">Expenses chart coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardContent className="p-6">
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-zinc-500">Breakdown chart coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  )
}

interface FinancialCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}

function FinancialCard({ title, value, icon, color }: FinancialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-zinc-500 mb-1">{title}</p>
              <h3 className="text-2xl font-semibold">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
          </div>

        </CardContent>
      </Card>
    </motion.div>
  )
}
