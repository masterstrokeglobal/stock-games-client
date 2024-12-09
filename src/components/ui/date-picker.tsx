"use client";

import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import React from "react";

interface DatePickerProps {
  value?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  label?: string;
}

function DatePicker({
  value,
  onSelect,
  className,
  label}: DatePickerProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-2">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "pl-3  text-left font-normal",
              !value && "text-muted-foreground",
              className
            )}
          >
            {value ? (
              dayjs(value).format("DD MMM YYYY")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              if (date && onSelect) {
                onSelect(date);
              }
            }}
            toDate={dayjs().add(1, "year").toDate()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;