"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface MediaItem {
  type: "image" | "video"
  url: string
}

interface MediaSelectorProps {
  onMediaChange: (newItems: MediaItem[]) => void
  maxItems: number
  currentItems: MediaItem[]
}

export function MediaSelector({ onMediaChange, maxItems, currentItems }: MediaSelectorProps) {
  const [visualType, setVisualType] = useState<"file" | "link">("file")
  const [visualLink, setVisualLink] = useState("")
  const [submittingCloudinary, setSubmittingCloudinary] = useState(false)
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null)

  const reset = () => {
    setVisualLink("")
    setSubmittingCloudinary(false)
  }

  const uploadFile = useCallback(
    async (file: File) => {
      setSubmittingCloudinary(true)
      const url = `https://api.cloudinary.com/v1_1/dkyzbymam/upload`
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "guide-ul")

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        const newItems: MediaItem[] = [...currentItems, { type: "image", url: data.secure_url }]
        onMediaChange(newItems)
      } catch (error) {
        console.error("Error uploading file:", error)
      } finally {
        setSubmittingCloudinary(false)
      }
    },
    [currentItems, onMediaChange],
  )

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/
    return youtubeRegex.test(url)
  }

  const isValidImageUrl = (url: string) => {
    const imageRegex = /\.(jpeg|jpg|gif|png|webp)$/i
    return imageRegex.test(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("image/")) {
        uploadFile(file)
      } else {
        alert("Please upload only image files.")
      }
    }
    e.target.value = ""
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value
    setVisualLink(link)
  }

  const handleAddLink = () => {
    if (visualLink && (isValidImageUrl(visualLink) || isValidYouTubeUrl(visualLink))) {
      const newItems: MediaItem[] = [
        ...currentItems,
        {
          type: isValidYouTubeUrl(visualLink) ? "video" : "image",
          url: visualLink,
        },
      ]
      onMediaChange(newItems)
      setVisualLink("")
    } else {
      alert("Please provide a valid image URL or YouTube video link.")
    }
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...currentItems]
    newItems.splice(index, 1)
    onMediaChange(newItems)
    if (expandedImageIndex === index) {
      setExpandedImageIndex(null)
    }
  }

  const handleImageClick = (index: number) => {
    if (currentItems[index].type === "image") {
      setExpandedImageIndex(expandedImageIndex === index ? null : index)
    }
  }

  return (
    <div className="space-y-4">
      {currentItems.length < maxItems && (
        <>
          <RadioGroup
            defaultValue="file"
            onValueChange={(value) => setVisualType(value as "file" | "link")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="file" id="file" />
              <Label htmlFor="file">Upload Image</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="link" id="link" />
              <Label htmlFor="link">Image/Video URL</Label>
            </div>
          </RadioGroup>

          {visualType === "file" && (
            <div>
              <Input
                id="visual-file"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={submittingCloudinary}
              />
              {submittingCloudinary && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            </div>
          )}
          {visualType === "link" && (
            <div className="flex space-x-2">
              <Input
                id="visual-link"
                type="url"
                placeholder="Enter URL for image or YouTube video"
                value={visualLink}
                onChange={handleLinkChange}
              />
              <Button onClick={handleAddLink} disabled={!visualLink}>
                Add
              </Button>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {currentItems.map((item, index) => (
          <div key={index} className="relative aspect-square">
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={(e) => {
                e.stopPropagation()
                handleRemoveItem(index)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            {item.type === "video" ? (
              <div className="w-full h-full" onClick={() => handleImageClick(index)}>
                <iframe
                  className="w-full h-full object-cover"
                  src={`https://www.youtube.com/embed/${item.url.split("v=")[1]}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img
                src={item.url || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleImageClick(index)}
              />
            )}
          </div>
        ))}
      </div>

      {expandedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setExpandedImageIndex(null)}
        >
          <div className="relative max-w-4xl w-full h-full max-h-[90vh] flex items-center justify-center">
            <img
              src={currentItems[expandedImageIndex].url || "/placeholder.svg"}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => setExpandedImageIndex(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

