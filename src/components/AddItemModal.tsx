import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CalendarIcon,
  MapPinIcon,
  ChevronDown,
  Type,
  Image,
  Link2,
  MessageSquare,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { createEvent } from "@/lib/actions/eventActions";
import { createSite } from "@/lib/actions/siteActions";
import { DatePickerInput } from "./DatePicker";
import { MediaSelector } from "./MediaSelector";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().optional(),
  mediaItems: z
    .array(
      z.object({
        type: z.enum(["image", "video"]),
        url: z.string().url(),
      }),
    )
    .max(10, "You can upload up to 10 media items"),
  externalLink: z.string().optional(),
  itemType: z.enum(["event", "site"]),
  userId: z.string().uuid(),
})

export type AddItemFormDataType = z.infer<typeof formSchema>

export function AddItemModal() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const modalStatePushed = useRef(false)

  const form = useForm<AddItemFormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      itemType: "event",
      mediaItems: [],
      externalLink: "",
    },
  })

  useEffect(() => {
    if (isOpen && !modalStatePushed.current) {
      window.history.pushState({ isModal: true }, "")
      modalStatePushed.current = true
    }
  }, [isOpen])

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (modalStatePushed.current) {
        setIsOpen(false)
        modalStatePushed.current = false
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (!isOpen && modalStatePushed.current) {
      window.history.back()
      modalStatePushed.current = false
    }
  }, [isOpen])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      let result
      if (data.itemType === "event") {
        result = await createEvent({} as unknown, data)
      } else {
        result = await createSite({} as unknown, data)
      }

      if (result.error) {
        setError(result.error)
        return
      }

      setIsOpen(false)
      form.reset()
      setCurrentPage(1)
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextPage = async () => {
    if (currentPage === 1) {
      const isValid = await form.trigger(["name", "tagline", "description", "date", "itemType", "externalLink"])
      if (isValid) {
        setCurrentPage(2)
      }
    }
  }

  const handlePreviousPage = () => {
    if (currentPage === 2) {
      setCurrentPage(1)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            Add New <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              setIsOpen(true)
              form.setValue("itemType", "event")
            }}
          >
            Event
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setIsOpen(true)
              form.setValue("itemType", "site")
            }}
          >
            Site
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            "max-h-[90vh] w-[90vw] max-w-[1000px] overflow-y-auto",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-300",
          )}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add New {form.watch("itemType") === "event" ? "Event" : "Site"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && <p className="text-red-500">{error}</p>}
              {currentPage === 1 && (
                <>
                  <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                    <FormField
                      control={form.control}
                      name="itemType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Item Type</FormLabel>
                          <FormDescription className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Choose your transformative experience: Event or Site?
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="event" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <CalendarIcon className="mr-2 h-4 w-4 inline" />
                                  Event
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="site" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <MapPinIcon className="mr-2 h-4 w-4 inline" />
                                  Site
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("itemType") === "event" && (
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormDescription className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              Choose a date for this transformative gathering.
                            </FormDescription>
                            <FormControl>
                              <DatePickerInput onDateSelected={(date) => field.onChange(date.toISOString())} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormDescription className="flex items-center">
                          <Type className="mr-2 h-4 w-4" />
                          Give your {form.watch("itemType")} a name that resonates with seekers.
                        </FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormDescription className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Craft a brief, inspiring message to capture the essence.
                        </FormDescription>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormDescription className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Paint a vivid picture of the spiritual journey awaiting participants.
                        </FormDescription>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="externalLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Link</FormLabel>
                        <FormDescription className="flex items-center">
                          <Link2 className="mr-2 h-4 w-4" />
                          Provide a link for more information about your {form.watch("itemType")}.
                        </FormDescription>
                        <FormControl>
                          <Input {...field} placeholder="optional" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="button" onClick={handleNextPage}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}

              {currentPage === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="mediaItems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media (Up to {field.value.length}/10 items)</FormLabel>
                        <FormDescription className="flex items-center">
                          <Image className="mr-2 h-4 w-4" />
                          Share images or videos that capture the essence of your {form.watch("itemType")}.
                        </FormDescription>
                        <FormControl>
                          <MediaSelector
                            onMediaChange={(newItems) => form.setValue("mediaItems", newItems)}
                            maxItems={10}
                            currentItems={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" onClick={handlePreviousPage}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Manifesting..." : `Share this ${form.watch("itemType")} with the World`}
                    </Button>
                  </div>
                </>
              )}

            <Input type="hidden" {...form.register("userId")} defaultValue={session?.user.id} />
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
