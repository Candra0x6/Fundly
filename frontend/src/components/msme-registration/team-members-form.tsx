

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, Edit2, User } from "lucide-react"
import { toast } from "react-hot-toast"
import { Document } from "./document-upload-form"
import { uploadMSMEDocument } from "@/utility/uploadFile"
import { useMsmeActor } from "@/utility/actors/msmeActor"
import { useStorageActor } from "@/utility/actors/storageActor"
import { getSession } from "@/utility/session"

export interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  email: string
  photo: Document | null
  photoPreview?: string
}

interface TeamMembersFormProps {
  data: TeamMember[]
  updateData: (data: TeamMember[]) => void
}

export function TeamMembersForm({ data, updateData }: TeamMembersFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [photoStatus, setPhotoStatus] = useState("")
  const [photoProgress, setPhotoProgress] = useState(0)
  const msmeActor = useMsmeActor()
  const storageActor = useStorageActor()
  const msmeId = getSession("msme_id") || "0"
  const handleAddMember = () => {
    setCurrentMember({
      id: Date.now().toString(),
      name: "",
      position: "",
      bio: "",
      email: "",
      photo: null,
    })
    setPhotoPreview(null)
    setIsDialogOpen(true)
  }

  const handleEditMember = (member: TeamMember) => {
    setCurrentMember(member)
    setPhotoPreview(member.photoPreview || null)
    setIsDialogOpen(true)
  }

  const handleDeleteMember = (id: string) => {
    updateData(data.filter((member) => member.id !== id))
  }

  const handleSaveMember = () => {
    if (!currentMember) return

    const updatedMember = {
      ...currentMember,
      photoPreview: photoPreview,
    }

    if (data.some((member) => member.id === currentMember.id)) {
      // Update existing member
      updateData(data.map((member) => (member.id === currentMember.id ? updatedMember as TeamMember : member)))
    } else {
      // Add new member
      updateData([...data, updatedMember as TeamMember])
    }

    setIsDialogOpen(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && currentMember) {
      const file = e.target.files[0]


      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoPreview(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
      setUploadingPhoto(true)
      setPhotoStatus('Preparing upload...')
      setPhotoProgress(0)
      try {
        const result = await uploadMSMEDocument(
          msmeActor,
          storageActor,
          file,
          msmeId,
          "TeamMemberImage", // Document type for team member photo
          (uploadProgress: number) => {
            setPhotoProgress(uploadProgress)
            setPhotoStatus(`Uploading: ${uploadProgress}%`)
          }
        )

        setCurrentMember({
          ...currentMember,
          photo: {
            id: result.assetId,
            assetId: result.assetId,
            name: currentMember.name,
            file: file,
            type: "image",
            description: "Photo of the team member",
            isRequired: false,
            dateUploaded: new Date().toISOString(),
          },
        })

        toast.success("Photo uploaded successfully")
        setPhotoStatus('Upload successful!')
      } catch (error) {
        console.error("Error uploading photo:", error)
        // @ts-ignore
        const errorMessage = error.message || "Unknown error occurred"
        toast.error(`Photo upload failed: ${errorMessage}`)
        setPhotoStatus(`Error: ${errorMessage}`)
      } finally {
        setPhotoProgress(0)
        setUploadingPhoto(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentMember) return

    setCurrentMember({
      ...currentMember,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
        <p className="text-gray-600 mt-1">Add key team members and their roles</p>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No team members</h3>
            <p className="mt-1 text-sm text-gray-500">Add team members to showcase your business leadership</p>
            <div className="mt-6">
              <Button onClick={handleAddMember} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add Team Member
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.photoPreview ? (
                        <img
                          src={member.photoPreview || "/placeholder.svg"}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-full w-full p-4 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.position}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{member.bio}</p>

                  <div className="flex justify-between mt-auto">
                    <Button variant="outline" size="sm" onClick={() => handleEditMember(member)}>
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={handleAddMember} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add Another Team Member
              </Button>
            </div>
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentMember && data.some((member) => member.id === currentMember.id)
                ? "Edit Team Member"
                : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                  {photoPreview ? (
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Team member"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-6 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-2 cursor-pointer">
                  <Plus className="h-4 w-4 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={currentMember?.name || ""}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="position">
                Position <span className="text-red-500">*</span>
              </Label>
              <Input
                id="position"
                name="position"
                value={currentMember?.position || ""}
                onChange={handleInputChange}
                placeholder="e.g. CEO, CTO, Marketing Director"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentMember?.email || ""}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bio">
                Bio <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={currentMember?.bio || ""}
                onChange={handleInputChange}
                placeholder="Brief professional background and expertise"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMember}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={!currentMember?.name || !currentMember?.position || !currentMember?.bio}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
