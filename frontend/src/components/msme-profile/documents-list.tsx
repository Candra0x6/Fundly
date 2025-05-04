

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Plus, Trash2, Upload, Download, File, X } from "lucide-react"
import { Document, DocumentType } from "@declarations/msme_registration/msme_registration.did"
import { useFileUpload } from "@/hooks/useFileUpload"
import { getSession } from "@/utility/session"
import { useMsmeActor } from "@/utility/actors/msmeActor"
interface DocumentsListProps {
  documents: Document[]
  onUpdate: (documents: Document[]) => void
}

export default function DocumentsList({ documents = [], onUpdate }: DocumentsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const msmeId = getSession("msme_id")
  const msmeActor = useMsmeActor()
  const {
    uploadState: {
      progress,
      status,
      isUploading,
      preview,
      reset,
      assetId
    },
    uploadFile,
  } = useFileUpload()

  const handleAddDocument = async () => {
    if (!documentFile || !documentName.trim()) return
    const result = await uploadFile(documentFile, {
      entityId: msmeId,
      documentType: "Document",
      documentName: documentName.trim(),
      description: "Document"
    })

    const newDocument: Document = {
      id: result?.assetId || "",
      verified: false,
      assetId: result?.assetId || "",
      name: documentName.trim() || "",
      assetCanisterId: [],
      docType: { Other: documentFile.type },
      uploadDate: BigInt(Date.now()),
    }

    await msmeActor.addDocument(msmeId, documentName.trim(), newDocument.docType, result?.assetId || "")
    onUpdate([...documents, newDocument])
    setIsDialogOpen(false)
    setDocumentName("")
    setDocumentFile(null)
  }

  const handleDeleteDocument = (index: number) => {
    const updatedDocuments = [...documents]
    updatedDocuments.splice(index, 1)
    onUpdate(updatedDocuments)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0])
      if (!documentName) {
        setDocumentName(e.target.files[0].name)
      }
    }
  }

  const getFileIcon = (fileName: string) => {
    if (!fileName) return <File className="h-10 w-10 text-gray-500" />

    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />
      case "doc":
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "xls":
      case "xlsx":
        return <FileText className="h-10 w-10 text-green-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileText className="h-10 w-10 text-purple-500" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
    }
  }

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get the file size from the document if possible
  const getDocumentSize = (doc: Document) => {
    if (doc.assetId && doc.assetId.startsWith('blob:')) {
      // For newly uploaded files, we might have access to the File object
      return 'Unknown size';
    }
    return 'Unknown size';
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {documents.map((doc, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">{getFileIcon(doc.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getDocumentSize(doc)} •
                      {new Date(Number(doc.uploadDate)).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input
                id="document-name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>

            <div className="space-y-2">
              <Label>Document File</Label>
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {documentFile ? (
                    <div className="text-center">
                      <FileText className="h-10 w-10 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium">{documentFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(documentFile.size)}</p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => setDocumentFile(null)}>
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload document</p>
                      <Input type="file" className="hidden" id="document-upload" onChange={handleFileChange} />
                      <Label
                        htmlFor="document-upload"
                        className="mt-2 cursor-pointer rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                      >
                        Select File
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDocument} disabled={!documentFile || !documentName.trim()}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
