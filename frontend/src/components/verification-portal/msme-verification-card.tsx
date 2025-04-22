"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface MSMEVerificationCardProps {
  verification: {
    id: string
    name: string
    type: string
    submittedDate: string
    priority: string
    documentCount: number
    status: string
  }
}

export function MSMEVerificationCard({ verification }: MSMEVerificationCardProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleVerify = () => {
    // Navigate to the MSME verification page
    router.push(`/verification-portal/msme/${verification.id}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{verification.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {verification.id}</p>
          </div>
          <Badge className={`mt-2 sm:mt-0 ${getPriorityColor(verification.priority)}`}>
            {verification.priority} Priority
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{formatDate(verification.submittedDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{verification.type}</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{verification.documentCount} Documents</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleVerify} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Start Verification
          </Button>
        </div>
      </div>
    </div>
  )
}
