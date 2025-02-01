import { TimelineItem } from "./TimelineItem"

type Event = {
  id: string
  name: string
  description: string
  date: string
  imageURL?: string
  rating?: number
  tagline?: string
}

type Site = {
  id: string
  name: string
  description: string
  imageURL?: string
  rating?: number
  tagline?: string
}

type TimelineProps = {
  items: (Event | Site)[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          type={"date" in item ? "event" : "site"}
          name={item.name}
          description={item.description}
          imageURL={item.imageURL}
          date={"date" in item ? item.date : undefined}
          rating={item.rating}
          tagline={item.tagline}
        />
      ))}
    </div>
  )
}

