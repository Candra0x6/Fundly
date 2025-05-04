

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"

interface TokenAmountInputProps {
  value: string
  onChange: (value: string) => void
  max?: number
  min?: number
  label?: string
  error?: string
}

export default function TokenAmountInput({
  value,
  onChange,
  max,
  min,
  label = "Token Amount",
  error,
}: TokenAmountInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [displayValue, setDisplayValue] = useState("")

  // Format the value with commas when it changes
  useEffect(() => {
    if (value) {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^\d.]/g, "")

      // Format with commas
      const parts = numericValue.split(".")
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      setDisplayValue(parts.join("."))
    } else {
      setDisplayValue("")
    }
  }, [value])

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Remove any non-numeric characters except decimal point
    const numericValue = inputValue.replace(/[^\d.]/g, "")

    // Ensure only one decimal point
    const parts = numericValue.split(".")
    const formattedValue = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : numericValue

    onChange(formattedValue)
  }

  // Validate against min/max when focus is lost
  const handleBlur = () => {
    setIsFocused(false)

    if (!value) return

    const numericValue = Number.parseFloat(value.replace(/,/g, ""))

    if (isNaN(numericValue)) return

    // Round to 2 decimal places
    const roundedValue = Math.round(numericValue * 100) / 100
    onChange(roundedValue.toString())
  }

  // Determine input status for styling
  const getInputStatus = () => {
    if (!value || error) return "error"

    const numericValue = Number.parseFloat(value.replace(/,/g, ""))

    if (isNaN(numericValue)) return "error"
    if (min !== undefined && numericValue < min) return "error"
    if (max !== undefined && numericValue > max) return "error"

    return "valid"
  }

  const inputStatus = getInputStatus()

  return (
    <div className="space-y-2">
      <Label htmlFor="token-amount" className="text-sm font-medium">
        {label}
      </Label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400">
          <Coins className="h-4 w-4" />
        </div>

        <Input
          id="token-amount"
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="0.00"
          className={`pl-10 ${inputStatus === "valid" && !isFocused
              ? "border-emerald-500 focus-visible:ring-emerald-500"
              : inputStatus === "error" && !isFocused
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400">FND</div>
      </div>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-zinc-500">
          {min !== undefined && max !== undefined
            ? `Enter an amount between ${min.toLocaleString()} and ${max.toLocaleString()} FND`
            : min !== undefined
              ? `Minimum amount: ${min.toLocaleString()} FND`
              : max !== undefined
                ? `Maximum amount: ${max.toLocaleString()} FND`
                : "Enter the token amount"}
        </p>
      )}
    </div>
  )
}
