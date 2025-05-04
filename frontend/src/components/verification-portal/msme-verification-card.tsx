

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { RequestWithMSMEDetails } from "@declarations/verification_workflow/verification_workflow.did"
import { formatDate } from "@/utility/converts/formatDate"
interface MSMEVerificationCardProps {
  verification: RequestWithMSMEDetails
}

export function MSMEVerificationCard({ verification }: MSMEVerificationCardProps) {
  const router = useNavigate()

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{verification.msmeDetails[0]?.details.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {verification.msmeDetails[0]?.id}</p>
          </div>

        </div>

        <div className="flex gap-4 mb-4 w-full justify-between">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(verification.request.createdAt)}</span>
          </div>

          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{verification.request.documents.length} Documents</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => window.location.href = `/dashboard/verifier/revenue/${verification.msmeDetails[0]?.id}`} className="bg-white border-emerald-600 hover:bg-emerald-50 text-emerald-600 border-1">
            Revenue Verification
          </Button>
          <Button onClick={() => router(`/dashboard/verifier/${verification.request.id}/msme/${verification.msmeDetails[0]?.id}`)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Start Verification
          </Button>
        </div>
      </div>
    </div>
  )
}
