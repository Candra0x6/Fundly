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
import { MSME } from "@declarations/msme_registration/msme_registration.did"
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useAssetPreview } from "@/hooks/useAssetPreview"
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { formatDate } from "@/utility/converts/formatDate"

interface MSMEDocumentsProps {
  msme: MSME
}

export default function MSMEDocuments({ msme }: MSMEDocumentsProps) {
  const [zoomLevel, setZoomLevel] = useState(100)
  const [selectedDocument, setSelectedDocument] = useState("1")
  const [commentText, setCommentText] = useState("")
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // This would normally be fetched from an API based on the ID


  const selectedDoc = msme.documents.find((doc) => doc.id === selectedDocument) || msme.documents[0]
  const { previewUrl } = useAssetPreview(selectedDoc.assetId)




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
              {msme.documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedDocument === doc.id
                    ? "bg-emerald-50 border border-emerald-200"
                    : "hover:bg-zinc-50 border border-transparent"
                    }`}
                  onClick={() => setSelectedDocument(doc.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedDocument === doc.id ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-500"
                        }`}
                    >
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{doc.name}</h3>
                        <Badge
                          className={`ml-2 flex-shrink-0 ${doc.verified ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {doc.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-xs text-zinc-500 mt-1">
                        <span>{Object.keys(doc.docType)}</span>
                        <span className="mx-1">•</span>
                        <span className="mx-1">•</span>
                        <span>Uploaded {formatDate(doc.uploadDate)}</span>
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
          </TabsList>

          <TabsContent value="viewer">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{selectedDoc.name}</CardTitle>

              </CardHeader>
              <CardContent>
                <div style={{ height: '750px' }}>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    {previewUrl && (
                      <Viewer
                        fileUrl={previewUrl}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={zoomLevel / 100}
                      />
                    )}
                  </Worker>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
