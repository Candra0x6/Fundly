"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface BusinessDetailsFormProps {
  data: {
    name: string
    type: string
    industry: string
    foundingDate: string
    description: string
    logo: any
    coverImage: any
  }
  updateData: (data: any) => void
}

export function BusinessDetailsForm({ data, updateData }: BusinessDetailsFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [date, setDate] = useState<Date | undefined>(data.foundingDate ? new Date(data.foundingDate) : undefined)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({ [name]: value })
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      updateData({ foundingDate: date.toISOString() })
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      updateData({ logo: file })

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      updateData({ coverImage: file })

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setCoverPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Limited Liability Company (LLC)",
    "Corporation",
    "Cooperative",
    "Non-profit Organization",
    "Other",
  ]

  const industries = [
    "Agriculture",
    "Manufacturing",
    "Retail",
    "Food & Beverage",
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Construction",
    "Transportation",
    "Entertainment",
    "Hospitality",
    "Real Estate",
    "Energy",
    "Other",
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
        <p className="text-gray-600 mt-1">Provide basic information about your business</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <Label htmlFor="name">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={data.name}
            onChange={handleInputChange}
            placeholder="Enter your business name"
            className="mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="type">
              Business Type <span className="text-red-500">*</span>
            </Label>
            <Select value={data.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="industry">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Select value={data.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="foundingDate">
            Founding Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full mt-1 justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="description">
            Business Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleInputChange}
            placeholder="Describe your business, products/services, and mission"
            className="mt-1 min-h-[120px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Business Logo</Label>
            <div className="mt-1 flex items-center">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="h-32 w-32 object-contain border rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-0 right-0 mt-1 mr-1"
                    onClick={() => {
                      setLogoPreview(null)
                      updateData({ logo: null })
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">Upload logo</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, 512x512px or larger</p>
          </div>

          <div>
            <Label>Cover Image</Label>
            <div className="mt-1 flex items-center">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview || "/placeholder.svg"}
                    alt="Cover preview"
                    className="h-32 w-full object-cover border rounded-md"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-0 right-0 mt-1 mr-1"
                    onClick={() => {
                      setCoverPreview(null)
                      updateData({ coverImage: null })
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">Upload cover image</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: 1200x400px, 16:9 ratio</p>
          </div>
        </div>
      </div>
    </div>
  )
}
