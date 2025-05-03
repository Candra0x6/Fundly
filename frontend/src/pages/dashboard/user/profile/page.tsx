"use client"

import { useEffect, useState } from "react"
import { User, Mail, MapPin, Briefcase, Globe, Twitter, Linkedin, Github, Edit, Wallet } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import { useAuth } from "@/utility/use-auth-client"
import { getSession } from "@/utility/session"
import { UserProfile, UserRole } from "@declarations/authentication/authentication.did"
import { Principal } from "@dfinity/principal"
import { SingleAssetPreview } from "@/components/examples/AssetPreviewExample"
import { Identity } from "@dfinity/agent"
// Mock user data

// Truncate wallet address for display
const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function InvestorProfilePage() {

  const { authActor } = useAuth()

  const [user, setUser] = useState<UserProfile>()
  useEffect(() => {
    const result = async () => {
      const userProfile = await authActor.getMyProfile()
      // @ts-ignore
      setUser(userProfile.ok)
    }
    result()
  }, [])
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start gap-4 md:flex-row">
            <Avatar className="h-24 w-24 border-2 border-emerald-100">
              <SingleAssetPreview assetId={user?.image[0]?.assetId || ""} />
            </Avatar>
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <Badge variant="outline" className="md:ml-2 bg-emerald-50 text-emerald-700 self-center">
                  {Object.keys(user?.roles[0] ?? {})[0] || ''}
                </Badge>
              </div>
              <p className="text-zinc-500">@{user?.username}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="md:ml-auto">
            <Button asChild className="bg-emerald-500 hover:bg-emerald-600">
              <Link to="/dashboard/user/profile/edit">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Profile Details and Tabs */}
        <div className="gap-6">
          {/* Left Sidebar - Profile Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-zinc-400" />
                  <span className="text-sm">{user?.email}</span>
                </div>


              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-zinc-400" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Wallet 1</span>
                      <span className="text-xs font-mono text-zinc-500">{truncateAddress(Principal.from(user?.principal ?? Principal.anonymous()).toText())}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700">
                    Primary
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>


        </div>
      </div>
    </div>
  )
}
