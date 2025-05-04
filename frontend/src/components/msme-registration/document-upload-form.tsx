

import type React from "react"

import { useCallback, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Upload, X, Eye, Download, LucideFileQuestion } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { uploadMSMEDocument } from "@/utility/uploadFile"
import toast from "react-hot-toast"
import { useMsmeActor } from "@/utility/actors/msmeActor"
import { useStorageActor } from "@/utility/actors/storageActor"
import { DocumentViewer } from "./document-viewer"
import { VerificationRequirementsDialog } from "./verification-requirements"
import { getSession } from "@/utility/session"
import { useNavigate } from "react-router-dom"
import { useVerificationWorkflowActor } from "@/utility/actors/verificationWorkflow"
import { DocumentType } from "@declarations/verification_workflow/verification_workflow.did"
export interface Document {
  id: string
  assetId: string
  name: string
  file: File
  type: string
  description: string
  isRequired: boolean
  dateUploaded: string
}


export function DocumentUploadForm() {
  const [formData, setFormData] = useState<{ documents: Document[] }>({
    documents: [],
  })

  const data = formData.documents
  const updateData = (data: Document[]) => {
    setFormData({ ...formData, documents: data })
  }
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedCount, setSubmittedCount] = useState<number>(0);
  const msmeActor = useMsmeActor()
  const storageActor = useStorageActor()
  const verificationActor = useVerificationWorkflowActor()
  const session = getSession("msme_id")
  const msmeId = session;
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

  const uploadFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, docType: string, docName: string, isRequired: boolean) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setUploadingType(docType);
      setStatus('Preparing upload...');
      setProgress(0);

      try {
        // Map from frontend document type to backend document type
        const backendDocType = docType === "business_registration"
          ? "BusinessRegistration"
          : docType === "financial_statements"
            ? "FinancialStatement"
            : docType === "tax_certificate"
              ? "TaxDocument"
              : docType === "business_plan"
                ? "BusinessPlan"
                : "Other";


        const result = await uploadMSMEDocument(
          msmeActor,
          storageActor,
          file,
          msmeId,
          backendDocType,
          (uploadProgress: number) => {
            setProgress(uploadProgress);
            setStatus(`Uploading: ${uploadProgress}%`);
          }
        );


        // Create document object with the backend-generated ID
        const newDoc = {
          id: result.assetId,
          assetId: result.assetId,
          name: docName,
          file: file,
          type: docType,
          description: "",
          isRequired,
          dateUploaded: new Date().toISOString(),
        };

        // Find if document of this type already exists
        const existingDocIndex = data.findIndex((doc) => doc.type === docType);

        if (existingDocIndex >= 0) {
          // Replace existing document
          const updatedDocs = [...data];
          updatedDocs[existingDocIndex] = newDoc;
          updateData(updatedDocs);
        } else {
          // Add new document

          updateData([...data, newDoc]);
        }

        toast.success(`Upload successful!`);
        setStatus(`Upload successful!`);
      } catch (error) {
        console.error("Error uploading document:", error);
        // @ts-ignore
        const errorMessage = error.message || "Unknown error occurred";
        toast.error(`Upload failed: ${errorMessage}`);
        setStatus(`Error: ${errorMessage}`);
      } finally {
        setProgress(0);
        setUploading(false);
        setUploadingType(null);
      }
    },
    [msmeActor, storageActor, data, updateData]
  );

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
        assetId: "",
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
        uploadFile(e, docType, docName, isRequired)
        updateData([...data, newDoc])
      }
    }
  }

  const handleRemoveDocument = (docType: string) => {
    updateData(data.filter((doc) => doc.type !== docType))
  }

  const getDocumentByType = (type: string) => {
    return data.find((doc) => doc.type === type)
  }

  const getDocumentType = (type: string) => {
    switch (type) {
      case "BusinessRegistration":
        return { BusinessRegistration: null };
      case "FinancialStatement":
        return { FinancialStatement: null };
      case "TaxDocument":
        return { TaxDocument: null };
      case "ImpactReport":
        return { ImpactReport: null };
      case "TeamProfile":
        return { TeamProfile: null };
      case "BusinessPlan":
        return { BusinessPlan: null };
      default:
        return { Other: type };
    }
  };
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    if (["jpg", "jpeg", "png", "gif"].includes(extension || "")) {
      return <img src="/placeholder.svg?height=40&width=40" alt="Preview" className="h-10 w-10 object-cover" />
    }

    return <FileText className="h-10 w-10 text-gray-400" />
  }



  const getAsset = async (id: string) => {
    const asset = await storageActor.getAsset(id)
    console.log(asset)
  }

  const submitDocuments = async () => {
    // Check if there are any documents to submit
    if (data.length === 0) {
      toast.error("Please upload at least one document before submitting");
      return;
    }

    // Check if all required documents are uploaded
    const missingRequiredDocs = requiredDocuments
      .filter(doc => doc.isRequired)
      .filter(doc => !data.some(uploadedDoc => uploadedDoc.type === doc.type));

    if (missingRequiredDocs.length > 0) {
      toast.error(`Missing required documents: ${missingRequiredDocs.map(d => d.name).join(', ')}`);
      return;
    }

    setSubmitting(true);
    setSubmittedCount(0);

    try {
      let successCount = 0;

      // Process each document
      for (const doc of data) {
        if (!doc.assetId) {
          continue; // Skip documents without an asset ID
        }

        try {
          setStatus(`Registering document: ${doc.name}...`);
          toast.loading(`Registering document: ${doc.name}...`);

          // Map from frontend document type to backend document type
          const backendDocType = doc.type === "business_registration"
            ? "BusinessRegistration"
            : doc.type === "financial_statements"
              ? "FinancialStatement"
              : doc.type === "tax_certificate"
                ? "TaxDocument"
                : doc.type === "business_plan"
                  ? "BusinessPlan"
                  : "Other";

          // Call the addDocument function in the MSME canister
          const addDocResult = await msmeActor.addDocument(
            msmeId,
            doc.name,
            getDocumentType(backendDocType),
            doc.assetId
          );

          if ('err' in addDocResult) {
            toast.dismiss();
            toast.error(`Failed to register document ${doc.name}: ${JSON.stringify(addDocResult.err)}`);
            throw new Error(`Failed to register document ${doc.name}: ${JSON.stringify(addDocResult.err)}`);
          }

          // Update the document with the new ID from the canister
          const updatedDocs = [...data];
          const docIndex = updatedDocs.findIndex(d => d.type === doc.type);
          if (docIndex !== -1) {
            updatedDocs[docIndex] = {
              ...updatedDocs[docIndex],
              id: addDocResult.ok
            };
          }

          updateData(updatedDocs);

          successCount++;
          toast.dismiss();
          toast.success(`Document registered successfully: ${doc.name}`);

        } catch (error) {
          console.error(`Error registering document ${doc.name}:`, error);
          toast.dismiss();
          // @ts-ignore
          toast.error(`Failed to register ${doc.name}: ${error.message || 'Unknown error'}`);
        }
      }

      setSubmittedCount(successCount);

      // Create verification request with properly mapped document types
      const createVerificationRequestResult = await verificationActor.createVerificationRequest(
        msmeId,
        data.map(doc => {
          // Map frontend document types to backend variant objects
          let docTypeVariant;

          switch (doc.type) {
            case "business_registration":
              docTypeVariant = { BusinessRegistration: null };
              break;
            case "financial_statements":
              docTypeVariant = { FinancialStatement: null };
              break;
            case "tax_certificate":
              docTypeVariant = { TaxDocument: null };
              break;
            case "business_plan":
              docTypeVariant = { BusinessPlan: null };
              break;
            case "id_proof":
              docTypeVariant = { Other: "ID_Proof" };
              break;
            case "bank_statements":
              docTypeVariant = { Other: "Bank_Statements" };
              break;
            case "licenses":
              docTypeVariant = { Other: "Licenses" };
              break;
            default:
              docTypeVariant = { Other: doc.type };
              break;
          }

          return {
            id: doc.id,
            name: doc.name,
            docType: docTypeVariant,
            uploadDate: BigInt(new Date(doc.dateUploaded).getTime()),
            verified: false,
            assetCanisterId: [],
            assetId: doc.assetId,
          };
        })
      );
      console.log(createVerificationRequestResult);

      if (successCount > 0) {
        if ('ok' in createVerificationRequestResult) {
          toast.success(`Successfully submitted ${successCount} document(s)`);
        } else {
          toast.error(`Failed to create verification request: ${JSON.stringify(createVerificationRequestResult.err)}`);
        }
      } else {
        toast.error("No documents were successfully submitted");
      }

    } catch (error) {
      console.error("Error during document submission:", error);
      // @ts-ignore
      toast.error(`Submission failed: ${error.message || 'Unknown error'}`);
    } finally {
      setStatus('');
      setSubmitting(false);
      window.location.href = "/dashboard/msme"
    }
  }
  // Update the buttons to use DocumentViewer
  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <div className="">

          <h2 onClick={() => getAsset("5")} className="text-2xl font-bold text-gray-900">Document Upload</h2>
          <p className="text-gray-600 mt-1">Upload required documents for MSME verification</p>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" className="hover:bg-emerald-50" >
              <LucideFileQuestion className="text-emerald-700" />
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0">
            <div className="">
              <DialogTitle className="bg-emerald-600 w-full rounded-t-lg p-7">
                <div className="flex justify-between items-center">
                  <h1 className="text-xl font-bold text-white">MSME Verification Requirements</h1>

                </div>
                <p className="text-emerald-100 mt-1">
                  Understanding what's needed for successful verification
                </p>
              </DialogTitle>
              <div className="px-7 pb-3">

                <VerificationRequirementsDialog />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {requiredDocuments.map((doc) => {
          const uploadedDoc = getDocumentByType(doc.type);
          const isUploading = uploading && uploadingType === doc.type;
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
                  {uploadedDoc && !isUploading && (
                    <>
                      {/* Use DocumentViewer for preview and download */}
                      <DocumentViewer
                        assetId={uploadedDoc.assetId}
                        documentName={uploadedDoc.name}
                        documentType={uploadedDoc.type}
                      />
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
                    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${isUploading ? "bg-gray-300 text-gray-700 cursor-not-allowed" :
                      uploadedDoc ? "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer" :
                        "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                      }`}
                  >
                    {isUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        {uploadedDoc ? "Replace" : "Upload"}
                      </>
                    )}
                    <Input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, doc.type, doc.name, doc.isRequired)}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {isUploading && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{status}</p>
                </div>
              )}

              {uploadedDoc && !isUploading && (
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
            <DialogTitle>Local File Preview</DialogTitle>
          </DialogHeader>

          {previewDocument && previewUrl && (
            <div className="mt-4">
              <div className="mb-4">
                <h3 className="font-medium">{previewDocument.name}</h3>
                {previewDocument.file && (
                  <p className="text-sm text-gray-500">
                    {previewDocument.file.name} ({Math.round(previewDocument.file.size / 1024)} KB)
                  </p>
                )}
              </div>

              <div className="border rounded-lg overflow-hidden">
                {previewUrl.startsWith('data:image/') ? (
                  <img src={previewUrl} alt={previewDocument.name} className="max-h-96 mx-auto" />
                ) : previewUrl.startsWith('data:application/pdf') ? (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">PDF Preview</p>
                      <Button
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => window.open(previewUrl)}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download to View
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-96 flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="mt-2 text-sm text-gray-600">Preview not available for this file type</p>
                      <Button
                        className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => window.open(previewUrl)}
                      >
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
      {submitting && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(submittedCount / data.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{status}</p>
        </div>
      )}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="hover:bg-emerald-700 hover:text-white bg-emerald-600 text-white px-20"
          onClick={submitDocuments}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
