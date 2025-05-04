

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useVerificationWorkflowActor } from "@/utility/actors/verificationWorkflow"
interface DecisionControlsProps {
  msmeId: string
}

export function DecisionControls({ msmeId }: DecisionControlsProps) {
  const router = useNavigate()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const verificationWorkflowCanister = useVerificationWorkflowActor()
  const handleApprove = async () => {
    // In a real app, you would submit the approval to your API
    console.log("Approving MSME:", msmeId)
    setShowApproveDialog(false)
    await verificationWorkflowCanister.updateVerificationStatus(msmeId, { Approved: null }, true, "Approved by Verifier")
    // Navigate back to dashboard after a short delay
    setTimeout(() => router("/verification-portal"), 500)
  }

  const handleReject = async () => {
    // In a real app, you would submit the rejection to your API
    console.log("Rejecting MSME:", msmeId)
    setShowRejectDialog(false)
    // Navigate back to dashboard after a short delay
    setTimeout(() => router("/verification-portal"), 500)
  }

  const handleFlag = () => {
    // In a real app, you would flag the MSME for further review
    console.log("Flagging MSME for review:", msmeId)
    setShowFlagDialog(false)
    // Navigate back to dashboard after a short delay
    setTimeout(() => router("/verification-portal"), 500)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Verification Decision</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowApproveDialog(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Verification
            </Button>


            <Button
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setShowRejectDialog(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Verification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve MSME Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this MSME verification? This will grant the business access to the
              platform and make them visible to investors.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject MSME Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this MSME verification? The business will be notified and will need to
              address the issues before reapplying.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} className="bg-red-600 hover:bg-red-700 text-white">
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Dialog */}
      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Flag for Further Review</AlertDialogTitle>
            <AlertDialogDescription>
              This will flag the MSME for review by a senior verification officer. The verification will be put on hold
              until the review is complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFlag} className="bg-amber-600 hover:bg-amber-700 text-white">
              Flag for Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
