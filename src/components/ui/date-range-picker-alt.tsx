"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays, endOfMonth, format, isAfter, isBefore, isSameDay, startOfMonth, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  onDateChange?: (range: DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  numberOfMonths?: number;
  initialDateRange?: DateRange;
  showPresets?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  withDaysBadge?: boolean;
  placeholder?: string;
};

export default function DateRangePickerAlt({
  className,
  onDateChange,
  minDate,
  maxDate,
  disabledDates = [],
  numberOfMonths = 2,
  initialDateRange,
  showPresets = true,
  triggerClassName,
  contentClassName,
  withDaysBadge = true,
  placeholder = "Pick a date",
  ...props
}: Props) {
  // Applied range is the committed value shown in the trigger and emitted on Apply
  const [appliedDate, setAppliedDate] = React.useState<DateRange | undefined>(
    initialDateRange || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  );
  // Draft range is the in-popover selection before Apply
  const [draftDate, setDraftDate] = React.useState<DateRange | undefined>(appliedDate);

  const [open, setOpen] = React.useState(false);

  // When popover opens, start editing from appliedDate
  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (val) {
      setDraftDate(appliedDate);
    }
  };

  const presets = React.useMemo(
    () => [
      { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
      { label: "Last 7 Days", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
      { label: "Last 30 Days", getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
      { label: "This Month", getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
    ],
    []
  );

  const handlePresetChange = (key: string) => {
    const p = presets.find((x) => x.label === key);
    if (p) setDraftDate(p.getValue());
  };

  const formatRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;
    if (!range.to) return format(range.from, "LLL dd, y");
    if (isSameDay(range.from, range.to)) return format(range.from, "LLL dd, y");
    return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`;
  };

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              "w-[280px] sm:w-[320px] pl-3 gap-2",
              !appliedDate && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatRange(appliedDate)}
            {withDaysBadge && appliedDate?.from && appliedDate.to && (
              <span className="ml-auto text-muted-foreground text-sm">
                {Math.ceil((appliedDate.to.getTime() - appliedDate.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", contentClassName)} align="start">
          {showPresets && (
            <div className="p-3 border-b">
              <Select onValueChange={handlePresetChange}>
                <SelectTrigger className="w-full mb-2 text-black">
                  <SelectValue placeholder="Select a preset range" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.label} value={preset.label}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={draftDate?.from}
            selected={draftDate}
            onSelect={setDraftDate}
            numberOfMonths={numberOfMonths}
            disabled={(d) => {
              const isDisabledDate = disabledDates.some((dd) => isSameDay(d, dd));
              const beforeMin = minDate && isBefore(d, minDate);
              const afterMax = maxDate && isAfter(d, maxDate);
              return isDisabledDate || !!beforeMin || !!afterMax;
            }}
          />
          <div className="p-3 border-t">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => { setDraftDate(appliedDate); setOpen(false); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => { setAppliedDate(draftDate); onDateChange?.(draftDate); setOpen(false); }}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}


