

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, CheckCircle, XCircle } from "lucide-react"
import { Document } from "@declarations/msme_registration/msme_registration.did"
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { useAssetPreview } from "@/hooks/useAssetPreview"
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { formatDate } from "@/utility/converts/formatDate"
import { useVerificationWorkflowActor } from "@/utility/actors/verificationWorkflow"
import { toast } from "react-hot-toast"
interface DocumentReviewerProps {
  docs: Document
}



export function DocumentReviewer({ docs }: DocumentReviewerProps) {
  const documents = [docs]
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [zoomLevel, setZoomLevel] = useState(100)
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, string>>(
    documents.reduce((acc, doc) => ({ ...acc, [doc.id]: doc.verified }), {}),
  )


  const currentDocument = selectedDocument ? documents.find((doc) => doc.id === selectedDocument) : null

  const { previewUrl, downloadFile } = useAssetPreview(currentDocument?.assetId || "")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Document Review</CardTitle>
      </CardHeader>
      <CardContent className="lg:flex justify-between gap-5">
        <Tabs defaultValue="documents" className="w-[40rem]">
          <TabsList className="mb-4">
            <TabsTrigger value="documents">All Documents ({documents.length})</TabsTrigger>

          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedDocument === doc.id
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
                          {doc.assetId} • {doc.id}
                        </span>
                        <span>Uploaded: {formatDate(doc.uploadDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">

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

          <div className="mt-8 border-t pt-6 dark:border-gray-700 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{currentDocument.name}</h3>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" onClick={() => downloadFile()}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mb-6">
              <div className="aspect-[4/3] relative">
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
              </div>
            </div>


          </div>
        )}
      </CardContent>
    </Card>
  )
}
