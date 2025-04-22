import { ArrowDown, ArrowUp, DollarSign, Users, ShoppingBag, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BusinessMetricsProps {
  metrics: {
    revenue: {
      current: number
      previous: number
      growth: number
    }
    employees: {
      current: number
      previous: number
      growth: number
    }
    customers: {
      current: number
      previous: number
      growth: number
    }
    production: {
      current: number
      previous: number
      growth: number
    }
  }
}

export default function BusinessMetrics({ metrics }: BusinessMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Business Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue Metric */}
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="bg-emerald-100 dark:bg-emerald-900 p-2 rounded-md">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              {metrics.revenue.growth > 0 ? (
                <div className="flex items-center text-emerald-500 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {metrics.revenue.growth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center text-red-500 text-xs font-medium">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(metrics.revenue.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="text-lg font-semibold">{formatCurrency(metrics.revenue.current)}</p>
            </div>
          </div>

          {/* Employees Metric */}
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              {metrics.employees.growth > 0 ? (
                <div className="flex items-center text-emerald-500 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {metrics.employees.growth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center text-red-500 text-xs font-medium">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(metrics.employees.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Employees</p>
              <p className="text-lg font-semibold">{metrics.employees.current}</p>
            </div>
          </div>

          {/* Customers Metric */}
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-md">
                <ShoppingBag className="h-4 w-4 text-purple-500" />
              </div>
              {metrics.customers.growth > 0 ? (
                <div className="flex items-center text-emerald-500 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {metrics.customers.growth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center text-red-500 text-xs font-medium">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(metrics.customers.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Customers</p>
              <p className="text-lg font-semibold">{metrics.customers.current}</p>
            </div>
          </div>

          {/* Production Metric */}
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-md">
                <BarChart3 className="h-4 w-4 text-amber-500" />
              </div>
              {metrics.production.growth > 0 ? (
                <div className="flex items-center text-emerald-500 text-xs font-medium">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  {metrics.production.growth.toFixed(1)}%
                </div>
              ) : (
                <div className="flex items-center text-red-500 text-xs font-medium">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(metrics.production.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">Production</p>
              <p className="text-lg font-semibold">{metrics.production.current} units</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
