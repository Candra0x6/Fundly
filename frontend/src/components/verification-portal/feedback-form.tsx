"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

interface FeedbackFormProps {
  msmeId: string
}

// Mock feedback templates
const feedbackTemplates = [
  {
    id: "missing-docs",
    label: "Missing required documents",
    text: "Your application is missing some required documents. Please upload the following: [specify documents].",
  },
  {
    id: "unclear-docs",
    label: "Unclear document images",
    text: "Some of your uploaded documents are unclear or illegible. Please re-upload clearer versions of: [specify documents].",
  },
  {
    id: "inconsistent-info",
    label: "Inconsistent information",
    text: "We've found inconsistencies in the information provided. Please clarify: [specify inconsistencies].",
  },
  {
    id: "additional-info",
    label: "Additional information needed",
    text: "We need additional information to process your verification. Please provide: [specify information].",
  },
]

export function FeedbackForm({ msmeId }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("")

  const handleTemplateSelect = (templateText: string) => {
    setFeedback(templateText)
  }

  const handleSubmit = () => {
    // In a real app, you would submit the feedback to your API
    console.log("Submitting feedback for MSME:", msmeId, feedback)
    // Clear the form after submission
    setFeedback("")
    // Show success message or notification
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Provide Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Feedback Templates
            </label>
            <div className="space-y-2">
              {feedbackTemplates.map((template) => (
                <div key={template.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={template.id}
                    onCheckedChange={() => handleTemplateSelect(template.text)}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor={template.id} className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {template.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Feedback Message</label>
            <Textarea
              placeholder="Enter your feedback or instructions for the MSME..."
              className="min-h-[120px]"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleSubmit}
            disabled={!feedback.trim()}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Feedback
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
