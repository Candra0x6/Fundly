"use client"

import { useState } from "react"
import { Calendar, Check, Clock, Edit, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Milestone = {
  id: string
  title: string
  description: string
  targetDate: string
  status: "planned" | "in-progress" | "completed" | "delayed"
}

interface RoadmapEditorProps {
  milestones: Milestone[]
  isEditing?: boolean
}

export default function RoadmapEditor({ milestones: initialMilestones, isEditing = false }: RoadmapEditorProps) {
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSaveMilestone = (milestone: Milestone) => {
    if (milestone.id) {
      // Update existing milestone
      setMilestones(milestones.map((m) => (m.id === milestone.id ? milestone : m)))
    } else {
      // Add new milestone
      const newMilestone = {
        ...milestone,
        id: `milestone${milestones.length + 1}`,
      }
      setMilestones([...milestones, newMilestone])
    }
    setEditingMilestone(null)
    setIsDialogOpen(false)
  }

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-amber-100 text-amber-800"
      case "completed":
        return "bg-emerald-100 text-emerald-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Calendar className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <Check className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Business Roadmap</h3>
        {isEditing && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() =>
                  setEditingMilestone({
                    id: "",
                    title: "",
                    description: "",
                    targetDate: "",
                    status: "planned",
                  })
                }
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Milestone
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingMilestone?.id ? "Edit Milestone" : "Add New Milestone"}</DialogTitle>
                <DialogDescription>
                  {editingMilestone?.id
                    ? "Update the details of this business milestone."
                    : "Add a new milestone to your business roadmap."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={editingMilestone?.title || ""}
                    onChange={(e) =>
                      setEditingMilestone({
                        ...editingMilestone!,
                        title: e.target.value,
                      })
                    }
                    placeholder="Milestone title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={editingMilestone?.description || ""}
                    onChange={(e) =>
                      setEditingMilestone({
                        ...editingMilestone!,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe this milestone"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="targetDate" className="text-sm font-medium">
                      Target Date
                    </label>
                    <Input
                      id="targetDate"
                      type="month"
                      value={editingMilestone?.targetDate || ""}
                      onChange={(e) =>
                        setEditingMilestone({
                          ...editingMilestone!,
                          targetDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <Select
                      value={editingMilestone?.status || "planned"}
                      onValueChange={(value) =>
                        setEditingMilestone({
                          ...editingMilestone!,
                          status: value as "planned" | "in-progress" | "completed" | "delayed",
                        })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveMilestone(editingMilestone!)}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={!editingMilestone?.title || !editingMilestone?.targetDate}
                >
                  Save Milestone
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No milestones added yet. Add your first business milestone.
          </div>
        ) : (
          milestones.map((milestone, index) => (
            <Card key={milestone.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{milestone.title}</h4>
                      <p className="text-gray-600 mt-1">{milestone.description}</p>
                      <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(milestone.targetDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                            })}
                          </span>
                        </div>
                        <Badge className={`flex items-center gap-1 ${getStatusColor(milestone.status)}`}>
                          {getStatusIcon(milestone.status)}
                          <span className="capitalize">{milestone.status.replace("-", " ")}</span>
                        </Badge>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingMilestone(milestone)
                                setIsDialogOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteMilestone(milestone.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
