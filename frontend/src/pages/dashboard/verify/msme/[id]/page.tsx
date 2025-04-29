import { DocumentReviewer } from "@/components/verification-portal/document-reviewer"
import { VerificationChecklist } from "@/components/verification-portal/verification-checklist"
import { MSMEDetailReview } from "@/components/verification-portal/msme-detail-review"
import { DecisionControls } from "@/components/verification-portal/decision-controls"
import { FeedbackForm } from "@/components/verification-portal/feedback-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"


export default function MSMEVerificationPage() {
  // In a real application, you would fetch the MSME data based on the ID

  // Mock MSME data for demonstrationc
  const msmeId = useParams().id
  const msmeData = {
    id: msmeId,
    name: "Green Harvest Farms",
    type: "Agriculture",
    submissionDate: "2023-04-15T10:30:00Z",
    status: "Pending Verification",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard/verify">
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify: {msmeData.name}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>ID: {msmeData.id}</span>
          <span>Type: {msmeData.type}</span>
          <span>Submitted: {new Date(msmeData.submissionDate).toLocaleDateString()}</span>
          <span>Status: {msmeData.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MSMEDetailReview msmeId={msmeId || ""} />
          <DocumentReviewer msmeId={msmeId || ""} />
        </div>

        <div className="space-y-8">
          <VerificationChecklist msmeId={msmeId || ""} />
          <FeedbackForm msmeId={msmeId || ""} />
          <DecisionControls msmeId={msmeId || ""} />
        </div>
      </div>
    </div>
  )
}
