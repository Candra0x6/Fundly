"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImage: string) => void
}

export default function ImageCropper({ image, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteCallback = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return

    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      onCropComplete(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[300px] w-full">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Zoom</p>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={createCroppedImage}>
          Crop Image
        </Button>
      </div>
    </div>
  )
}

// Helper function to create a cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.src = url
  })

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return ""
  }

  // Set canvas size to match the cropped area
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  // Convert canvas to base64 image
  return canvas.toDataURL("image/jpeg")
}
