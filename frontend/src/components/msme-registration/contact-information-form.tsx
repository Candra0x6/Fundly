

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface ContactInformationFormData {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  email: string
  website: string
}
export interface ContactInformationFormProps {
  data: ContactInformationFormData
  updateData: (data: any) => void
}

export function ContactInformationForm({ data, updateData }: ContactInformationFormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({ [name]: value })
  }

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "China",
    "India",
    "Brazil",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Other",
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
        <p className="text-gray-600 mt-1">Provide contact details for your business</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="address">
            Street Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="address"
            name="address"
            value={data.address}
            onChange={handleInputChange}
            placeholder="Enter street address"
            className="mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Input
              id="city"
              name="city"
              value={data.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="state">
              State/Province <span className="text-red-500">*</span>
            </Label>
            <Input
              id="state"
              name="state"
              value={data.state}
              onChange={handleInputChange}
              placeholder="Enter state or province"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="postalCode">
              Postal/ZIP Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={data.postalCode}
              onChange={handleInputChange}
              placeholder="Enter postal or ZIP code"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="country">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select value={data.country} onValueChange={(value) => handleSelectChange("country", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={data.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              className="mt-1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            name="website"
            value={data.website}
            onChange={handleInputChange}
            placeholder="https://www.example.com"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}
