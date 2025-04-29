"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, CheckCircle, Clock, XCircle } from "lucide-react"
import { Roadmap, Milestone } from "@declarations/msme_registration/msme_registration.did"

interface RoadmapEditorProps {
  roadmap: Roadmap
  onUpdate: (roadmap: Roadmap) => void
}

export default function RoadmapEditor({ roadmap, onUpdate }: RoadmapEditorProps) {
  const [isMilestoneDialogOpen, setIsMilestoneDialogOpen] = useState(false)
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const handleRoadmapChange = (field: keyof Roadmap, value: any) => {
    onUpdate({
      ...roadmap,
      [field]: value,
    })
  }

  const handleAddMilestone = () => {
    setCurrentMilestone({
      status: "planned",
      title: "",
      description: "",
    })
    setEditIndex(null)
    setIsMilestoneDialogOpen(true)
  }

  const handleEditMilestone = (milestone: Milestone, index: number) => {
    setCurrentMilestone({ ...milestone })
    setEditIndex(index)
    setIsMilestoneDialogOpen(true)
  }

  const handleDeleteMilestone = (index: number) => {
    const updatedMilestones = [...roadmap.milestones]
    updatedMilestones.splice(index, 1)
    handleRoadmapChange("milestones", updatedMilestones)
  }

  const handleSaveMilestone = () => {
    if (!currentMilestone) return

    const updatedMilestones = [...(roadmap.milestones || [])]
    if (editIndex !== null) {
      updatedMilestones[editIndex] = currentMilestone
    } else {
      updatedMilestones.push(currentMilestone)
    }

    handleRoadmapChange("milestones", updatedMilestones)
    setIsMilestoneDialogOpen(false)
    setCurrentMilestone(null)
    setEditIndex(null)
  }

  const handleMilestoneChange = (field: keyof Milestone, value: any) => {
    if (!currentMilestone) return
    setCurrentMilestone({
      ...currentMilestone,
      [field]: value,
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "planned":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <XCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roadmap-title">Roadmap Title</Label>
          <Input
            id="roadmap-title"
            value={roadmap.title || ""}
            onChange={(e) => handleRoadmapChange("title", e.target.value)}
            placeholder="Enter roadmap title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roadmap-description">Roadmap Description</Label>
          <Textarea
            id="roadmap-description"
            value={roadmap.description || ""}
            onChange={(e) => handleRoadmapChange("description", e.target.value)}
            placeholder="Enter roadmap description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="roadmap-timeline">Timeline</Label>
          <Input
            id="roadmap-timeline"
            value={roadmap.timeline || ""}
            onChange={(e) => handleRoadmapChange("timeline", e.target.value)}
            placeholder="e.g., Q1 2023 - Q4 2024"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Milestones</h3>
          <Button onClick={handleAddMilestone} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>

        {!roadmap.milestones || roadmap.milestones.length === 0 ? (
          <div className="text-center p-6 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No milestones added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {roadmap.milestones.map((milestone, index) => (
              <Card key={index}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(milestone.status)}
                    <CardTitle className="text-base">{milestone.title}</CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEditMilestone(milestone, index)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMilestone(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{milestone.description}</p>
                </CardContent>
                <CardFooter>
                  <Badge variant="outline" className="text-xs">
                    {milestone.status === "completed"
                      ? "Completed"
                      : milestone.status === "in-progress"
                        ? "In Progress"
                        : "Planned"}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isMilestoneDialogOpen} onOpenChange={setIsMilestoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit Milestone" : "Add Milestone"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="milestone-title">Title</Label>
              <Input
                id="milestone-title"
                value={currentMilestone?.title || ""}
                onChange={(e) => handleMilestoneChange("title", e.target.value)}
                placeholder="Enter milestone title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="milestone-status">Status</Label>
              <Select
                value={currentMilestone?.status || "planned"}
                onValueChange={(value) => handleMilestoneChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="milestone-description">Description</Label>
              <Textarea
                id="milestone-description"
                value={currentMilestone?.description || ""}
                onChange={(e) => handleMilestoneChange("description", e.target.value)}
                placeholder="Enter milestone description"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMilestoneDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMilestone}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
