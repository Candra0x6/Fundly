"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Upload, X, Eye, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Document {
  id: string
  name: string
  file: File
  type: string
  description: string
  isRequired: boolean
  dateUploaded: string
}

interface DocumentUploadFormProps {
  data: Document[]
  updateData: (data: Document[]) => void
}

export function DocumentUploadForm({ data, updateData }: DocumentUploadFormProps) {
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const requiredDocuments = [
    { type: "business_registration", name: "Business Registration Certificate", isRequired: true },
    { type: "tax_certificate", name: "Tax Compliance Certificate", isRequired: true },
    { type: "financial_statements", name: "Financial Statements (Last 2 Years)", isRequired: true },
    { type: "business_plan", name: "Business Plan", isRequired: true },
    { type: "id_proof", name: "ID Proof of Directors/Owners", isRequired: true },
    { type: "bank_statements", name: "Bank Statements (Last 6 Months)", isRequired: false },
    { type: "licenses", name: "Industry-specific Licenses", isRequired: false },
    { type: "other", name: "Other Supporting Documents", isRequired: false },
  ]

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string,
    docName: string,
    isRequired: boolean,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Check if document of this type already exists
      const existingDocIndex = data.findIndex((doc) => doc.type === docType)

      const newDoc = {
        id: Date.now().toString(),
        name: docName,
        file: file,
        type: docType,
        description: "",
        isRequired,
        dateUploaded: new Date().toISOString(),
      }

      if (existingDocIndex >= 0) {
        // Replace existing document
        const updatedDocs = [...data]
        updatedDocs[existingDocIndex] = newDoc
        updateData(updatedDocs)
      } else {
        // Add new document
        updateData([...data, newDoc])
      }
    }
  }

  const handleRemoveDocument = (docType: string) => {
    updateData(data.filter((doc) => doc.type !== docType))
  }

  const handlePreviewDocument = (doc: Document) => {
    setPreviewDocument(doc)

    // Create object URL for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string)
        setIsPreviewOpen(true)
      }
    }
    reader.readAsDataURL(doc.file)
  }

  const getDocumentByType = (type: string) => {
    return data.find((doc) => doc.type === type)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return <img src="/placeholder.svg?height=40&width=40" alt="Preview" className="h-10 w-10 object-cover" />
    }

    return <FileText className="h-10 w-10 text-gray-400" />
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="text-gray-600 mt-1">Upload required documents for MSME verification</p>
      </div>

      <div className="space-y-6">
        {requiredDocuments.map((doc) => {
          const uploadedDoc = getDocumentByType(doc.type)

          return (
            <div key={doc.type} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    {uploadedDoc ? (
                      getFileIcon(uploadedDoc.file.name)
                    ) : (
                      <FileText className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {doc.name}
                      {doc.isRequired && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    {uploadedDoc ? (
                      <p className="text-sm text-gray-500">
                        {uploadedDoc.file.name} ({Math.round(uploadedDoc.file.size / 1024)} KB)
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No file uploaded {doc.isRequired ? "(Required)" : "(Optional)"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {uploadedDoc && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handlePreviewDocument(uploadedDoc)}>
                        <Eye className="h-4 w-4 mr-1" /> Preview
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveDocument(doc.type)}
                      >
                        <X className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    </>
                  )}

                  <label
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer ${
                      uploadedDoc
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    {uploadedDoc ? "Replace" : "Upload"}
                    <Input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, doc.type, doc.name, doc.isRequired)}
                    />
                  </label>
                </div>
              </div>

              {uploadedDoc && (
                <div className="mt-3 text-xs text-gray-500">
                  Uploaded on {new Date(uploadedDoc.dateUploaded).toLocaleDateString()}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-start space-x-2">
        <Checkbox id="terms" />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that all uploaded documents are authentic and accurate
          </Label>
          <p className="text-sm text-gray-500">False information may result in rejection of your MSME registration</p>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>

          {previewDocument && previewUrl && (
            <div className="mt-4">
              <div className="mb-4">
                <h3 className="font-medium">{previewDocument.name}</h3>
                <p className="text-sm text-gray-500">
                  {previewDocument.file.name} ({Math.round(previewDocument.file.size / 1024)} KB)
                </p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                {previewDocument.file.type.startsWith("image/") ? (
                  <img src={previewUrl || "/placeholder.svg"} alt={previewDocument.name} className="max-h-96 mx-auto" />
                ) : previewDocument.file.type === "application/pdf" ? (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">PDF Preview not available</p>
                      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                        <Download className="h-4 w-4 mr-2" /> Download to View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">Preview not available for this file type</p>
                      <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700">
                        <Download className="h-4 w-4 mr-2" /> Download to View
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
