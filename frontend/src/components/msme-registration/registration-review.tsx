"use client"
import { FileText, User, Building, Phone, DollarSign, FileCheck } from "lucide-react"

interface RegistrationReviewProps {
  formData: {
    businessDetails: {
      name: string
      type: string
      industry: string
      foundingDate: string
      description: string
      logo: any
      coverImage: any
    }
    contactInformation: {
      address: string
      city: string
      state: string
      postalCode: string
      country: string
      phone: string
      email: string
      website: string
    }
    financialInformation: {
      annualRevenue: string
      employeeCount: string
      fundingStage: string
      investmentSought: string
      useOfFunds: string
    }
    teamMembers: any[]
    documents: any[]
  }
}

export function RegistrationReview({ formData }: RegistrationReviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided"
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (value: string) => {
    if (!value) return "Not provided"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const getRequiredDocumentStatus = () => {
    const requiredDocTypes = [
      "business_registration",
      "tax_certificate",
      "financial_statements",
      "business_plan",
      "id_proof",
    ]

    const uploadedRequiredDocs = formData.documents.filter((doc) => requiredDocTypes.includes(doc.type))

    return {
      total: requiredDocTypes.length,
      uploaded: uploadedRequiredDocs.length,
      complete: uploadedRequiredDocs.length === requiredDocTypes.length,
    }
  }

  const documentStatus = getRequiredDocumentStatus()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>
        <p className="text-gray-600 mt-1">Please review all information before submitting your MSME registration</p>
      </div>

      <div className="space-y-6">
        {/* Business Details Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
            <Building className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-medium text-gray-900">Business Details</h3>
          </div>
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.businessDetails.name || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Business Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.businessDetails.type || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.businessDetails.industry || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Founding Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(formData.businessDetails.foundingDate)}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Business Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.businessDetails.description || "Not provided"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
            <Phone className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.address || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">City</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.city || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">State/Province</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.state || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Postal/ZIP Code</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.contactInformation.postalCode || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Country</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.country || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.email || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="mt-1 text-sm text-gray-900">{formData.contactInformation.website || "Not provided"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
            <DollarSign className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-medium text-gray-900">Financial Information</h3>
          </div>
          <div className="p-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Annual Revenue</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatCurrency(formData.financialInformation.annualRevenue)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Number of Employees</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.financialInformation.employeeCount || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Funding Stage</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.financialInformation.fundingStage || "Not provided"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Investment Sought</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.financialInformation.investmentSought
                    ? formatCurrency(formData.financialInformation.investmentSought)
                    : "Not provided"}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Use of Funds</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formData.financialInformation.useOfFunds || "Not provided"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
            <User className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-medium text-gray-900">Team Members</h3>
          </div>
          <div className="p-4">
            {formData.teamMembers.length === 0 ? (
              <p className="text-sm text-gray-500">No team members added</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-md p-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {member.photoPreview ? (
                          <img
                            src={member.photoPreview || "/placeholder.svg"}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-2 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                        <p className="text-xs text-gray-500">{member.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b flex items-center">
            <FileText className="h-5 w-5 text-emerald-600 mr-2" />
            <h3 className="font-medium text-gray-900">Documents</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    documentStatus.complete ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">
                    Required Documents: {documentStatus.uploaded} of {documentStatus.total} uploaded
                  </h4>
                  <p className="text-xs text-gray-500">
                    {documentStatus.complete
                      ? "All required documents have been uploaded"
                      : "Some required documents are missing"}
                  </p>
                </div>
              </div>
            </div>

            {formData.documents.length === 0 ? (
              <p className="text-sm text-gray-500">No documents uploaded</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {formData.documents.map((doc) => (
                  <li key={doc.id} className="py-3 flex justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.file.name}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.isRequired ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {doc.isRequired ? "Required" : "Optional"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  By submitting this registration, you confirm that all information provided is accurate and complete.
                  False information may result in rejection of your MSME registration or legal consequences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
