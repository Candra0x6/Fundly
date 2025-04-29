"use client"

import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import MSMEProfileCard from "@/components/msme-profile/msme-profile-card"
import BasicInfoEditor from "@/components/msme-profile/basic-info-editor"
import TeamMembersList from "@/components/msme-profile/team-members-list"
import DocumentsList from "@/components/msme-profile/documents-list"
import RoadmapEditor from "@/components/msme-profile/roadmap-editor"
import OverviewEditor from "@/components/msme-profile/overview-editor"
import FinancialInfoEditor from "@/components/msme-profile/financial-info-editor"
import GalleryEditor from "@/components/msme-profile/gallery-editor"
import ContactInfoEditor from "@/components/msme-profile/contact-info-editor"
import { useEffect, useState } from "react"
import { useMsmeActor } from "@/utility/actors/msmeActor"
import { useAuth } from "@/utility/use-auth-client"
import { getSession } from "@/utility/session"
import { BusinessDetails, ContactInfo, Document, FinancialInfo, Gallery, MSME, MSMEUpdateArgs, Overview, Roadmap, TeamMember } from "@declarations/msme_registration/msme_registration.did"
import { Principal } from "@dfinity/principal"


export default function EditMSMEProfilePage() {
  const [msme, setMsme] = useState<MSME>()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const msmeActor = useMsmeActor()
  const { identity } = useAuth()
  const msmeId = getSession("msme_id")

  useEffect(() => {
    const fetchMSME = async () => {
      const msme = await msmeActor.getMSME(msmeId)
      // @ts-ignore
      setMsme(msme.ok)
    }
    fetchMSME()
  }, [msmeId])
  const handleSave = async () => {
    try {
      setIsSaving(true)

      if (!msme) {
        alert("No MSME data to save");
        return;
      }

      // Create a properly typed update object
      const backendMSME: MSMEUpdateArgs = {
        details: {
          focusArea: msme.details.focusArea || "",
          owner: msme.details.owner,
          logo: msme.details.logo,
          name: msme.details.name || "",
          description: msme.details.description || "",
          foundingDate: msme.details.foundingDate || BigInt(0),
          coverImage: msme.details.coverImage,
          industry: msme.details.industry || [],
        },
        contactInfo: {
          country: msme.contactInfo.country || "",
          city: msme.contactInfo.city || "",
          postalCode: msme.contactInfo.postalCode || "",
          email: msme.contactInfo.email || "",
          website: msme.contactInfo.website || [],
          state: msme.contactInfo.state || "",
          phone: msme.contactInfo.phone || "",
          streetAddress: msme.contactInfo.streetAddress || "",
        },
        overview: msme.overview || [],
        teamMembers: msme.teamMembers || [],
        financialInfo: {
          employeeCount: msme.financialInfo.employeeCount || BigInt(0),
          fundingPurpose: msme.financialInfo.fundingPurpose || "",
          fundingGoal: msme.financialInfo.fundingGoal || BigInt(0),
          annualRevenue: msme.financialInfo.annualRevenue || BigInt(0),
        },
        documents: msme.documents || [],
        roadmap: msme.roadmap || [],
        gallery: msme.gallery || [],
      }

      // Call the backend function
      const result = await msmeActor.updateMSMEProfile(msme.id, backendMSME)
      if ('ok' in result) {
        console.log('MSME profile saved successfully:', result.ok)
        alert('MSME profile saved successfully!')
      } else {
        console.error('Error saving MSME profile:', result.err)
        alert(`Failed to save MSME profile: ${Object.keys(result.err)[0]}`)
      }
    } catch (error) {
      console.error("Error saving MSME data:", error)
      alert("Failed to save MSME profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const updateMsmeField = (field: string, value: any) => {
    // @ts-ignore
    setMsme((prev) => {
      const updated = { ...prev }
      const fieldParts = field.split(".")

      let current: any = updated
      for (let i = 0; i < fieldParts.length - 1; i++) {
        if (!current[fieldParts[i]]) {
          if (Array.isArray(current[fieldParts[i]])) {
            current[fieldParts[i]] = []
          } else {
            current[fieldParts[i]] = {}
          }
        }
        current = current[fieldParts[i]]
      }

      current[fieldParts[fieldParts.length - 1]] = value
      return updated
    })
  }


  return (
    <div className="py-8 px-4 md:px-6 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold flex-1">Edit MSME Profile</h1>
        <Button
          className="bg-emerald-500 hover:bg-emerald-600"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {isLoading && msme ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading MSME data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MSMEProfileCard msme={msme} />
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>MSME Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="more">More</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    {msme?.details ? (
                      <BasicInfoEditor
                        details={msme.details}
                        onUpdate={(field, value) => updateMsmeField(`details.${field}`, value)}
                      />
                    ) : (
                      <p>Loading details...</p>
                    )}
                  </TabsContent>

                  <TabsContent value="overview">
                    <OverviewEditor
                      overview={
                        (msme && msme.overview && msme.overview[0]) || {
                          impact: "",
                          mission: "",
                          uniqueValueProposition: "",
                          keyAchievements: [],
                          marketOpportunity: "",
                          vision: "",
                        }
                      }
                      onUpdate={(field, value) => {
                        // Create new array to avoid modifying the original
                        let newOverview: any[] = [];

                        if (msme && msme.overview && msme.overview.length > 0) {
                          // Copy existing structure
                          newOverview = [...msme.overview];
                          // Update the field in the existing object
                          newOverview[0] = { ...newOverview[0], [field]: value };
                        } else {
                          // Initialize with a new object
                          newOverview = [{ [field]: value }];
                        }

                        updateMsmeField("overview", newOverview);
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="contact">
                    {msme?.contactInfo ? (
                      <ContactInfoEditor
                        contactInfo={msme.contactInfo}
                        onUpdate={(field, value) => updateMsmeField(`contactInfo.${field}`, value)}
                      />
                    ) : (
                      <p>Loading contact info...</p>
                    )}
                  </TabsContent>

                  <TabsContent value="more">
                    <Tabs defaultValue="team" className="w-full">
                      <TabsList className="grid grid-cols-5 mb-6">
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="financial">Financial</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                        <TabsTrigger value="gallery">Gallery</TabsTrigger>
                      </TabsList>

                      <TabsContent value="team">
                        {msme?.teamMembers ? (
                          <TeamMembersList
                            members={msme.teamMembers || []}
                            onUpdate={(updatedMembers) => updateMsmeField("teamMembers", updatedMembers)}
                          />
                        ) : (
                          <p>Loading team members...</p>
                        )}
                      </TabsContent>

                      <TabsContent value="financial">
                        {msme?.financialInfo ? (
                          <FinancialInfoEditor
                            financialInfo={msme.financialInfo}
                            onUpdate={(field, value) => updateMsmeField(`financialInfo.${field}`, value)}
                          />
                        ) : (
                          <p>Loading financial info...</p>
                        )}
                      </TabsContent>

                      <TabsContent value="documents">
                        {msme?.documents ? (
                          <DocumentsList
                            documents={msme.documents || []}
                            onUpdate={(updatedDocs) => updateMsmeField("documents", updatedDocs)}
                          />
                        ) : (
                          <p>Loading documents...</p>
                        )}
                      </TabsContent>

                      <TabsContent value="roadmap">
                        {msme?.roadmap ? (
                          <RoadmapEditor
                            roadmap={
                              (msme && msme.roadmap && msme.roadmap[0] && msme.roadmap[0][0]) || {
                                title: "",
                                description: "",
                                milestones: [],
                                timeline: "",
                              }
                            }
                            onUpdate={(updatedRoadmap) => {
                              // Create new array to avoid modifying the original
                              let newRoadmap: any[] = [];

                              if (msme && msme.roadmap && msme.roadmap.length > 0) {
                                // Copy existing structure
                                newRoadmap = [...msme.roadmap];
                              } else {
                                // Initialize with empty nested arrays
                                newRoadmap = [[]];
                              }

                              // Ensure the inner array exists
                              if (!newRoadmap[0]) {
                                newRoadmap[0] = [];
                              }

                              // Set the value
                              newRoadmap[0][0] = updatedRoadmap;
                              updateMsmeField("roadmap", newRoadmap);
                            }}
                          />
                        ) : (
                          <p>Loading roadmap...</p>
                        )}
                      </TabsContent>

                      <TabsContent value="gallery">
                        {msme?.gallery ? (
                          <GalleryEditor
                            gallery={(msme && msme.gallery && msme.gallery[0]) || []}
                            onUpdate={(updatedGallery) => {
                              // Create new array to avoid modifying the original
                              let newGallery: any[] = [];

                              if (msme && msme.gallery && msme.gallery.length > 0) {
                                // Copy existing structure
                                newGallery = [...msme.gallery];
                              } else {
                                // Initialize with empty nested arrays
                                newGallery = [[]];
                              }

                              // Update the gallery items
                              newGallery[0] = updatedGallery;
                              updateMsmeField("gallery", newGallery);
                            }}
                          />
                        ) : (
                          <p>Loading gallery...</p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
