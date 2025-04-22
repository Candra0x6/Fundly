import { RevenueReportDetails } from "@/components/verification-portal/revenue-report-details"
import { SupportingDocumentViewer } from "@/components/verification-portal/supporting-document-viewer"
import { VerificationHistory } from "@/components/verification-portal/verification-history"
import { RevenueApprovalControls } from "@/components/verification-portal/revenue-approval-controls"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"


export default function RevenueVerificationPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the revenue report data based on the ID
  const reportId = params.id

  // Mock revenue report data for demonstration
  const reportData = {
    id: reportId,
    msmeName: "Green Harvest Farms",
    msmeId: "msme-001",
    reportingPeriod: "Q2 2023",
    submissionDate: "2023-07-10T14:30:00Z",
    status: "Pending Verification",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/verification-portal">
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
          Revenue Verification: {reportData.msmeName}
        </h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Report ID: {reportData.id}</span>
          <span>MSME ID: {reportData.msmeId}</span>
          <span>Period: {reportData.reportingPeriod}</span>
          <span>Submitted: {new Date(reportData.submissionDate).toLocaleDateString()}</span>
          <span>Status: {reportData.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RevenueReportDetails reportId={reportId} />
          <SupportingDocumentViewer reportId={reportId} />
        </div>

        <div className="space-y-8">
          <VerificationHistory reportId={reportId} />
          <RevenueApprovalControls reportId={reportId} />
        </div>
      </div>
    </div>
  )
}
