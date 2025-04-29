"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2, X, ImageIcon } from "lucide-react"
import { Gallery, Document } from "@declarations/msme_registration/msme_registration.did"
import { useFileUpload } from "@/hooks/useFileUpload"
import { getSession } from "@/utility/session"
import { SingleAssetPreview } from "../examples/AssetPreviewExample"

interface GalleryEditorProps {
  gallery: Gallery[]
  onUpdate: (gallery: Gallery[]) => void
}

export default function GalleryEditor({ gallery = [], onUpdate }: GalleryEditorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Gallery | null>(null)

  const {
    uploadState: {
      progress: logoProgress,
      status: logoStatus,
      isUploading: uploadingLogo,
      preview: logoPreview,
      reset: resetLogoUpload,
      assetId: logoAssetId
    },
    uploadFile,
  } = useFileUpload()
  const msmeId = getSession("msme_id")
  const handleAddItem = () => {
    setCurrentItem({
      title: "",
      description: "",
      image: {
        id: "",
        verified: false,
        assetId: "",
        name: "",
        assetCanisterId: [],
        docType: { GalleryImage: null },
        uploadDate: BigInt(0)
      }
    })
    setIsDialogOpen(true)
  }

  const handleDeleteItem = (index: number) => {
    const updatedGallery = [...gallery]
    updatedGallery.splice(index, 1)
    onUpdate(updatedGallery)
  }

  const handleSaveItem = () => {
    if (!currentItem || !currentItem.image || !currentItem.image.assetId) return

    onUpdate([...gallery, currentItem])
    setIsDialogOpen(false)
    setCurrentItem(null)
  }

  const handleInputChange = (field: keyof Gallery, value: any) => {
    if (!currentItem) return
    setCurrentItem({
      ...currentItem,
      [field]: value,
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const result = await uploadFile(file, {
        entityId: msmeId,
        documentType: "GalleryImage",
        documentName: file.name,
        description: "Gallery Image",
      })

      // Create a temporary Document object for the image
      const imageDoc: Document = {
        id: result?.assetId || "",
        verified: false,
        assetId: result?.assetId || "",
        name: file.name,
        assetCanisterId: [],
        docType: { GalleryImage: null },
        uploadDate: BigInt(Date.now())
      };

      handleInputChange("image", imageDoc);
    }
  }

  // Helper function to get image URL
  const getImageUrl = (item: Gallery) => {
    if (item.image && item.image.assetId && item.image.assetId.startsWith('blob:')) {
      return item.image.assetId;
    }
    return "/placeholder.svg";
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gallery</h3>
        <Button onClick={handleAddItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center p-6 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No gallery images added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                {item.image && item.image.assetId ? (
                  <SingleAssetPreview
                    assetId={item.image.assetId}
                    previewUrlState={logoPreview || undefined}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                  onClick={() => handleDeleteItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image</Label>
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {currentItem?.image && currentItem.image.assetId ? (
                    <div className="relative w-full">
                      <SingleAssetPreview
                        assetId={logoAssetId || currentItem.image?.assetId}
                        previewUrlState={logoPreview || undefined}
                        className="mx-auto max-h-48 object-contain"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-0 right-0"
                        onClick={() => handleInputChange("image", {
                          id: "",
                          verified: false,
                          assetId: "",
                          name: "",
                          assetCanisterId: [],
                          docType: { GalleryImage: null },
                          uploadDate: BigInt(0)
                        })}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload image</p>
                      <Input
                        type="file"
                        className="hidden"
                        id="gallery-image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Label
                        htmlFor="gallery-image"
                        className="mt-2 cursor-pointer rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
                      >
                        Select Image
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-title">Title</Label>
              <Input
                id="image-title"
                value={currentItem?.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter image title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-description">Description</Label>
              <Textarea
                id="image-description"
                value={currentItem?.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter image description"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={!currentItem?.image || !currentItem.image.assetId}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
