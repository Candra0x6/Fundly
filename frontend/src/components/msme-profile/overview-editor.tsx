

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface OverviewEditorProps {
  overview: {
    impact: string
    mission: string
    uniqueValueProposition: string
    keyAchievements: string[]
    marketOpportunity: string
    vision: string
  }
  onUpdate: (field: string, value: any) => void
}

export default function OverviewEditor({ overview, onUpdate }: OverviewEditorProps) {
  const [newAchievement, setNewAchievement] = useState("")

  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      const updatedAchievements = [...(overview.keyAchievements || []), newAchievement.trim()]
      onUpdate("keyAchievements", updatedAchievements)
      setNewAchievement("")
    }
  }

  const handleRemoveAchievement = (index: number) => {
    const updatedAchievements = [...(overview.keyAchievements || [])]
    updatedAchievements.splice(index, 1)
    onUpdate("keyAchievements", updatedAchievements)
  }

  const handleUpdateField = (field: string, value: string) => {
    onUpdate(field, value);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="vision">Vision</Label>
        <Textarea
          id="vision"
          value={overview.vision || ""}
          onChange={(e) => handleUpdateField("vision", e.target.value)}
          placeholder="Enter your business vision"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mission">Mission</Label>
        <Textarea
          id="mission"
          value={overview.mission || ""}
          onChange={(e) => handleUpdateField("mission", e.target.value)}
          placeholder="Enter your business mission"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uniqueValueProposition">Unique Value Proposition</Label>
        <Textarea
          id="uniqueValueProposition"
          value={overview.uniqueValueProposition || ""}
          onChange={(e) => handleUpdateField("uniqueValueProposition", e.target.value)}
          placeholder="What makes your business unique?"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="impact">Impact</Label>
        <Textarea
          id="impact"
          value={overview.impact || ""}
          onChange={(e) => handleUpdateField("impact", e.target.value)}
          placeholder="Describe the impact of your business"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="marketOpportunity">Market Opportunity</Label>
        <Textarea
          id="marketOpportunity"
          value={overview.marketOpportunity || ""}
          onChange={(e) => handleUpdateField("marketOpportunity", e.target.value)}
          placeholder="Describe your market opportunity"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyAchievements">Key Achievements</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {overview.keyAchievements &&
            overview.keyAchievements.map((achievement, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {achievement}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveAchievement(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
        <div className="flex gap-2">
          <Input
            id="keyAchievements"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="Add an achievement"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddAchievement()
              }
            }}
          />
          <Button type="button" onClick={handleAddAchievement}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
