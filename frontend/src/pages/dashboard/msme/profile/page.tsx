import { ChevronLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import MSMEProfileCard from "@/components/msme-profile/msme-profile-card"
import ProfileEditControls from "@/components/msme-profile/profile-edit-controls"
import TeamMembersList from "@/components/msme-profile/team-members-list"
import DocumentsList from "@/components/msme-profile/documents-list"
import RoadmapEditor from "@/components/msme-profile/roadmap-editor"

// Empty MSME template for new creation
const emptyMSME = {
  id: "",
  name: "New MSME",
  logo: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=1200",
  industry: "Select Industry",
  location: "Location",
  foundedYear: new Date().getFullYear(),
  description: "",
  verificationStatus: "pending",
  verificationDate: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  socialMedia: {
    twitter: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  },
  metrics: {
    revenue: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    employees: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    customers: {
      current: 0,
      previous: 0,
      growth: 0,
    },
    production: {
      current: 0,
      previous: 0,
      growth: 0,
    },
  },
}

export default function CreateMSMEProfilePage() {
  return (
    <div className=" py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">

        <h1 className="text-3xl font-bold flex-1">Edit MSME Profile</h1>
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MSMEProfileCard msme={emptyMSME} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>MSME Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="team">Team Members</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="roadmap">Business Roadmap</TabsTrigger>
                </TabsList>

                <TabsContent value="basic">
                  <ProfileEditControls
                    msmeData={{
                      description: "",
                      website: "",
                      email: "",
                      phone: "",
                      businessRegistrationNumber: "",
                      taxIdentificationNumber: "",
                      socialMedia: {
                        linkedin: "",
                        twitter: "",
                        facebook: "",
                      },
                    }}
                    isEditing={true}
                    onInputChange={(field, value) => {
                      // In a real app, this would update the state
                      console.log(`Field ${field} updated to ${value}`)
                    }}
                  />
                </TabsContent>

                <TabsContent value="team">
                  <TeamMembersList members={[]} isEditing={true} />
                </TabsContent>

                <TabsContent value="documents">
                  <DocumentsList documents={[]} isEditing={true} />
                </TabsContent>

                <TabsContent value="roadmap">
                  <RoadmapEditor milestones={[]} isEditing={true} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
