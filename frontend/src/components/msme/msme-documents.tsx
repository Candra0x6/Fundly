"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Plus,
  Send,
  Search,
  Filter,
} from "lucide-react"

interface MSMEDocumentsProps {
  msmeId: string
}

export default function MSMEDocuments({ msmeId }: MSMEDocumentsProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [selectedDocument, setSelectedDocument] = useState("1")
  const [commentText, setCommentText] = useState("")

  // This would normally be fetched from an API based on the ID
  const documents = [
    {
      id: "1",
      title: "Business Registration Certificate",
      type: "PDF",
      size: "2.4 MB",
      uploadDate: "2023-01-15",
      status: "approved",
      preview: "/placeholder.svg?height=800&width=600",
      metadata: {
        issueDate: "2018-05-10",
        expiryDate: "2028-05-10",
        issuingAuthority: "Singapore Business Registry",
        registrationNumber: "SG2018051001",
      },
      comments: [
        {
          id: "1",
          user: "John Verifier",
          role: "Document Verifier",
          date: "2023-01-20",
          text: "Registration certificate verified with Singapore Business Registry. All information matches our records.",
        },
      ],
      checklistItems: [
        { id: "1", text: "Document is legible", checked: true },
        { id: "2", text: "Business name matches application", checked: true },
        { id: "3", text: "Registration number is valid", checked: true },
        { id: "4", text: "Document is not expired", checked: true },
      ],
    },
    {
      id: "2",
      title: "Financial Statements (2022)",
      type: "PDF",
      size: "5.1 MB",
      uploadDate: "2023-01-15",
      status: "approved",
      preview: "/placeholder.svg?height=800&width=600",
      metadata: {
        reportingPeriod: "Jan 2022 - Dec 2022",
        auditedBy: "PwC Singapore",
        reportDate: "2023-01-10",
      },
      comments: [
        {
          id: "1",
          user: "Sarah Financial",
          role: "Financial Analyst",
          date: "2023-01-22",
          text: "Financial statements reviewed and verified. Company shows strong financial health with good growth trajectory.",
        },
        {
          id: "2",
          user: "Michael Auditor",
          role: "Senior Verifier",
          date: "2023-01-25",
          text: "Confirmed with PwC that these statements were audited by them. All checks pass.",
        },
      ],
      checklistItems: [
        { id: "1", text: "Document is legible", checked: true },
        { id: "2", text: "Financial statements are audited", checked: true },
        { id: "3", text: "Balance sheet is included", checked: true },
        { id: "4", text: "Income statement is included", checked: true },
        { id: "5", text: "Cash flow statement is included", checked: true },
      ],
    },
    {
      id: "3",
      title: "Business Plan",
      type: "PDF",
      size: "3.8 MB",
      uploadDate: "2023-01-15",
      status: "approved",
      preview: "/placeholder.svg?height=800&width=600",
      metadata: {
        version: "2.1",
        lastUpdated: "2022-12-05",
        timeframe: "2023-2027",
      },
      comments: [
        {
          id: "1",
          user: "David Strategy",
          role: "Business Analyst",
          date: "2023-01-28",
          text: "Comprehensive business plan with realistic projections and clear strategy. Market analysis is particularly strong.",
        },
      ],
      checklistItems: [
        { id: "1", text: "Executive summary included", checked: true },
        { id: "2", text: "Market analysis included", checked: true },
        { id: "3", text: "Financial projections included", checked: true },
        { id: "4", text: "Risk assessment included", checked: true },
      ],
    },
    {
      id: "4",
      title: "Patent Documentation",
      type: "PDF",
      size: "7.2 MB",
      uploadDate: "2023-01-15",
      status: "approved",
      preview: "/placeholder.svg?height=800&width=600",
      metadata: {
        patentNumbers: "SG12345, SG12346",
        filingDate: "2020-03-15",
        grantDate: "2021-06-22",
        jurisdiction: "Singapore",
      },
      comments: [
        {
          id: "1",
          user: "Lisa IP",
          role: "IP Specialist",
          date: "2023-01-30",
          text: "Patent documentation verified with Singapore IP Office. Patents are active and in good standing.",
        },
      ],
      checklistItems: [
        { id: "1", text: "Patent is active", checked: true },
        { id: "2", text: "Patent belongs to the company", checked: true },
        { id: "3", text: "Patent documentation is complete", checked: true },
      ],
    },
  ]

  const selectedDoc = documents.find((doc) => doc.id === selectedDocument) || documents[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Document List */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Documents</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDocument === doc.id
                      ? "bg-emerald-50 border border-emerald-200"
                      : "hover:bg-zinc-50 border border-transparent"
                  }`}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        selectedDocument === doc.id ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{doc.title}</h3>
                        <Badge
                          className={`ml-2 flex-shrink-0 ${
                            doc.status === "approved"
                              ? "bg-emerald-100 text-emerald-700"
                              : doc.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {doc.status === "approved" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : doc.status === "pending" ? (
                            <Clock className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-zinc-500 mt-1">
                        <span>{doc.type}</span>
                        <span className="mx-1">•</span>
                        <span>{doc.size}</span>
                        <span className="mx-1">•</span>
                        <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Viewer and Details */}
      <div className="md:col-span-2">
        <Tabs defaultValue="viewer">
          <TabsList className="mb-4">
            <TabsTrigger value="viewer">Document Viewer</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="checklist">Verification Checklist</TabsTrigger>
          </TabsList>

          <TabsContent value="viewer">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{selectedDoc.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{zoomLevel}%</span>
                  <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-100 rounded-lg overflow-auto h-[600px] flex items-center justify-center">
                  <div
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "center",
                      transition: "transform 0.2s",
                    }}
                  >
                    <img
                      src={selectedDoc.preview || "/placeholder.svg"}
                      alt={selectedDoc.title}
                      className="max-w-full border border-zinc-200 shadow-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Document Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedDoc.metadata).map(([key, value]) => (
                      <div key={key} className="bg-zinc-50 p-3 rounded-lg">
                        <p className="text-xs text-zinc-500 mb-1">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .replace(/([A-Z])/g, (match) => ` ${match}`)}
                        </p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg">
                    <p className="text-xs text-zinc-500 mb-1">Document Status</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${
                          selectedDoc.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedDoc.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedDoc.status === "approved" ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : selectedDoc.status === "pending" ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {selectedDoc.status.charAt(0).toUpperCase() + selectedDoc.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-lg">
                    <p className="text-xs text-zinc-500 mb-1">Upload Information</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500">Upload Date</p>
                        <p className="font-medium">{new Date(selectedDoc.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">File Type</p>
                        <p className="font-medium">{selectedDoc.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500">File Size</p>
                        <p className="font-medium">{selectedDoc.size}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Comments & Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDoc.comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-zinc-50 p-4 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-emerald-600 font-medium">{comment.user.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{comment.user}</span>
                              <span className="text-xs text-zinc-500 ml-2">{comment.role}</span>
                            </div>
                            <span className="text-xs text-zinc-500">{new Date(comment.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-zinc-600 mt-1">{comment.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="pt-4 border-t border-zinc-200">
                    <h4 className="text-sm font-medium mb-2">Add Comment</h4>
                    <div className="space-y-3">
                      <Textarea
                        placeholder="Add your comment or note about this document..."
                        className="min-h-[100px]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button className="bg-emerald-500 hover:bg-emerald-600" disabled={!commentText.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checklist">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Verification Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedDoc.checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center ${
                          item.checked ? "bg-emerald-100 text-emerald-600" : "bg-zinc-200 text-zinc-500"
                        }`}
                      >
                        {item.checked ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      </div>
                      <span className={item.checked ? "text-zinc-900" : "text-zinc-500"}>{item.text}</span>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-zinc-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Add Checklist Item</h4>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                    <Input placeholder="Enter new checklist item..." />
                  </div>

                  <div className="pt-4 border-t border-zinc-200">
                    <h4 className="text-sm font-medium mb-3">Document Verification</h4>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline" className="flex-1 border-yellow-200 text-yellow-600 hover:bg-yellow-50">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Request More Info
                      </Button>
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
