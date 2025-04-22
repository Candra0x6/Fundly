"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Upload,
  Download,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: string
  url: string
}

interface DocumentsListProps {
  documents: Document[]
  isEditing: boolean
}

export default function DocumentsList({ documents, isEditing }: DocumentsListProps) {
  const [docs, setDocs] = useState<Document[]>(documents)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "PDF",
    file: null as File | null,
  })

  const filteredDocs = docs.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDeleteDocument = (id: string) => {
    // In a real app, this would delete the document from the backend
    setDocs(docs.filter((doc) => doc.id !== id))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setNewDocument({
        ...newDocument,
        name: file.name,
        type: file.type.split("/")[1].toUpperCase(),
        file: file,
      })
    }
  }

  const handleUploadDocument = () => {
    if (newDocument.file && newDocument.name) {
      // In a real app, this would upload the file to a server and get a URL back
      const newDoc: Document = {
        id: `new-${Date.now()}`,
        name: newDocument.name,
        type: newDocument.type,
        size: `${(newDocument.file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "pending",
        url: "#",
      }

      setDocs([...docs, newDoc])
      setShowUploadDialog(false)
      setNewDocument({
        name: "",
        type: "PDF",
        file: null,
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-200">
            {status}
          </Badge>
        )
    }
  }

  const getDocumentIcon = (type: string) => {
    // In a real app, you might have different icons for different file types
    return <FileText className="h-5 w-5 text-emerald-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Business Documents</h2>
          <p className="text-zinc-500">Verification and legal documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Search documents..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          {isEditing && (
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="document-name">Document Name</Label>
                      <Input
                        id="document-name"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                        placeholder="Enter document name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="document-type">Document Type</Label>
                      <Select
                        value={newDocument.type}
                        onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PDF">PDF</SelectItem>
                          <SelectItem value="DOC">DOC</SelectItem>
                          <SelectItem value="XLS">XLS</SelectItem>
                          <SelectItem value="JPG">JPG</SelectItem>
                          <SelectItem value="PNG">PNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="document-file">File</Label>
                      <div className="mt-1">
                        <label
                          htmlFor="document-file"
                          className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-dashed rounded-md appearance-none cursor-pointer hover:border-emerald-400 focus:outline-none border-zinc-200"
                        >
                          <span className="flex items-center space-x-2">
                            <Upload className="w-6 h-6 text-zinc-500" />
                            <span className="text-sm text-zinc-500">
                              {newDocument.file ? newDocument.file.name : "Click to upload or drag and drop"}
                            </span>
                          </span>
                          <input id="document-file" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-emerald-500 hover:bg-emerald-600"
                      onClick={handleUploadDocument}
                      disabled={!newDocument.file || !newDocument.name}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-zinc-500">No documents found</p>
          {isEditing && (
            <Button className="bg-emerald-500 hover:bg-emerald-600 mt-4" onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    {isEditing && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
