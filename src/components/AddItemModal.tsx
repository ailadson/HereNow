import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, MapPinIcon } from "lucide-react"

type ItemType = "event" | "site"

export function AddItemModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [itemType, setItemType] = useState<ItemType>("event")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup defaultValue="event" onValueChange={(value) => setItemType(value as ItemType)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="event" id="event" />
              <Label htmlFor="event" className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Event
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="site" id="site" />
              <Label htmlFor="site" className="flex items-center">
                <MapPinIcon className="mr-2 h-4 w-4" />
                Site
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" required />
          </div>

          {itemType === "event" && (
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="datetime-local" required />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="imageURL">Image URL</Label>
            <Input id="imageURL" type="url" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoURL">Video URL</Label>
            <Input id="videoURL" type="url" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalLink">External Link</Label>
            <Input id="externalLink" type="url" />
          </div>

          <Button type="submit">Add Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

