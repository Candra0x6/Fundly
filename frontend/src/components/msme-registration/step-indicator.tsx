import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  name: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20 " : "", "relative w-full")}>
            {step.id < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-emerald-600" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : step.id === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-600 bg-white"
                  aria-current="step"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </>
            )}

            <div
              className={cn(
                "absolute top-10 whitespace-nowrap",
                stepIdx === 0 ? "left-0" : stepIdx === steps.length - 1 ? "right-0" : "",
                "hidden sm:block text-sm font-medium",
                step.id <= currentStep ? "text-emerald-600" : "text-gray-500",
              )}
            >
              {step.name}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
