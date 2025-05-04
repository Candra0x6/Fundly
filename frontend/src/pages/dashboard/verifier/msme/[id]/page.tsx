import { DocumentReviewer } from "@/components/verification-portal/document-reviewer"
import { VerificationChecklist } from "@/components/verification-portal/verification-checklist"
import { MSMEDetailReview } from "@/components/verification-portal/msme-detail-review"
import { FeedbackForm } from "@/components/verification-portal/feedback-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { MSME } from "@declarations/msme_registration/msme_registration.did"
import { useMsmeActor } from "@/utility/actors/msmeActor"
import { formatDate } from "@/utility/converts/formatDate"
import { MSMEVerificationPageSkeleton } from "@/components/skeleton/msme-verification-page-skeleton"

export default function MSMEVerificationPage() {
  // In a real application, you would fetch the MSME data based on the ID
  const { requestId, msmeId } = useParams()
  const msmeRegistrationCanister = useMsmeActor()
  const [msme, setMSME] = useState<MSME>()
  useEffect(() => {
    const fetchMSME = async () => {
      try {
        const msme = await msmeRegistrationCanister.getMSME(msmeId || "")
        // @ts-ignore
        setMSME(msme.ok)
      } catch (error) {
        console.error(error)
      }
    }
    fetchMSME()
  }, [])
  // Mock MSME data for demonstrationc

  console.log(msme)

  if (!msme) {
    return <MSMEVerificationPageSkeleton />
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify: {msme?.details.name || ""}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>ID: {msme?.id || ""}</span>
          <span>Type: {msme?.details.focusArea}</span>
          <span>Submitted: {formatDate(msme?.registrationDate || 0n)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8 lg:col-span-3">
          <MSMEDetailReview msme={msme as MSME} />
        </div>
        <div className="space-y-8 lg:col-span-2">
          <DocumentReviewer documents={msme?.documents || []} requestId={requestId || ""} />
        </div>
        <div className="space-y-8">
          <VerificationChecklist documents={msme?.documents || []} />
          <FeedbackForm msmeId={msmeId || ""} />
        </div>
      </div>
    </div>
  )
}
