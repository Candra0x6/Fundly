"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react"

interface VerificationHistoryProps {
  reportId: string
}

// Mock verification history
const verificationHistory = [
  {
    id: "history-1",
    action: "Revenue Report Submitted",
    date: "2023-07-10T14:30:00Z",
    user: "John Mwangi",
    role: "MSME Owner",
    status: "submitted",
  },
  {
    id: "history-2",
    action: "Initial Review",
    date: "2023-07-11T09:15:00Z",
    user: "Sarah Omondi",
    role: "Verification Officer",
    status: "in-progress",
  },
  {
    id: "history-3",
    action: "Additional Documents Requested",
    date: "2023-07-11T10:30:00Z",
    user: "Sarah Omondi",
    role: "Verification Officer",
    status: "flagged",
    notes: "Requested bank statements for June to verify sales figures.",
  },
  {
    id: "history-4",
    action: "Additional Documents Provided",
    date: "2023-07-12T16:45:00Z",
    user: "John Mwangi",
    role: "MSME Owner",
    status: "submitted",
  },
]

export function VerificationHistory({ reportId }: VerificationHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "flagged":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Verification History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {verificationHistory.map((item, index) => (
            <div key={item.id} className="relative pl-6">
              {index !== verificationHistory.length - 1 && (
                <div className="absolute left-[10px] top-[24px] h-full w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}
              <div className="flex items-start gap-3">
                <div className="absolute left-0 top-1 mt-0.5">{getStatusIcon(item.status)}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.action}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.date)} by {item.user} ({item.role})
                  </p>
                  {item.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
