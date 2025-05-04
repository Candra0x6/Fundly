

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
import { Checkbox } from "@/components/ui/checkbox"
import { useMsmeActor } from "@/utility/actors/msmeActor"
import { useStorageActor } from "@/utility/actors/storageActor"
import { getSession } from "@/utility/session"
import toast from "react-hot-toast"
import { Document } from "./document-upload-form"
import { useFileUpload } from "@/hooks/useFileUpload"

export interface BusinessDetailsFormData {
  name: string
  type: string
  industry: string[]
  foundingDate: string
  description: string
  logo: Document | null
  coverImage: Document | null
}
export interface BusinessDetailsFormProps {
  data: BusinessDetailsFormData
  updateData: (data: any) => void
}

export function BusinessDetailsForm({ data, updateData }: BusinessDetailsFormProps) {
  const [date, setDate] = useState<Date | undefined>(data.foundingDate ? new Date(data.foundingDate) : undefined)

  // Get actors
  const msmeId = getSession("msme_id") || "0"

  // Use the new upload hooks
  const {
    uploadState: {
      progress: logoProgress,
      status: logoStatus,
      isUploading: uploadingLogo,
      preview: logoPreview,
      reset: resetLogoUpload
    },
    uploadFile: uploadLogo
  } = useFileUpload()

  const {
    uploadState: {
      progress: coverProgress,
      status: coverStatus,
      isUploading: uploadingCover,
      preview: coverPreview,
      reset: resetCoverUpload
    },
    uploadFile: uploadCover
  } = useFileUpload()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({ [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    updateData({ [name]: value })
  }

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      updateData({ industry: [...(data.industry || []), industry] })
    } else {
      updateData({ industry: (data.industry || []).filter(item => item !== industry) })
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      updateData({ foundingDate: date.toISOString() })
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const result = await uploadLogo(file, {
        entityId: msmeId,
        documentType: "BusinessLogo",
        documentName: "Business Logo",
        description: "Logo of the business"
      })

      if (result) {
        updateData({
          logo: {
            id: result.assetId,
            assetId: result.assetId,
            name: result.name,
            file: file,
            type: "logo",
            description: result.description,
            isRequired: false,
            dateUploaded: result.dateUploaded,
          }
        })
      }
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const result = await uploadCover(file, {
        entityId: msmeId,
        documentType: "BusinessCoverImage",
        documentName: "Business Cover Image",
        description: ""
      })

      if (result) {
        updateData({
          coverImage: {
            id: result.assetId,
            assetId: result.assetId,
            name: result.name,
            file: file,
            type: "cover",
            description: result.description,
            isRequired: false,
            dateUploaded: result.dateUploaded,
          }
        })
      }
    }
  }

  const focusAreas = [
    "Telemedicine",
    "Digital Wallets",
    "K-12 Online Tutoring",
    "Crop Monitoring",
    "Green Construction Materials",
    "Self-Driving Technology",
    "Personalized Shopping",
    "Blockchain Security",
    "Talent Matching",
    "Clinical Trial Optimization",
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
                {focusAreas.map((focusArea) => (
                  <SelectItem key={focusArea} value={focusArea}>
                    {focusArea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="industry">
              Industry <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {industries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={data.industry?.includes(industry)}
                    onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                  />
                  <Label
                    htmlFor={`industry-${industry}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="foundingDate">
            Founding Date <span className="text-red-500">*</span>
          </Label>
          <Popover>
            <PopoverTrigger>
              <Button
                variant={"outline"}
                className={cn("w-full mt-1 justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <Calendar mode="single" selected={date} onSelect={handleDateChange} className="flex flex-col" />
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
                      resetLogoUpload()
                      updateData({ logo: null })
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md ${uploadingLogo ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-gray-400'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingLogo ? (
                      <>
                        <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-xs text-gray-500 mt-1">Upload logo</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, 512x512px or larger</p>

            {uploadingLogo && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${logoProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{logoStatus}</p>
              </div>
            )}
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
                      resetCoverUpload()
                      updateData({ coverImage: null })
                    }}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md ${uploadingCover ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-gray-400'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingCover ? (
                      <>
                        <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-xs text-gray-500 mt-1">Upload cover image</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Recommended: 1200x400px, 16:9 ratio</p>

            {uploadingCover && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${coverProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{coverStatus}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}