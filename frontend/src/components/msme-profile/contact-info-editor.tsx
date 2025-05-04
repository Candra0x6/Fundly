

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ContactInfo } from "@declarations/msme_registration/msme_registration.did"
interface ContactInfoEditorProps {
  contactInfo: ContactInfo
  onUpdate: (field: string, value: any) => void
}

export default function ContactInfoEditor({ contactInfo, onUpdate }: ContactInfoEditorProps) {
  const handleWebsiteChange = (value: string) => {
    if (value) {
      onUpdate("website", [value])
    } else {
      onUpdate("website", [])
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={contactInfo.email || ""}
            onChange={(e) => onUpdate("email", e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={contactInfo.phone || ""}
            onChange={(e) => onUpdate("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={contactInfo.website && contactInfo.website.length > 0 ? contactInfo.website[0] : ""}
          onChange={(e) => handleWebsiteChange(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          value={contactInfo.streetAddress || ""}
          onChange={(e) => onUpdate("streetAddress", e.target.value)}
          placeholder="Enter street address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={contactInfo.city || ""}
            onChange={(e) => onUpdate("city", e.target.value)}
            placeholder="Enter city"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            value={contactInfo.state || ""}
            onChange={(e) => onUpdate("state", e.target.value)}
            placeholder="Enter state or province"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            value={contactInfo.postalCode || ""}
            onChange={(e) => onUpdate("postalCode", e.target.value)}
            placeholder="Enter postal code"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={contactInfo.country || ""}
          onChange={(e) => onUpdate("country", e.target.value)}
          placeholder="Enter country"
        />
      </div>
    </div>
  )
}
