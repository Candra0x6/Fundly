"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, CheckCircle, XCircle } from "lucide-react"

interface SupportingDocumentViewerProps {
  reportId: string
}

// Mock supporting documents
const supportingDocuments = [
  {
    id: "doc-1",
    name: "Sales Receipts - April",
    type: "PDF",
    size: "1.5 MB",
    uploadDate: "2023-07-08",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-2",
    name: "Sales Receipts - May",
    type: "PDF",
    size: "1.7 MB",
    uploadDate: "2023-07-08",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-3",
    name: "Sales Receipts - June",
    type: "PDF",
    size: "1.6 MB",
    uploadDate: "2023-07-08",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-4",
    name: "Bank Statements - Q2",
    type: "PDF",
    size: "2.3 MB",
    uploadDate: "2023-07-09",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-5",
    name: "Expense Report - Q2",
    type: "PDF",
    size: "1.8 MB",
    uploadDate: "2023-07-09",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
]

export function SupportingDocumentViewer({ reportId }: SupportingDocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, string>>(
    supportingDocuments.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.status }), {}),
  )

  const currentDocument = selectedDocument ? supportingDocuments.find((doc) => doc.id === selectedDocument) : null

  const handleApproveDocument = (docId: string) => {
    setDocumentStatuses((prev) => ({ ...prev, [docId]: "approved" }))
  }

  const handleRejectDocument = (docId: string) => {
    setDocumentStatuses((prev) => ({ ...prev, [docId]: "rejected" }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Rejected
          </span>
        )
      default:
        return (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </span>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Supporting Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 mb-6">
          {supportingDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                selectedDocument === doc.id
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedDocument(doc.id)}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {doc.type} • {doc.size}
                    </span>
                    <span>Uploaded: {doc.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {getStatusBadge(documentStatuses[doc.id])}
                <Button variant="outline" size="sm" className="ml-2">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {selectedDocument && currentDocument && (
          <div className="border-t pt-6 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentDocument.name}</h3>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mb-6">
              <div className="aspect-[4/3] relative">
                <img
                  src={currentDocument.url || "/placeholder.svg"}
                  alt={currentDocument.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={() => handleRejectDocument(currentDocument.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Flag Document
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleApproveDocument(currentDocument.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Document
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
