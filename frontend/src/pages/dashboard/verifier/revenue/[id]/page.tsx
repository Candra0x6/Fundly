import { RevenueReportDetails } from "@/components/verification-portal/revenue-report-details"
import { DocumentReviewer } from "@/components/verification-portal/supporting-document-viewer"
import { VerificationHistory } from "@/components/verification-portal/verification-history"
import { RevenueApprovalControls } from "@/components/verification-portal/revenue-approval-controls"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useRevenueActor } from "@/utility/actors/revanueActor"
import { Revenue } from "@declarations/revenue_reporting/revenue_reporting.did"
import { formatDate } from "@/utility/converts/formatDate"



export default function RevenueVerificationPage() {
  const { id } = useParams()

  const [revenueReport, setRevenueReport] = useState<Revenue[]>([])
  // In a real application, you would fetch the revenue report data based on the ID
  const revenueCanister = useRevenueActor()
  useEffect(() => {
    const fetchRevenueReport = async () => {
      const revenueReport = await revenueCanister.getMSMERevenues(id || "")
      console.log(revenueReport)
      // @ts-ignore
      setRevenueReport(revenueReport)
    }
    fetchRevenueReport()
  }, [])
  console.log(revenueReport)
  const navigate = useNavigate()

  if (!revenueReport[0]) {
    return <div>Loading ....</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard/verifier">
          <Button
            variant="ghost"
            className="pl-0 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Revenue Verification: {revenueReport[0].msmeId}
        </h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Report ID: {revenueReport[0].id}</span>
          <span>MSME ID: {revenueReport[0].msmeId}</span>
          <span>Period: {formatDate(revenueReport[0].reportDate)}</span>
          <span>Submitted: {formatDate(revenueReport[0].reportDate)}</span>
          <span>Status: {revenueReport[0].description}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <RevenueReportDetails revenueReport={revenueReport[0]} />
        </div>
        <div className="lg:col-span-4 space-y-8">
          <DocumentReviewer docs={revenueReport[0].document} />
        </div>

        <div className="space-y-8 lg:col-span-5 w-full">
          <RevenueApprovalControls reportId={revenueReport[0].id} msmeId={revenueReport[0].msmeId} />
        </div>
      </div>
    </div>
  )
}
