"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, CheckCircle, XCircle } from "lucide-react"

interface DocumentReviewerProps {
  msmeId: string
}

// Mock document data
const mockDocuments = [
  {
    id: "doc-1",
    name: "Business Registration Certificate",
    type: "PDF",
    size: "1.2 MB",
    uploadDate: "2023-04-10",
    category: "Legal",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-2",
    name: "Tax Compliance Certificate",
    type: "PDF",
    size: "0.8 MB",
    uploadDate: "2023-04-10",
    category: "Legal",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-3",
    name: "Business Plan",
    type: "PDF",
    size: "2.5 MB",
    uploadDate: "2023-04-11",
    category: "Business",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-4",
    name: "Financial Statements",
    type: "PDF",
    size: "1.7 MB",
    uploadDate: "2023-04-12",
    category: "Financial",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
  {
    id: "doc-5",
    name: "Owner Identification",
    type: "JPG",
    size: "0.5 MB",
    uploadDate: "2023-04-10",
    category: "Identity",
    status: "pending",
    url: "/placeholder.svg?height=800&width=600",
  },
]

export function DocumentReviewer({ msmeId }: DocumentReviewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, string>>(
    mockDocuments.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.status }), {}),
  )

  const currentDocument = selectedDocument ? mockDocuments.find((doc) => doc.id === selectedDocument) : null

  const handleApproveDocument = (docId: string) => {
    setDocumentStatuses((prev) => ({ ...prev, [docId]: "approved" }))
  }

  const handleRejectDocument = (docId: string) => {
    setDocumentStatuses((prev) => ({ ...prev, [docId]: "rejected" }))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Document Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="documents">All Documents ({mockDocuments.length})</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {mockDocuments.map((doc) => (
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
          </TabsContent>

          <TabsContent value="legal">
            <div className="grid grid-cols-1 gap-4">
              {mockDocuments
                .filter((doc) => doc.category === "Legal")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
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
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {doc.type} • {doc.size}
                          </span>
                          <span>Uploaded: {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(documentStatuses[doc.id])}
                      <Button variant="outline" size="sm" className="ml-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          {/* Similar content for other tabs */}
          <TabsContent value="financial">
            <div className="grid grid-cols-1 gap-4">
              {mockDocuments
                .filter((doc) => doc.category === "Financial")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
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
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {doc.type} • {doc.size}
                          </span>
                          <span>Uploaded: {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(documentStatuses[doc.id])}
                      <Button variant="outline" size="sm" className="ml-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="identity">
            <div className="grid grid-cols-1 gap-4">
              {mockDocuments
                .filter((doc) => doc.category === "Identity")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
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
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {doc.type} • {doc.size}
                          </span>
                          <span>Uploaded: {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(documentStatuses[doc.id])}
                      <Button variant="outline" size="sm" className="ml-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedDocument && currentDocument && (
          <div className="mt-8 border-t pt-6 dark:border-gray-700">
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
                Reject Document
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
