

import { useEffect, useState } from "react"
import { MSMEVerificationCard } from "./msme-verification-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useVerificationWorkflowActor } from "@/utility/actors/verificationWorkflow"
import { RequestWithMSMEDetails } from "@declarations/verification_workflow/verification_workflow.did"



export function VerificationQueue() {
  const [requests, setRequests] = useState<RequestWithMSMEDetails[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(requests.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = requests.slice(startIndex, endIndex)


  const verificationActor = useVerificationWorkflowActor()
  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await verificationActor.getAllRequestsWithMSMEDetails()
      setRequests(requests)
    }
    fetchRequests()
  }, [])

  return (
    <div>
      <div className="space-y-4">
        {currentItems.map((verification) => (
          <MSMEVerificationCard key={verification.request.id} verification={verification} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, requests.length)} of {requests.length}{" "}
            verifications
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
