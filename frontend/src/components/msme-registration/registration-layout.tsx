import type { ReactNode } from "react"
import { StepIndicator } from "./step-indicator"

interface RegistrationLayoutProps {
  children: ReactNode
  currentStep: number
  totalSteps: number
}

export function RegistrationLayout({ children, currentStep, totalSteps }: RegistrationLayoutProps) {
  const steps = [
    { id: 1, name: "Business" },
    { id: 2, name: "Contact" },
    { id: 3, name: "Financial" },
    { id: 4, name: "Team" },
    { id: 5, name: "Review" },
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
