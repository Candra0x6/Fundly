import { DocumentUploadForm } from '@/components/msme-registration/document-upload-form'
import { Button } from '@/components/ui/button'
import { LucideFileQuestion } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React from 'react'

function DocumentsPage() {


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Document Upload</h1>
          <p className="text-lg text-gray-600">
            Upload your documents to verify your business
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-10">

          <DocumentUploadForm />
        </div>
      </div>

    </div>
  )
}

export default DocumentsPage