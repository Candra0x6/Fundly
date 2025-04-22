"use client"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProfileEditControlsProps {
  msmeData: {
    description: string
    website: string
    email: string
    phone: string
    businessRegistrationNumber: string
    taxIdentificationNumber: string
    socialMedia: {
      linkedin: string
      twitter: string
      facebook: string
    }
  }
  isEditing: boolean
  onInputChange: (field: string, value: string) => void
}

export default function ProfileEditControls({ msmeData, isEditing, onInputChange }: ProfileEditControlsProps) {
  const handleSocialMediaChange = (platform: string, value: string) => {
    onInputChange(`socialMedia.${platform}`, value)
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">About</h3>
          <p className="text-zinc-600">{msmeData.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-zinc-500">Business Registration Number</p>
              <p className="font-medium">{msmeData.businessRegistrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Tax Identification Number</p>
              <p className="font-medium">{msmeData.taxIdentificationNumber}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {msmeData.socialMedia.linkedin && (
              <a
                href={msmeData.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {msmeData.socialMedia.twitter && (
              <a
                href={msmeData.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Twitter
              </a>
            )}
            {msmeData.socialMedia.facebook && (
              <a
                href={msmeData.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Facebook
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="description" className="text-lg font-medium mb-2 block">
          About
        </Label>
        <Textarea
          id="description"
          value={msmeData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Business description"
          rows={4}
          className="w-full"
        />
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Business Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessRegistrationNumber" className="text-sm text-zinc-500">
              Business Registration Number
            </Label>
            <Input
              id="businessRegistrationNumber"
              value={msmeData.businessRegistrationNumber}
              onChange={(e) => onInputChange("businessRegistrationNumber", e.target.value)}
              placeholder="Business Registration Number"
            />
          </div>
          <div>
            <Label htmlFor="taxIdentificationNumber" className="text-sm text-zinc-500">
              Tax Identification Number
            </Label>
            <Input
              id="taxIdentificationNumber"
              value={msmeData.taxIdentificationNumber}
              onChange={(e) => onInputChange("taxIdentificationNumber", e.target.value)}
              placeholder="Tax Identification Number"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Contact Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="website" className="text-sm text-zinc-500">
              Website
            </Label>
            <Input
              id="website"
              value={msmeData.website}
              onChange={(e) => onInputChange("website", e.target.value)}
              placeholder="Website URL"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm text-zinc-500">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={msmeData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="Email Address"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm text-zinc-500">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={msmeData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              placeholder="Phone Number"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-lg font-medium mb-2 block">Social Media</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="linkedin" className="text-sm text-zinc-500">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              value={msmeData.socialMedia.linkedin}
              onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
              placeholder="LinkedIn URL"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="text-sm text-zinc-500">
              Twitter
            </Label>
            <Input
              id="twitter"
              value={msmeData.socialMedia.twitter}
              onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
              placeholder="Twitter URL"
            />
          </div>
          <div>
            <Label htmlFor="facebook" className="text-sm text-zinc-500">
              Facebook
            </Label>
            <Input
              id="facebook"
              value={msmeData.socialMedia.facebook}
              onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
              placeholder="Facebook URL"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
