

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FinancialInformationFormData {
  annualRevenue: number
  employeeCount: number
  fundingGoal: number
  fundingPurpose: string
}
export interface FinancialInformationFormProps {
  data: FinancialInformationFormData
  updateData: (data: any) => void
}

export function FinancialInformationForm({ data, updateData }: FinancialInformationFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({ [name]: value })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Information</h2>
        <p className="text-gray-600 mt-1">Provide financial details about your business</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="annualRevenue">
              Annual Revenue (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="annualRevenue"
              name="annualRevenue"
              value={data.annualRevenue}
              onChange={handleInputChange}
              placeholder="e.g. 100000"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="employeeCount">
              Number of Employees <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employeeCount"
              name="employeeCount"
              value={data.employeeCount}
              onChange={handleInputChange}
              placeholder="e.g. 10"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="fundingGoal">Funding Goal (USD)</Label>
          <Input
            id="fundingGoal"
            name="fundingGoal"
            value={data.fundingGoal}
            onChange={handleInputChange}
            placeholder="e.g. 500000"
            className="mt-1"
          />
        </div>


        <div>
          <Label htmlFor="fundingPurpose">
            Funding Purpose <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="fundingPurpose"
            name="fundingPurpose"
            value={data.fundingPurpose}
            onChange={handleInputChange}
            placeholder="Describe how you plan to use the investment"
            className="mt-1 min-h-[120px]"
            required
          />
        </div>
      </div>
    </div>
  )
}
