"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FinancialInformationFormProps {
  data: {
    annualRevenue: string
    employeeCount: string
    fundingStage: string
    investmentSought: string
    useOfFunds: string
  }
  updateData: (data: any) => void
}

export function FinancialInformationForm({ data, updateData }: FinancialInformationFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({ [name]: value })
  }

  const fundingStages = [
    "Pre-seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C",
    "Series D+",
    "Bootstrapped",
    "Revenue Generating",
    "Profitable",
    "Other",
  ]

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
          <Label htmlFor="fundingStage">
            Current Funding Stage <span className="text-red-500">*</span>
          </Label>
          <Select value={data.fundingStage} onValueChange={(value) => handleSelectChange("fundingStage", value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select funding stage" />
            </SelectTrigger>
            <SelectContent>
              {fundingStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="investmentSought">Investment Amount Sought (USD)</Label>
          <Input
            id="investmentSought"
            name="investmentSought"
            value={data.investmentSought}
            onChange={handleInputChange}
            placeholder="e.g. 500000"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="useOfFunds">
            Use of Funds <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="useOfFunds"
            name="useOfFunds"
            value={data.useOfFunds}
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
