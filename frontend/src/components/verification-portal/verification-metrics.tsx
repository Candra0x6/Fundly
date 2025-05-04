"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotebookPenIcon } from "lucide-react"
import { RequestWithMSMEDetails } from "@declarations/verification_workflow/verification_workflow.did"
// Mock data for verification metrics



export function VerificationMetrics({ metrics }: { metrics: RequestWithMSMEDetails[] }) {


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Requests</CardTitle>
          <NotebookPenIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.length}</div>
        </CardContent>
      </Card>

    </>
  )
}
