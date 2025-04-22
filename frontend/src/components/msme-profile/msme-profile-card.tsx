import { Building2, Calendar, Globe, Mail, MapPin, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface MSMEProfileCardProps {
  msme: {
    id: string
    name: string
    logo: string
    coverImage: string
    industry: string
    location: string
    foundedYear: number
    description: string
    contactEmail: string
    contactPhone: string
    website: string
    socialMedia: {
      twitter: string
      instagram: string
      facebook: string
      linkedin: string
    }
  }
}

export default function MSMEProfileCard({ msme }: MSMEProfileCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <img src={msme.coverImage || "/placeholder.svg"} alt={`${msme.name} cover`} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="relative -mt-12 flex justify-center">
        <div className="rounded-full border-4 border-white bg-white overflow-hidden h-24 w-24">
          <img
            src={msme.logo || "/placeholder.svg"}
            alt={msme.name}
            className="object-cover"
          />
        </div>
      </div>

      <CardHeader className="text-center pt-2">
        <CardTitle className="text-2xl">{msme.name}</CardTitle>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Building2 className="h-4 w-4 mr-1" />
          <span>{msme.industry}</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm">{msme.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm">Founded in {msme.foundedYear}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">About</h3>
            <p className="text-sm text-muted-foreground">{msme.description}</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Contact Information</h3>

            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">{msme.contactEmail}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">{msme.contactPhone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">
                  <a
                    href={msme.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-500 hover:underline"
                  >
                    {msme.website.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="outline" className="w-full">
              View Public Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
