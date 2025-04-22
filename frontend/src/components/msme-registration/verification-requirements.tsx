import { CheckCircle, AlertCircle } from "lucide-react"

export function VerificationRequirements() {
  const requiredDocuments = [
    {
      name: "Business Registration Certificate",
      description: "Official document proving your business is legally registered",
      tips: "Must be current and not expired",
    },
    {
      name: "Tax Compliance Certificate",
      description: "Proof that your business is compliant with tax regulations",
      tips: "Should be issued within the last 6 months",
    },
    {
      name: "Financial Statements",
      description: "Balance sheets, income statements, and cash flow statements",
      tips: "Last 2 years of financial records, preferably audited",
    },
    {
      name: "Business Plan",
      description: "Detailed plan outlining your business goals and strategies",
      tips: "Should include market analysis, financial projections, and growth strategy",
    },
    {
      name: "ID Proof of Directors/Owners",
      description: "Government-issued identification of all key stakeholders",
      tips: "Must be valid and not expired",
    },
  ]

  const verificationProcess = [
    {
      step: 1,
      title: "Submit Registration",
      description: "Complete all required fields and upload necessary documents",
    },
    {
      step: 2,
      title: "Initial Review",
      description: "Our team reviews your submission for completeness (1-2 business days)",
    },
    {
      step: 3,
      title: "Document Verification",
      description: "Documents are verified for authenticity (3-5 business days)",
    },
    {
      step: 4,
      title: "Business Assessment",
      description: "Evaluation of business viability and MSME qualification (5-7 business days)",
    },
    {
      step: 5,
      title: "Final Approval",
      description: "Final decision on MSME registration and certification",
    },
  ]

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-emerald-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">MSME Verification Requirements</h2>
        <p className="text-emerald-100 mt-1">Understanding what's needed for successful verification</p>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Required Documents</h3>
          <div className="space-y-4">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="ml-3">
                  <h4 className="text-base font-medium text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    <span className="font-medium">Tip:</span> {doc.tips}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Process</h3>
          <ol className="relative border-l border-gray-200 ml-3 space-y-6">
            {verificationProcess.map((process) => (
              <li key={process.step} className="ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full -left-4 ring-4 ring-white">
                  <span className="text-emerald-600 font-medium text-sm">{process.step}</span>
                </span>
                <h4 className="text-base font-medium text-gray-900">{process.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{process.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Important Information</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  The verification process typically takes 10-14 business days to complete. You will receive email
                  updates at each stage of the process. If additional information is required, our team will contact you
                  directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
