"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, VideoIcon, PackageIcon, Eye, Play } from "lucide-react"
import { useStorageActor } from "@/utility/actors/storageActor"
import { useAssetPreview } from "@/hooks/useAssetPreview"
import { MSME } from "@declarations/msme_registration/msme_registration.did"

interface MSMEGalleryProps {
  msme: MSME
}

export default function MSMEGallery({ msme }: MSMEGalleryProps) {
  if (!msme.gallery || msme.gallery.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No gallery items available</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Images */}
      {msme.gallery[0].length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-zinc-500" />
            Images
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {msme.gallery[0].map((image, index) => (
              <GalleryItem key={index} type="image" assetId={image.image.assetId} title={image.title} description={image.description} />
            ))}
          </div>
        </div>
      )}


    </div>
  )
}

interface GalleryItemProps {
  type: "image" | "video" | "product"
  assetId: string
  title: string
  description: string
}

function GalleryItem({ type, assetId, title, description }: GalleryItemProps) {
  const { previewUrl, isLoading } = useAssetPreview(assetId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-zinc-100">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <img
                src={previewUrl || "/placeholder.svg"}
                alt={title}
                className="w-full h-full object-cover"
              />
              {type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <CardContent className="p-4">
          <h4 className="font-medium mb-1">{title}</h4>
          <p className="text-sm text-zinc-600 line-clamp-2">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
