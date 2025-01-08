import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const timeOptions = [
  { label: "12AM - 1AM", value: "00:00:00" },
  { label: "1AM - 2AM", value: "01:00:00" },
  { label: "2AM - 3AM", value: "02:00:00" },
  { label: "3AM - 4AM", value: "03:00:00" },
  { label: "4AM - 5AM", value: "04:00:00" },
  { label: "5AM - 6AM", value: "05:00:00" },
  { label: "6AM - 7AM", value: "06:00:00" },
  { label: "7AM - 8AM", value: "07:00:00" },
  { label: "8AM - 9AM", value: "08:00:00" },
  { label: "9AM - 10AM", value: "09:00:00" },
  { label: "10AM - 11AM", value: "10:00:00" },
  { label: "11AM - 12PM", value: "11:00:00" },
  { label: "12PM - 1PM", value: "12:00:00" },
  { label: "1PM - 2PM", value: "13:00:00" },
  { label: "2PM - 3PM", value: "14:00:00" },
  { label: "3PM - 4PM", value: "15:00:00" },
  { label: "4PM - 5PM", value: "16:00:00" },
  { label: "5PM - 6PM", value: "17:00:00" },
  { label: "6PM - 7PM", value: "18:00:00" },
  { label: "7PM - 8PM", value: "19:00:00" },
  { label: "8PM - 9PM", value: "20:00:00" },
  { label: "9PM - 10PM", value: "21:00:00" },
  { label: "10PM - 11PM", value: "22:00:00" },
  { label: "11PM - 12AM", value: "23:00:00" }
];