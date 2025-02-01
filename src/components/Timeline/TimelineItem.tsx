import { Heart, Star } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

type TimelineItemProps = {
  type: "event" | "site"
  name: string
  description: string
  tagline?: string
  imageURL?: string
  date?: string
  rating?: number
}

export function TimelineItem({ type, name, description, tagline, imageURL, date, rating }: TimelineItemProps) {
  return (
    <Card className="group relative overflow-hidden rounded-xl border-0 bg-background">
      <div className="relative aspect-[1/1] w-full overflow-hidden rounded-xl">
        <button
          className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition hover:bg-white"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
        <Image
          src={
            imageURL ||
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen%20Shot%202025-01-31%20at%207.17.48%20PM-Vs1xl3asQ3Qb9dzmePCoiKK19zTXan.png"
          }
          alt={name}
          className="object-cover transition group-hover:scale-105"
          fill
        />
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/80 backdrop-blur-sm" aria-hidden="true" />
          ))}
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{name}</h3>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-primary" />
              <span className="text-sm">{rating}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {date && <p className="mt-1 text-xs text-muted-foreground">{date}</p>}
        {tagline && <p className="mt-2 text-xs font-medium text-primary">{tagline}</p>}
      </div>
    </Card>
  )
}

