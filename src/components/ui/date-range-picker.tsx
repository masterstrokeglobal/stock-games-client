import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { addDays, endOfMonth, format, isAfter, isBefore, isSameDay, startOfMonth, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import { DateRange } from "react-day-picker"


interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange?: (range: DateRange | undefined) => void
    minDate?: Date
    maxDate?: Date
    presets?: boolean
    disabledDates?: Date[]
    tooltipText?: string
    numberOfMonths?: number
    initialDateRange?: DateRange
}

export function DatePickerWithRange({
    className,
    onDateChange,
    minDate,
    maxDate,
    presets = true,
    disabledDates = [],
    numberOfMonths = 2,
    initialDateRange,
    ...props
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(
        initialDateRange || {
            from: new Date(),
            to: addDays(new Date(), 7),
        }
    )

    const [calendarOpen, setCalendarOpen] = React.useState(false)

    const handleDateChange = (newDate: DateRange | undefined) => {
        setDate(newDate)
        onDateChange?.(newDate)
    }

    const presetRanges = React.useMemo(() => [
        {
            label: "Today",
            getValue: () => ({
                from: new Date(),
                to: new Date(),
            }),
        },
        {
            label: "Last 7 Days",
            getValue: () => ({
                from: subDays(new Date(), 6),
                to: new Date(),
            }),
        },
        {
            label: "Last 30 Days",
            getValue: () => ({
                from: subDays(new Date(), 29),
                to: new Date(),
            }),
        },
        {
            label: "This Month",
            getValue: () => ({
                from: startOfMonth(new Date()),
                to: endOfMonth(new Date()),
            }),
        },
    ], [])

    const handlePresetChange = (preset: string) => {
        const selectedPreset = presetRanges.find(p => p.label === preset)
        if (selectedPreset) {
            const newRange = selectedPreset.getValue()
            handleDateChange(newRange)
        }
    }

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return "Pick a date"
        if (!range.to) return format(range.from, "LLL dd, y")
        if (isSameDay(range.from, range.to)) return format(range.from, "LLL dd, y")
        return `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
    }

    return (
        <div className={cn("grid gap-2", className)} {...props}>

            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateRange(date)}
                        {date?.from && date.to && (
                            <span className="ml-auto text-muted-foreground text-sm">
                                {Math.ceil(
                                    (date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)
                                ) + 1} days
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                        {presets && (
                            <Select onValueChange={handlePresetChange}>
                                <SelectTrigger className="w-full mb-2">
                                    <SelectValue placeholder="Select a preset range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {presetRanges.map((preset) => (
                                        <SelectItem key={preset.label} value={preset.label}>
                                            {preset.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateChange}
                        numberOfMonths={numberOfMonths}
                        disabled={(date) => {
                            const isDisabledDate = disabledDates.some((disabledDate) =>
                                isSameDay(date, disabledDate)
                            )
                            const isBeforeMin = minDate && isBefore(date, minDate)
                            const isAfterMax = maxDate && isAfter(date, maxDate)
                            return isDisabledDate || !!isBeforeMin || !!isAfterMax
                        }}
                    />
                    <div className="p-3 border-t">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCalendarOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => setCalendarOpen(false)}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

        </div>
    )
}