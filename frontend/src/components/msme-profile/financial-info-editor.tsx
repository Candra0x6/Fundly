"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FinancialInfoEditorProps {
  financialInfo: {
    employeeCount: bigint
    fundingPurpose: string
    fundingGoal: bigint
    annualRevenue: bigint
  }
  onUpdate: (field: string, value: any) => void
}

export default function FinancialInfoEditor({ financialInfo, onUpdate }: FinancialInfoEditorProps) {
  const handleNumberChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    if (value) {
      onUpdate(field, BigInt(value))
    } else {
      onUpdate(field, BigInt(0))
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeCount">Number of Employees</Label>
          <Input
            id="employeeCount"
            type="number"
            value={financialInfo.employeeCount ? financialInfo.employeeCount.toString() : "0"}
            onChange={handleNumberChange("employeeCount")}
            placeholder="Enter number of employees"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualRevenue">Annual Revenue</Label>
          <Input
            id="annualRevenue"
            type="number"
            value={financialInfo.annualRevenue ? financialInfo.annualRevenue.toString() : "0"}
            onChange={handleNumberChange("annualRevenue")}
            placeholder="Enter annual revenue"
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fundingGoal">Funding Goal</Label>
        <Input
          id="fundingGoal"
          type="number"
          value={financialInfo.fundingGoal ? financialInfo.fundingGoal.toString() : "0"}
          onChange={handleNumberChange("fundingGoal")}
          placeholder="Enter funding goal"
          min="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fundingPurpose">Funding Purpose</Label>
        <Textarea
          id="fundingPurpose"
          value={financialInfo.fundingPurpose || ""}
          onChange={(e) => onUpdate("fundingPurpose", e.target.value)}
          placeholder="Describe the purpose of your funding"
          rows={4}
        />
      </div>
    </div>
  )
}
