

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Document, MSME } from "@declarations/msme_registration/msme_registration.did"

interface VerificationChecklistProps {
  documents: Document[]
}



export function VerificationChecklist({ documents }: VerificationChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const handleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const completedCount = Object.values(checkedItems).filter(Boolean).length
  const progressPercentage = (completedCount / documents.length) * 100

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
              {completedCount}/{documents.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-4">
          {documents.map((item) => (
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
                  className={`text-sm font-medium ${checkedItems[item.id]
                    ? "text-gray-500 dark:text-gray-400 line-through"
                    : "text-gray-900 dark:text-gray-100"
                    }`}
                >
                  {item.name}
                </Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">ID: {item.id}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
