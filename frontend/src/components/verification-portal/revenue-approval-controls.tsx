

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
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRevenueActor } from "@/utility/actors/revanueActor"
import { toast } from "react-hot-toast"
import { useRevenueReporting } from "@/hooks/useRevenueReporting"
import { useMsmeActor } from "@/utility/actors/msmeActor"

interface RevenueApprovalControlsProps {
  reportId: string
  msmeId: string
}

export function RevenueApprovalControls({ reportId, msmeId }: RevenueApprovalControlsProps) {
  const router = useNavigate()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showFlagDialog, setShowFlagDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [notes, setNotes] = useState("")
  const { distributeRevenue } = useRevenueReporting()
  const msmeActor = useMsmeActor()
  const handleApprove = async () => {
    try {
      const msme = await msmeActor.getMSME(msmeId)
      // In a real app, you would submit the approval to your API
      // @ts-ignore
      const result = await distributeRevenue(reportId, msme.ok.details.owner)
      console.log(result)
      // @ts-ignore
      if (result.ok === null || result.ok) {
        toast.success("Revenue report approved")

        setTimeout(() => router("/dashboard/verifier"), 500)
      } else {
        toast.error("Failed to approve revenue report")
      }
    } catch (error) {
      toast.error("Failed to approve revenue report")
    }
  }



  const handleReject = async () => {
    // @ts-ignore
    if (result.ok === null) {
      toast.success("Revenue report rejected")
    } else {
      toast.error("Failed to reject revenue report")
    }
    setShowRejectDialog(false)
    // Navigate back to dashboard after a short delay
    setTimeout(() => router("/dashboard/verifier"), 500)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Revenue Approval</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowApproveDialog(true)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Revenue Report
            </Button>


            <Button
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={() => setShowRejectDialog(true)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Revenue Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Revenue Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this revenue report? This will confirm the reported revenue figures and
              make them available to investors.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Notes (Optional)</label>
            <Textarea
              placeholder="Add any notes about this approval..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotes("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Flag Dialog */}
      <AlertDialog open={showFlagDialog} onOpenChange={setShowFlagDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Additional Information</AlertDialogTitle>
            <AlertDialogDescription>
              Specify what additional information or documentation is needed to verify this revenue report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Request Details (Required)
            </label>
            <Textarea
              placeholder="Specify what additional information is needed..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Revenue Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this revenue report? Please provide a reason for the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Rejection Reason (Required)
            </label>
            <Textarea
              placeholder="Explain why this revenue report is being rejected..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotes("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!notes.trim()}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
