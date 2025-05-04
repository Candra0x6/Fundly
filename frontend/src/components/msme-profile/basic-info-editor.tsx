

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { BusinessDetails } from "@declarations/msme_registration/msme_registration.did"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"
import { useFileUpload } from "@/hooks/useFileUpload"
import { getSession } from "@/utility/session"

interface BasicInfoEditorProps {
  details: BusinessDetails
  onUpdate: (field: string, value: any) => void
}

export default function BasicInfoEditor({ details, onUpdate }: BasicInfoEditorProps) {
  const [newIndustry, setNewIndustry] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const {
    uploadState: {
      progress: logoProgress,
      status: logoStatus,
      isUploading: uploadingLogo,
      preview: logoPreview,
      reset: resetLogoUpload,
      assetId: logoAssetId
    },
    uploadFile: uploadLogo,
  } = useFileUpload()

  const {
    uploadState: {
      progress: coverProgress,
      status: coverStatus,
      isUploading: uploadingCover,
      preview: coverPreview,
      reset: resetCoverUpload,
      assetId: coverAssetId
    },
    uploadFile: uploadCover,
  } = useFileUpload()

  const msmeId = getSession("msme_id")
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      onUpdate("foundingDate", BigInt(date.getTime()))
    }
  }

  const handleAddIndustry = () => {
    if (newIndustry.trim()) {
      const updatedIndustries = [...details.industry, newIndustry.trim()]
      onUpdate("industry", updatedIndustries)
      setNewIndustry("")
    }
  }

  const handleRemoveIndustry = (index: number) => {
    const updatedIndustries = [...details.industry]
    updatedIndustries.splice(index, 1)
    onUpdate("industry", updatedIndustries)
  }

  const handleFileChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpdate(field, e.target.files[0])
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
        onUpdate("logo", {
          id: result.assetId,
          name: result.name,
          docType: { Other: "BusinessLogo" },
          assetCanisterId: [],
          assetId: result.assetId,
          uploadDate: BigInt(new Date().getTime()),
          verified: false
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

      console.log(result)
      if (result) {
        onUpdate("coverImage", {
          id: result.assetId,
          name: result.name,
          docType: { Other: "BusinessCoverImage" },
          assetCanisterId: [],
          assetId: result.assetId,
          uploadDate: BigInt(new Date().getTime()),
          verified: false
        })
      }
    }
  }


  console.log(details.coverImage?.assetId)
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={details.name || ""}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="Enter business name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="focusArea">Focus Area</Label>
            <Input
              id="focusArea"
              value={details.focusArea || ""}

              onChange={(e) => onUpdate("focusArea", e.target.value)}
              placeholder="Enter focus area"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundingDate">Founding Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Logo</Label>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                {details.logo ? (
                  <div className="relative w-full">

                    <SingleAssetPreview
                      assetId={logoAssetId || details.logo?.assetId}
                      previewUrlState={logoPreview || undefined}
                    />
                    {logoAssetId}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => onUpdate("logo", null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload logo</p>
                    <Input
                      type="file"
                      className="hidden"
                      id="logo-upload"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <Label
                      htmlFor="logo-upload"
                      className="mt-2 cursor-pointer rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Select File
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                {details.coverImage ? (
                  <div className="relative w-full">
                    <SingleAssetPreview
                      assetId={coverAssetId || details.coverImage?.assetId}
                      previewUrlState={coverPreview || undefined}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => onUpdate("coverImage", null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload cover image</p>
                    <Input
                      type="file"
                      className="hidden"
                      id="cover-upload"
                      accept="image/*"
                      onChange={handleCoverUpload}
                    />
                    <Label
                      htmlFor="cover-upload"
                      className="mt-2 cursor-pointer rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                    >
                      Select File
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          value={details.description || ""}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Enter a description of your business"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {details.industry &&
            details.industry.map((ind, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {ind}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveIndustry(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="industry"
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            placeholder="Add industry tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddIndustry()
              }
            }}
          />
          <Button type="button" onClick={handleAddIndustry}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
