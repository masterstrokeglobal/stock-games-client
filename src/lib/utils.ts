import { PlacementType } from "@/models/game-record";
import { RoundRecord } from "@/models/round-record";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const getPlacementString = (bet: { market: number[], placementType: PlacementType }, round: RoundRecord) => {

  const HorseNumbers = bet.market.map((number) => {
    const horseNumber = round.market.find((market) => market.id === number)?.horse;
    return horseNumber || 0;
  }).sort((a, b) => a - b);

  switch (bet.placementType) {

    case PlacementType.SINGLE:
      return `Single ${HorseNumbers[0]}`;
    case PlacementType.SPLIT:
      return `Split ${HorseNumbers[0]}-${HorseNumbers[1]}`;
    case PlacementType.QUARTER:
      return `Quarter ${HorseNumbers[0]} ${HorseNumbers[1]} ${HorseNumbers[2]} ${HorseNumbers[3]}`;
    case PlacementType.STREET:
      // first and last number of the street
      return `Street ${HorseNumbers[0]}-${HorseNumbers[HorseNumbers.length - 1]}`;
    case PlacementType.DOUBLE_STREET:
      // first and last number of the street
      return `DOUBLE STREET ${HorseNumbers[0]} - ${HorseNumbers[HorseNumbers.length - 1]}`;
    case PlacementType.CORNER:
      return `Corner ${HorseNumbers[0]} ${HorseNumbers[1]} ${HorseNumbers[2]} ${HorseNumbers[3]}`;
    case PlacementType.COLUMN:
      return `Column ${HorseNumbers[0]} ${HorseNumbers[HorseNumbers.length - 1]}`;
    case PlacementType.COLOR:
      // show color
      return `${HorseNumbers[0] == 1 ? 'Red' : 'Black'}`;

    case PlacementType.EVEN_ODD:
      // calculate if even or odd
      return `${HorseNumbers[0] % 2 === 0 ? 'Even' : 'Odd'}`;
    case PlacementType.HIGH_LOW:
      // first and last number of the high low
      return `DOUBLE STREET ${HorseNumbers[0]} - ${HorseNumbers[HorseNumbers.length - 1]}`;

    default:
      return '-';

  }
}