"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Twitter, Mail } from "lucide-react"
import { useStorageActor } from "@/utility/actors/storageActor"
import { useAssetPreview } from "@/hooks/useAssetPreview"
import { MSME } from "@declarations/msme_registration/msme_registration.did"
import { Document } from "@declarations/authentication/authentication.did"
interface MSMETeamProps {
  msme: MSME
}

export default function MSMETeam({ msme }: MSMETeamProps) {
  if (!msme.teamMembers || msme.teamMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No team information available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {msme.teamMembers.map((member, index) => (
        <TeamMemberCard key={index} member={member} index={index} />
      ))}
    </div>
  )
}

interface TeamMemberCardProps {
  member: {
    bio: string
    email: string
    image: Document
    name: string
    position: string
  }
  index: number
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const { previewUrl, isLoading } = useAssetPreview(member.image?.assetId)

  console.log(member)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <div className="aspect-square bg-zinc-100 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <img
              src={previewUrl || "/placeholder.svg"}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-zinc-600">{member.position}</p>
            </div>
            <p className="text-zinc-600 line-clamp-3">{member.bio}</p>
            <div className="flex gap-2">

              {member.email && (
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <a href={`mailto:${member.email}`}>
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
