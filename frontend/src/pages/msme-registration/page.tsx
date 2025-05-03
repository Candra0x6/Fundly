"use client"

import { useState, useEffect } from "react"
import { RegistrationLayout } from "@/components/msme-registration/registration-layout"
import { BusinessDetailsForm, BusinessDetailsFormData } from "@/components/msme-registration/business-details-form"
import { ContactInformationForm, ContactInformationFormData } from "@/components/msme-registration/contact-information-form"
import { TeamMember, TeamMembersForm } from "@/components/msme-registration/team-members-form"
import { Document } from "@/components/msme-registration/document-upload-form"
import { RegistrationReview } from "@/components/msme-registration/registration-review"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { FinancialInformationForm, FinancialInformationFormData } from "@/components/msme-registration/financial-information-form"

import { useMsmeActor } from "@/utility/actors/msmeActor"
import { useAuth } from "@/utility/use-auth-client"
import { getSession, setSession } from "@/utility/session"
import { UserRole } from "@declarations/authentication/authentication.did"
import { useNavigate } from "react-router-dom"
import { Principal } from "@dfinity/principal"
import { useTokenActor } from "@/utility/actors/tokenActor"
// Define types for form data
export interface MSMERegistrationFormData {
  businessDetails: BusinessDetailsFormData
  contactInformation: ContactInformationFormData
  financialInformation: FinancialInformationFormData
  teamMembers: TeamMember[]
  documents: Document[]
}

export default function MSMERegistrationPage() {
  const msmeActor = useMsmeActor()
  const tokenActor = useTokenActor()
  const { principal } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<MSMERegistrationFormData>({
    businessDetails: {
      name: "",
      type: "",
      industry: [],
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
      annualRevenue: 0,
      employeeCount: 0,
      fundingGoal: 0,
      fundingPurpose: "",
    },
    teamMembers: [],
    documents: [],
  })

  // Load saved draft data when component mounts
  useEffect(() => {
    const savedDraft = localStorage.getItem("msmeRegistrationDraft")

    if (savedDraft) {
      try {
        const parsedData = JSON.parse(savedDraft) as MSMERegistrationFormData

        // Merge saved data with default structure to handle any missing fields
        const mergedData = {
          businessDetails: {
            ...formData.businessDetails,
            ...parsedData.businessDetails,
          },
          contactInformation: {
            ...formData.contactInformation,
            ...parsedData.contactInformation,
          },
          financialInformation: {
            ...formData.financialInformation,
            ...parsedData.financialInformation,
          },
          teamMembers: parsedData.teamMembers || [],
          documents: parsedData.documents || [],
        }

        setFormData(mergedData)
        toast.success("Loaded saved draft")
      } catch (error) {
        console.error("Error loading draft:", error)
        toast.error("Failed to load saved draft")
      }
    }
  }, [])

  const totalSteps = 5

  const updateFormData = <T extends keyof MSMERegistrationFormData>(section: T, data: Partial<MSMERegistrationFormData[T]>) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }))
  }

  const handleNext = () => {
    // Save draft before proceeding to next step

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
    localStorage.setItem("msmeRegistrationDraft", JSON.stringify(formData))
    toast.success("Draft Saved")
  }

  const submitRegistration = async () => {
    try {
      // Format document data for the backend
      const formatDocument = (doc: any): any => {
        if (!doc) {
          return {
            id: "",
            name: "",
            docType: { Other: "None" },
            assetCanisterId: [],
            assetId: doc?.assetId || "",
            uploadDate: BigInt(Date.now() * 1000000), // Convert to nanoseconds
            verified: false
          };
        }

        return {
          id: doc.id || "",
          name: doc.name || "",
          docType: doc.type === "logo" ? { BusinessLogo: null } :
            doc.type === "cover" ? { BusinessCoverImage: null } :
              doc.type === "image" ? { TeamMemberImage: null } :
                { Other: doc.type || "" },
          assetCanisterId: [],
          assetId: doc.assetId || "",
          uploadDate: BigInt(Date.now() * 1000000), // Convert to nanoseconds
          verified: false
        };
      };

      // Create optional value for website
      const websiteOpt: [] | [string] = formData.contactInformation.website && formData.contactInformation.website.trim() !== ""
        ? [formData.contactInformation.website]
        : [];

      // Convert numbers to BigInt as expected by the backend
      const annualRevenue = BigInt(Number(formData.financialInformation.annualRevenue) || 0);
      const employeeCount = BigInt(Number(formData.financialInformation.employeeCount) || 0);
      const fundingGoal = BigInt(Number(formData.financialInformation.fundingGoal) || 0);

      // Format team members data
      const teamMembers = formData.teamMembers.map(member => ({
        name: member.name,
        position: member.position,
        email: member.email,
        bio: member.bio,
        image: formatDocument(member.photo)
      }));

      // Format date to BigInt nanoseconds
      const foundingDate = formData.businessDetails.foundingDate
        ? BigInt(new Date(formData.businessDetails.foundingDate).getTime() * 1000000)
        : BigInt(Date.now() * 1000000);

      // Owner is needed in BusinessDetails
      const owner = principal

      const registrationResult = await msmeActor.registerMSME(
        {
          details: {
            name: formData.businessDetails.name,
            owner: owner as Principal,
            focusArea: formData.businessDetails.type, // Using type as focusArea
            industry: formData.businessDetails.industry,
            foundingDate: foundingDate,
            description: formData.businessDetails.description,
            logo: formatDocument(formData.businessDetails.logo),
            coverImage: formatDocument(formData.businessDetails.coverImage)
          },
          contactInfo: {
            streetAddress: formData.contactInformation.address,
            city: formData.contactInformation.city,
            state: formData.contactInformation.state,
            country: formData.contactInformation.country,
            postalCode: formData.contactInformation.postalCode,
            email: formData.contactInformation.email,
            phone: formData.contactInformation.phone,
            website: websiteOpt
          },
          financialInfo: {
            annualRevenue: annualRevenue,
            employeeCount: employeeCount,
            fundingGoal: fundingGoal,
            fundingPurpose: formData.financialInformation.fundingPurpose,
          },
          industry: formData.businessDetails.industry,
          teamMembers: teamMembers,
        },
        { MSME: null } as unknown as UserRole
      );


      if ('ok' in registrationResult) {
        setSession("msme_id", registrationResult.ok);
        tokenActor.mint({
          owner: principal as Principal,
          subaccount: []
        }, BigInt(formData.financialInformation.annualRevenue))
        toast.success("MSME registered successfully!");
        navigate("/msme-registration/documents");
      } else {
        console.error("Registration error:", registrationResult.err);
        toast.error(`Registration failed: ${JSON.stringify(registrationResult.err)}`);
      }

    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Error submitting registration");
    }
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
        return <RegistrationReview formData={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-5xl mx-auto">
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
      </div>
    </div>
  )
}
