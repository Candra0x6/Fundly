"use client"

import { useState } from "react"
import { MSMEVerificationCard } from "./msme-verification-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for verification queue
const mockVerifications = [
  {
    id: "msme-001",
    name: "Green Harvest Farms",
    type: "Initial Verification",
    submittedDate: "2023-04-15T10:30:00Z",
    priority: "High",
    documentCount: 8,
    status: "Pending",
  },
  {
    id: "msme-002",
    name: "Tech Innovate Solutions",
    type: "Initial Verification",
    submittedDate: "2023-04-14T09:15:00Z",
    priority: "Medium",
    documentCount: 6,
    status: "Pending",
  },
  {
    id: "msme-003",
    name: "Artisan Crafts Cooperative",
    type: "Initial Verification",
    submittedDate: "2023-04-13T14:45:00Z",
    priority: "Low",
    documentCount: 5,
    status: "Pending",
  },
  {
    id: "msme-004",
    name: "Local Textiles Manufacturing",
    type: "Initial Verification",
    submittedDate: "2023-04-12T11:20:00Z",
    priority: "Medium",
    documentCount: 7,
    status: "Pending",
  },
  {
    id: "msme-005",
    name: "Sustainable Energy Solutions",
    type: "Initial Verification",
    submittedDate: "2023-04-11T16:30:00Z",
    priority: "High",
    documentCount: 9,
    status: "Pending",
  },
]

export function VerificationQueue() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const totalPages = Math.ceil(mockVerifications.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = mockVerifications.slice(startIndex, endIndex)

  return (
    <div>
      <div className="space-y-4">
        {currentItems.map((verification) => (
          <MSMEVerificationCard key={verification.id} verification={verification} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, mockVerifications.length)} of {mockVerifications.length}{" "}
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
