"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Upload,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
} from "lucide-react"

interface VerificationStatusProps {
  status: string
  date: string
}

export default function VerificationStatus({ status, date }: VerificationStatusProps) {
  const [expandedHistory, setExpandedHistory] = useState(false)

  // Mock verification history
  const verificationHistory = [
    {
      date: date || new Date().toISOString().split("T")[0],
      status: status,
      officer: "John Doe",
      notes: "All documents verified and approved. Business meets all requirements.",
    },
    {
      date: "2023-05-20",
      status: "pending",
      officer: "Jane Smith",
      notes: "Additional documentation requested for business registration.",
    },
    {
      date: "2023-05-15",
      status: "submitted",
      officer: "",
      notes: "Initial documents submitted for verification.",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200"
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "rejected":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "submitted":
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-zinc-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "verified":
        return "Verified"
      case "pending":
        return "Pending Verification"
      case "rejected":
        return "Verification Rejected"
      case "submitted":
        return "Documents Submitted"
      default:
        return "Not Verified"
    }
  }

  return (
    <div className="space-y-4">
      <Card className={`border-l-4 ${getStatusColor(status)}`}>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(status)}
              <div>
                <h3 className="font-medium text-lg">{getStatusText(status)}</h3>
                <p className="text-zinc-500 text-sm">
                  {status === "verified"
                    ? "This MSME has been verified and can create NFTs."
                    : status === "pending"
                      ? "Verification is in progress. Documents are being reviewed."
                      : status === "rejected"
                        ? "Verification has been rejected. Please review the feedback."
                        : "Documents have been submitted for verification."}
                </p>
              </div>
            </div>

            {status !== "verified" && (
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Verification History</span>
            <Button variant="ghost" size="sm" onClick={() => setExpandedHistory(!expandedHistory)} className="h-8 px-2">
              {expandedHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(expandedHistory ? verificationHistory : verificationHistory.slice(0, 2)).map((item, index) => (
              <div key={index} className={`p-4 rounded-lg ${getStatusColor(item.status)} border`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(item.status)}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                      <h4 className="font-medium">{getStatusText(item.status)}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm mt-1">{item.notes}</p>
                    {item.officer && (
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <User className="h-3 w-3" />
                        <span>Verification Officer: {item.officer}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!expandedHistory && verificationHistory.length > 2 && (
              <Button variant="ghost" className="w-full text-zinc-500" onClick={() => setExpandedHistory(true)}>
                Show {verificationHistory.length - 2} more entries
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
