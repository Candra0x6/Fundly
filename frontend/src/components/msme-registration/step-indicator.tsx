import { ArrowRight, Check, ChevronRight } from "lucide-react"
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
      <ol role="list" className="flex items-center justify-between gap-x-10">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? " " : "", "relative w-full flex items-center space-x-2")}>
            {step.id < currentStep ? (
              <div className="flex items-center justify-center">

                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700">
                  <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.name}</span>
                </div>

              </div>
            ) : step.id === currentStep ? (

              <div
                className="relative flex w-8 h-8 aspect-square items-center justify-center rounded-full border-2 border-emerald-600 bg-white"
                aria-current="step"
              >
                <span className="text-emerald-600">{step.id}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">

                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{step.name}</span>
                </div>
              </div>
            )}

            <div
              className={cn(
                stepIdx === 0 ? "" : stepIdx === steps.length - 1 ? "" : "",
                "flex items-center justify-between gap-x-1 text-sm font-medium",
                step.id <= currentStep ? "text-emerald-600" : "text-gray-400",
              )}
            >
              <span className=" w-full">{step.name}</span>
              <ChevronRight className={cn(step.id <= currentStep ? "text-emerald-600" : "text-gray-400", "h-8 w-8", step.id === steps.length ? "hidden" : "")} />
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
