"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Upload,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useFileUpload } from "@/hooks/useFileUpload"
import { Document, UserProfile } from "@declarations/authentication/authentication.did"
import { useAuth } from "@/utility/use-auth-client"
import { Principal } from "@dfinity/principal"
import { SingleAssetPreview } from "@/components/examples/AssetPreviewExample"
// Wallet type definition
interface WalletType {
  id: string
  name: string
  address: string
  type: string
  isConnected: boolean
  isPrimary: boolean
}

// Mock user data
const mockUser = {
  id: "user-123",
  name: "Alex Johnson",
  username: "alexj",
  email: "alex@example.com",
  avatar: "/placeholder.svg?height=128&width=128",
  bio: "Web3 enthusiast and investor. Passionate about decentralized finance and supporting innovative MSMEs.",
  location: "San Francisco, CA",
  occupation: "Product Manager",
  website: "https://alexjohnson.com",
  twitter: "@alexjweb3",
  linkedin: "alexjohnson",
  github: "alexj-dev",
  joinedDate: "January 2023",
  role: "Investor",
  publicProfile: true,
  emailNotifications: true,
  twoFactorEnabled: false,
  wallets: [
    {
      id: "1",
      name: "MetaMask",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      type: "Ethereum",
      isConnected: true,
      isPrimary: true,
    },
    {
      id: "2",
      name: "Phantom",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      type: "Solana",
      isConnected: true,
      isPrimary: false,
    },
    {
      id: "3",
      name: "Trust Wallet",
      address: "0x7890abcdef1234567890abcdef1234567890abcd",
      type: "Ethereum",
      isConnected: false,
      isPrimary: false,
    },
  ],
}

export default function ProfileEditPage() {
  const router = useNavigate()
  const { authActor } = useAuth()
  const [user, setUser] = useState<UserProfile>()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [hasChanges, setHasChanges] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const {
    uploadState: {
      assetId,
      preview,
      reset
    },
    uploadFile
  } = useFileUpload()

  useEffect(() => {
    const fetchUser = async () => {
      const user = await authActor.getMyProfile()
      // @ts-ignore
      setUser(user.ok)
    }
    fetchUser()
  }, [])

  console.log(user)
  // Handle input changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setUser((prev) => {
      if (!prev) return undefined;
      return { ...prev, [field]: value };
    });
    setHasChanges(true);

  }

  // Handle avatar change
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      const result = await uploadFile(file, {
        entityId: Principal.from(user?.principal).toText(),
        documentType: "BusinessLogo",
        documentName: "Business Logo",
        description: "Logo of the business"
      })

      const doc: Document = {
        id: result?.assetId ?? "",
        assetId: result?.assetId ?? "",
        name: result?.name ?? "",
        docType: { "GalleryImage": null },
        verified: true,
        uploadDate: BigInt(new Date(result?.dateUploaded ?? "").getTime()),
        assetCanisterId: [],
      }
      console.log(doc)
      if (result) {
        // @ts-ignore
        setUser((prev) => {
          if (!prev) return undefined;
          return { ...prev, image: [doc] }
        })
        setHasChanges(true)
      }
    }
  }




  // Save profile changes
  const saveChanges = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await authActor.updateProfile(user?.username as string, user?.email as string, user?.image as [Document])
      // Success message

      setHasChanges(false)
      // Redirect to profile page
      toast.success("Profile Updated")
      router("/dashboard/user/profile")
    } catch (error) {
      console.log(error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel changes
  const cancelChanges = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        router("/dashboard/user/profile")
      }
    } else {
      router("/dashboard/user/profile")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-zinc-500">Update your personal information and account settings</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={cancelChanges}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={saveChanges}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Alert */}
        {hasChanges && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700">Unsaved Changes</AlertTitle>
            <AlertDescription className="text-amber-600">
              You have unsaved changes. Make sure to save before leaving this page.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabs Navigation */}
        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="">
            <TabsTrigger value="general">General</TabsTrigger>

          </TabsList>

          {/* General Information Tab */}
          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Upload a profile picture to personalize your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-2 border-emerald-100">
                    <SingleAssetPreview
                      assetId={user?.image[0]?.assetId ?? ""}
                      previewUrlState={preview ?? undefined}
                    />

                  </Avatar>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" className="flex items-center gap-2" asChild>
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Upload New Image
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </Button>

                    </div>
                    <p className="text-xs text-zinc-500">
                      Recommended: Square image, at least 400x400 pixels, less than 2MB.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                      <Input
                        defaultValue={user?.username}
                        id="name"
                        className="pl-10"
                        onChange={(e) => handleInputChange("username", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                      <Input
                        defaultValue={user?.email}
                        id="email"
                        type="email"
                        className="pl-10"
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
