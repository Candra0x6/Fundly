import type { ReactNode } from "react"
import { StepIndicator } from "./step-indicator"

interface RegistrationLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
}

export function RegistrationLayout({ children, currentStep, totalSteps }: RegistrationLayoutProps) {
  const steps = [
    { id: 1, name: "Business Details" },
    { id: 2, name: "Contact Information" },
    { id: 3, name: "Financial Information" },
    { id: 4, name: "Team Members" },
    { id: 5, name: "Document Upload" },
    { id: 6, name: "Submit" },
  ]

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>
      {children}
    </div>
  )
}
