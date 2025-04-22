"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Trash2, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TeamMember {
  id: string
  name: string
  position: string
  avatar: string
  bio: string
}

interface TeamMembersListProps {
  members: TeamMember[]
  isEditing: boolean
}

export default function TeamMembersList({ members, isEditing }: TeamMembersListProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(members)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [newMember, setNewMember] = useState<Partial<TeamMember> | null>(null)

  const handleEditMember = (id: string) => {
    setEditingMember(id)
  }

  const handleCancelEdit = () => {
    setEditingMember(null)
  }

  const handleSaveMember = (id: string) => {
    // In a real app, this would save the changes to the backend
    setEditingMember(null)
  }

  const handleDeleteMember = (id: string) => {
    // In a real app, this would delete the member from the backend
    setTeamMembers(teamMembers.filter((member) => member.id !== id))
  }

  const handleAddNewMember = () => {
    setNewMember({
      name: "",
      position: "",
      avatar: "/placeholder.svg?height=80&width=80",
      bio: "",
    })
  }

  const handleCancelNewMember = () => {
    setNewMember(null)
  }

  const handleSaveNewMember = () => {
    if (newMember && newMember.name && newMember.position) {
      // In a real app, this would save the new member to the backend
      const newId = `new-${Date.now()}`
      setTeamMembers([
        ...teamMembers,
        {
          id: newId,
          name: newMember.name,
          position: newMember.position,
          avatar: newMember.avatar || "/placeholder.svg?height=80&width=80",
          bio: newMember.bio || "",
        },
      ])
      setNewMember(null)
    }
  }

  const handleNewMemberChange = (field: string, value: string) => {
    if (newMember) {
      setNewMember({
        ...newMember,
        [field]: value,
      })
    }
  }

  const handleMemberChange = (id: string, field: string, value: string) => {
    setTeamMembers(teamMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-zinc-500">Key personnel and leadership</p>
        </div>
        {isEditing && !newMember && (
          <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleAddNewMember}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        )}
      </div>

      {/* New Member Form */}
      {isEditing && newMember && (
        <Card className="border-2 border-emerald-200">
          <CardHeader>
            <CardTitle>Add New Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-zinc-100">
                    <img
                      src={newMember.avatar || "/placeholder.svg?height=80&width=80"}
                      alt="New member avatar"
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0">
                    <label htmlFor="new-avatar-upload" className="cursor-pointer">
                      <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                        <Upload className="h-3 w-3 text-white" />
                      </div>
                      <input
                        id="new-avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          // In a real app, this would upload the file and get a URL back
                          if (e.target.files && e.target.files[0]) {
                            // Simulate a file upload
                            handleNewMemberChange("avatar", "/placeholder.svg?height=80&width=80")
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Name</Label>
                    <Input
                      id="new-name"
                      value={newMember.name || ""}
                      onChange={(e) => handleNewMemberChange("name", e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-position">Position</Label>
                    <Input
                      id="new-position"
                      value={newMember.position || ""}
                      onChange={(e) => handleNewMemberChange("position", e.target.value)}
                      placeholder="Job Title"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="new-bio">Bio</Label>
                <Textarea
                  id="new-bio"
                  value={newMember.bio || ""}
                  onChange={(e) => handleNewMemberChange("bio", e.target.value)}
                  placeholder="Brief biography"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancelNewMember}>
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleSaveNewMember}
                  disabled={!newMember.name || !newMember.position}
                >
                  Save Member
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-6">
              {editingMember === member.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full overflow-hidden bg-zinc-100">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0">
                        <label htmlFor={`avatar-upload-${member.id}`} className="cursor-pointer">
                          <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                            <Upload className="h-3 w-3 text-white" />
                          </div>
                          <input
                            id={`avatar-upload-${member.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              // In a real app, this would upload the file and get a URL back
                              if (e.target.files && e.target.files[0]) {
                                // Simulate a file upload
                                handleMemberChange(member.id, "avatar", member.avatar)
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <Input
                        value={member.name}
                        onChange={(e) => handleMemberChange(member.id, "name", e.target.value)}
                        placeholder="Full Name"
                      />
                      <Input
                        value={member.position}
                        onChange={(e) => handleMemberChange(member.id, "position", e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                  </div>

                  <Textarea
                    value={member.bio}
                    onChange={(e) => handleMemberChange(member.id, "bio", e.target.value)}
                    placeholder="Brief biography"
                    rows={3}
                  />

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => handleSaveMember(member.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-zinc-100">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{member.name}</h3>
                      <p className="text-zinc-500">{member.position}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-zinc-600">{member.bio}</p>

                  {isEditing && (
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEditMember(member.id)}>
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteMember(member.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-zinc-500">No team members added yet</p>
          {isEditing && (
            <Button className="bg-emerald-500 hover:bg-emerald-600 mt-4" onClick={handleAddNewMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
