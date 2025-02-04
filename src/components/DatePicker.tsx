"use client"

import { useState } from "react"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { formatRelative, format, isSameWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { addDays, set } from "date-fns"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import "react-datepicker/dist/react-datepicker.css"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"

interface DatePickerInputProps {
  onDateSelected: (date: Date) => void
}

export const DatePickerInput = (({ onDateSelected }: DatePickerInputProps) => {
  const [date, setDate] = React.useState<Date>()
  const [time, setTime] = React.useState<string>("")

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value)
  }

  const combinedDateTime = React.useMemo(() => {
    if (date && time) {
      const [hours, minutes] = time.split(":")
      const newDate = new Date(date)
      newDate.setHours(Number.parseInt(hours, 10))
      newDate.setMinutes(Number.parseInt(minutes, 10))
      return newDate
    }
    return null
  }, [date, time])

  React.useEffect(() => {
    if (combinedDateTime) {
      onDateSelected(combinedDateTime)
    }
  }, [combinedDateTime, onDateSelected])


  return (
    <div onClick={e => e.stopPropagation()}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal", !combinedDateTime && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {combinedDateTime ? format(combinedDateTime, "PPP p") : <span>Pick a date and time</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="border-b sm:border-b-0 sm:border-r">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </div>
            <div className="p-3">
              <Label htmlFor="time" className="text-sm font-medium">
                Time
              </Label>
              <div className="flex items-center mt-1">
                <ClockIcon className="mr-2 h-4 w-4 opacity-50" />
                <Input type="time" id="time" value={time} onChange={handleTimeChange} className="w-full" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <div className="absolute" id="root-portal" />
    </div>
  )
})