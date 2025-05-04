

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Upload } from "lucide-react"
import { TeamMember, Document } from "@declarations/msme_registration/msme_registration.did"
import { useFileUpload } from "@/hooks/useFileUpload"
import { getSession } from "@/utility/session"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"

interface TeamMembersListProps {
  members: TeamMember[]
  onUpdate: (members: TeamMember[]) => void
}

export default function TeamMembersList({ members = [], onUpdate }: TeamMembersListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const msmeId = getSession("msme_id")
  const {
    uploadState: {
      progress,
      status,
      isUploading,
      preview,
      reset,
      assetId: imageAssetId
    },
    uploadFile,
  } = useFileUpload()

  const handleAddMember = () => {
    setCurrentMember({
      bio: "",
      name: "",
      email: "",
      image: {
        id: "",
        verified: false,
        assetId: "",
        name: "",
        assetCanisterId: [],
        docType: { TeamMemberImage: null },
        uploadDate: BigInt(0)
      },
      position: "",
    })
    setEditIndex(null)
    setIsDialogOpen(true)
  }

  const handleEditMember = (member: TeamMember, index: number) => {
    setCurrentMember({ ...member })
    setEditIndex(index)
    setIsDialogOpen(true)
  }

  const handleDeleteMember = (index: number) => {
    const updatedMembers = [...members]
    updatedMembers.splice(index, 1)
    onUpdate(updatedMembers)
  }

  const handleSaveMember = () => {
    if (!currentMember) return

    const updatedMembers = [...members]
    if (editIndex !== null) {
      updatedMembers[editIndex] = currentMember
    } else {
      updatedMembers.push(currentMember)
    }

    onUpdate(updatedMembers)
    setIsDialogOpen(false)
    setCurrentMember(null)
    setEditIndex(null)
  }

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    if (!currentMember) return
    setCurrentMember({
      ...currentMember,
      [field]: value,
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const result = await uploadFile(file, {
        entityId: msmeId,
        documentType: "TeamMemberImage",
        documentName: "Team Member Image",
        description: "Image of the team member"
      })

      // Create a temporary Document object for the image
      const imageDoc: Document = {
        id: result?.assetId || "",
        verified: false,
        assetId: result?.assetId || "",
        name: result?.name || "",
        assetCanisterId: [],
        docType: { TeamMemberImage: null },
        uploadDate: BigInt(Date.now())
      };

      handleInputChange("image", imageDoc);
    }
  }

  // Function to display image or fallback
  const getImageUrl = (member: TeamMember) => {
    if (member.image && member.image.assetId && member.image.assetId.startsWith('blob:')) {
      return member.image.assetId;
    }
    return "/placeholder.svg";
  }

  // Helper to get member initials for avatar fallback
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members</h3>
        <Button onClick={handleAddMember} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No team members added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <SingleAssetPreview
                      assetId={imageAssetId || member.image?.assetId}
                      previewUrlState={preview || undefined}
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMember(member, index)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm line-clamp-3">{member.bio}</p>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {currentMember?.image && currentMember.image.assetId ? (
                    <SingleAssetPreview
                      assetId={imageAssetId || currentMember.image?.assetId}
                      previewUrlState={preview || undefined}
                      className="h-24 w-24 rounded-full"
                    />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Input type="file" className="hidden" id="member-image" accept="image/*" onChange={handleImageChange} />
                <Label
                  htmlFor="member-image"
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-1 cursor-pointer"
                >
                  <Pencil className="h-3 w-3 text-primary-foreground" />
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={currentMember?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={currentMember?.position || ""}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  placeholder="Enter position"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={currentMember?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={currentMember?.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Enter bio"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMember}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
