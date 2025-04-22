"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

interface VerificationChecklistProps {
  msmeId: string
}

// Mock checklist items
const checklistItems = [
  {
    id: "business-registration",
    label: "Business registration is valid and current",
    category: "Legal",
  },
  {
    id: "tax-compliance",
    label: "Tax compliance certificate is valid",
    category: "Legal",
  },
  {
    id: "business-address",
    label: "Business address is verified",
    category: "Identity",
  },
  {
    id: "owner-identity",
    label: "Owner identity is confirmed",
    category: "Identity",
  },
  {
    id: "financial-statements",
    label: "Financial statements are consistent",
    category: "Financial",
  },
  {
    id: "business-activity",
    label: "Business activity matches description",
    category: "Business",
  },
  {
    id: "msme-criteria",
    label: "Meets MSME criteria for size and revenue",
    category: "Eligibility",
  },
  {
    id: "documentation-complete",
    label: "All required documentation is provided",
    category: "Completeness",
  },
]

export function VerificationChecklist({ msmeId }: VerificationChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const handleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length
  const progressPercentage = (completedCount / checklistItems.length) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Verification Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount}/{checklistItems.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          {checklistItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <Checkbox
                id={item.id}
                checked={!!checkedItems[item.id]}
                onCheckedChange={() => handleCheckItem(item.id)}
                className="mt-1"
              />
              <div className="grid gap-1.5">
                <Label
                  htmlFor={item.id}
                  className={`text-sm font-medium ${
                    checkedItems[item.id]
                      ? "text-gray-500 dark:text-gray-400 line-through"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {item.label}
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Category: {item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
