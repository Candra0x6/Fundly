import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building, Calendar, Globe, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"

interface MSMEProfileCardProps {
  msme: any
}

export default function MSMEProfileCard({ msme }: MSMEProfileCardProps) {
  if (!msme || !msme.details) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">Loading...</h2>
              <p className="text-muted-foreground">MSME Profile</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { details, contactInfo } = msme
  // Check if logo is a valid Blob or File object before creating URL
  const logoUrl =
    details.logo && (details.logo instanceof Blob || details.logo.size) ? URL.createObjectURL(details.logo) : null

  // Check if coverImage is a valid Blob or File object before creating URL
  const coverImageUrl =
    details.coverImage && (details.coverImage instanceof Blob || details.coverImage.size)
      ? URL.createObjectURL(details.coverImage)
      : null

  const formatDate = (date: bigint) => {
    if (!date) return "N/A"
    const dateObj = new Date(Number(date))
    return dateObj.toLocaleDateString()
  }

  return (
    <Card className="w-full overflow-hidden">
      {coverImageUrl && (
        <div className="h-32 w-full relative">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${coverImageUrl})` }} />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      <CardContent className={`p-6 ${coverImageUrl ? "-mt-16 relative" : ""}`}>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            {logoUrl ? (
              <SingleAssetPreview assetId={details.logo?.assetId} />
            ) : (
              <AvatarFallback>{details.name?.substring(0, 2) || "MS"}</AvatarFallback>
            )}
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-bold">{details.name || "Unnamed MSME"}</h2>
            <p className="text-muted-foreground">{details.focusArea || "No focus area specified"}</p>
          </div>

          <div className="w-full space-y-3 pt-4">
            {details.description && <p className="text-sm text-center">{details.description}</p>}

            {details.industry && details.industry.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {details.industry.map((ind, i) => (
                  <Badge key={i} variant="secondary">
                    {ind}
                  </Badge>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-2">
              {details.foundingDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Founded: {formatDate(details.foundingDate)}</span>
                </div>
              )}

              {contactInfo?.city && contactInfo?.country && (
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {contactInfo.city}, {contactInfo.country}
                  </span>
                </div>
              )}

              {contactInfo?.website && contactInfo.website.length > 0 && (
                <div className="flex items-center text-sm">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a
                    href={contactInfo.website[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {contactInfo.website[0].replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}

              {msme.financialInfo?.employeeCount && (
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{msme.financialInfo.employeeCount.toString()} employees</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
