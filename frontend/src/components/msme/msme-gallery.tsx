"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Play, X } from "lucide-react"

interface MSMEGalleryProps {
  msmeId: string
}

export default function MSMEGallery({ msmeId }: MSMEGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // This would normally be fetched from an API based on the ID
  const gallery = {
    images: [
      {
        id: "1",
        title: "Solar Panel Installation",
        description: "Installation of our solar panels on a residential building in Singapore.",
        url: "/placeholder.svg?height=600&width=800",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "2",
        title: "Manufacturing Facility",
        description: "Our state-of-the-art manufacturing facility in Singapore.",
        url: "/placeholder.svg?height=600&width=800",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "3",
        title: "Product Showcase",
        description: "Our latest solar panel model on display at the Singapore Clean Energy Expo.",
        url: "/placeholder.svg?height=600&width=800",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "4",
        title: "Team at Work",
        description: "Our engineering team working on new solar panel designs.",
        url: "/placeholder.svg?height=600&width=800",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "5",
        title: "Customer Installation",
        description: "A completed installation at a customer's home in Malaysia.",
        url: "/placeholder.svg?height=600&width=800",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
      {
        id: "6",
        title: "Research Lab",
        description: "Our research and development laboratory.",
        url: "/placeholder.svg?height=600&width=800",
        thumbnail: "/placeholder.svg?height=200&width=300",
      },
    ],
    videos: [
      {
        id: "1",
        title: "Company Overview",
        description: "A brief overview of GreenTech Solutions and our mission.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "#",
        duration: "2:45",
      },
      {
        id: "2",
        title: "Product Demo",
        description: "Demonstration of our solar panel installation process.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "#",
        duration: "4:12",
      },
      {
        id: "3",
        title: "Customer Testimonial",
        description: "Hear from one of our satisfied customers in Singapore.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "#",
        duration: "3:18",
      },
    ],
    products: [
      {
        id: "1",
        title: "GreenTech Solar Panel X1",
        description: "Our flagship solar panel with 22% efficiency.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "/placeholder.svg?height=600&width=800",
      },
      {
        id: "2",
        title: "GreenTech Solar Panel X2",
        description: "Our premium solar panel with 25% efficiency and sleek design.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "/placeholder.svg?height=600&width=800",
      },
      {
        id: "3",
        title: "GreenTech Monitoring System",
        description: "Real-time monitoring system for solar energy production and consumption.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "/placeholder.svg?height=600&width=800",
      },
      {
        id: "4",
        title: "GreenTech Installation Kit",
        description: "Complete installation kit for DIY enthusiasts.",
        thumbnail: "/placeholder.svg?height=200&width=300",
        url: "/placeholder.svg?height=600&width=800",
      },
    ],
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="images">
        <TabsList className="mb-6">
          <TabsTrigger value="images" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="cursor-pointer"
                onClick={() => setSelectedImage(image.url)}
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-video bg-zinc-100 relative">
                    <img
                      src={image.thumbnail || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm">{image.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{image.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-video bg-zinc-100 relative">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-emerald-500/90 flex items-center justify-center">
                        <Play className="h-5 w-5 text-white" fill="white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm">{video.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{video.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gallery.products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="cursor-pointer"
                onClick={() => setSelectedImage(product.url)}
              >
                <Card className="overflow-hidden h-full">
                  <div className="aspect-video bg-zinc-100 relative">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-sm">{product.title}</h3>
                    <p className="text-zinc-500 text-xs mt-1">{product.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Image Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <img src={selectedImage || "/placeholder.svg"} alt="Enlarged view" className="w-full h-auto rounded-lg" />
          </div>
        </motion.div>
      )}
    </div>
  )
}
