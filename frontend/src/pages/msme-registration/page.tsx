"use client"

import { useState } from "react"
import { RegistrationLayout } from "@/components/msme-registration/registration-layout"
import { BusinessDetailsForm } from "@/components/msme-registration/business-details-form"
import { ContactInformationForm } from "@/components/msme-registration/contact-information-form"
import { FinancialInformationForm } from "@/components/msme-registration/financial-information-form"
import { TeamMembersForm } from "@/components/msme-registration/team-members-form"
import { DocumentUploadForm } from "@/components/msme-registration/document-upload-form"
import { RegistrationReview } from "@/components/msme-registration/registration-review"
import { VerificationRequirements } from "@/components/msme-registration/verification-requirements"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function MSMERegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessDetails: {
      name: "",
      type: "",
      industry: "",
      foundingDate: "",
      description: "",
      logo: null,
      coverImage: null,
    },
    contactInformation: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phone: "",
      email: "",
      website: "",
    },
    financialInformation: {
      annualRevenue: "",
      employeeCount: "",
      fundingStage: "",
      investmentSought: "",
      useOfFunds: "",
    },
    teamMembers: [],
    documents: [],
  })

  const totalSteps = 6

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const saveDraft = () => {
    // In a real app, this would save to a database or local storage
    localStorage.setItem("msmeRegistrationDraft", JSON.stringify(formData))
    toast.success("Draft Saved")
  }

  const submitRegistration = () => {
    // In a real app, this would submit to an API
    console.log("Submitting registration:", formData)
    toast.success("Registration Submitted")
    window.location.href = "/dashboad/msme"
    // Redirect to confirmation page or dashboard
    // router.push('/msme-registration/confirmation')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessDetailsForm
            data={formData.businessDetails}
            updateData={(data) => updateFormData("businessDetails", data)}
          />
        )
      case 2:
        return (
          <ContactInformationForm
            data={formData.contactInformation}
            updateData={(data) => updateFormData("contactInformation", data)}
          />
        )
      case 3:
        return (
          <FinancialInformationForm
            data={formData.financialInformation}
            updateData={(data) => updateFormData("financialInformation", data)}
          />
        )
      case 4:
        return (
          <TeamMembersForm
            data={formData.teamMembers}
            updateData={(data) => setFormData({ ...formData, teamMembers: data })}
          />
        )
      case 5:
        return (
          <DocumentUploadForm
            data={formData.documents}
            updateData={(data) => setFormData({ ...formData, documents: data })}
          />
        )
      case 6:
        return <RegistrationReview formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MSME Registration</h1>
          <p className="text-lg text-gray-600">
            Register your business as an MSME to access funding opportunities and benefits
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <RegistrationLayout currentStep={currentStep} totalSteps={totalSteps}>
            <div className="p-6">{renderStep()}</div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <div>
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={saveDraft}>
                  Save Draft
                </Button>
                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700">
                    Continue
                  </Button>
                ) : (
                  <Button onClick={submitRegistration} className="bg-emerald-600 hover:bg-emerald-700">
                    Submit Registration
                  </Button>
                )}
              </div>
            </div>
          </RegistrationLayout>
        </div>

        <div className="mt-12">
          <VerificationRequirements />
        </div>
      </div>
    </div>
  )
}
