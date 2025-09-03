import { PlacementType } from "@/models/game-record";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord, RoundRecordGameType } from "@/models/round-record";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
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

  const HorseNumbers = bet.market?.map((number) => {
    const horseNumber = round.market?.find((market) => market.id === number)?.horse;
    return horseNumber || 0;
  }).sort((a, b) => a - b);

  switch (bet.placementType) {

    case PlacementType.SINGLE:
      return `Single ${HorseNumbers[0] == 17 ? '0' : HorseNumbers[0]}`;
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




export const HIGHLIGHT_APP_KEY = process.env.NEXT_PUBLIC_HIGHLIGHT_APP_KEY

export const indianNames: string[] = [
  // North Indian Names
  "Aarav", "Advait", "Arjun", "Vihaan", "Ishaan",
  "Aditya", "Reyansh", "Krish", "Arnav", "Vivaan",
  "Rohan", "Siddharth", "Rahul", "Vikram", "Amit",
  "Karan", "Varun", "Rishabh", "Ayaan", "Shaurya",

  // South Indian Names
  "Arun", "Krishna", "Karthik", "Naveen", "Srinivas",
  "Rajesh", "Suresh", "Dinesh", "Mahesh", "Ganesh",
  "Pradeep", "Shankar", "Vijay", "Mohan", "Ravi",
  "Anand", "Murali", "Prasad", "Ashok", "Sanjay",

  // West Indian Names
  "Kunal", "Harsh", "Jay", "Yash", "Parth",
  "Chirag", "Sachin", "Hitesh", "Nikhil", "Vishal",

  // East Indian Names
  "Ananya", "Priya", "Shreya", "Aisha", "Myra",
  "Sneha", "Divya", "Pooja", "Neha", "Deepa",
  "Riya", "Sanya", "Trisha", "Meera", "Preeti",

  // North-East Indian Names
  "Bikash", "Bhaskar", "Dipak", "Pranab", "Ratan",

  // Maharashtra and Gujarat Names
  "Raj", "Sameer", "Mihir", "Jatin", "Chirag",
  "Pooja", "Shruti", "Nisha", "Minal", "Anjali",

  // Bengali Names
  "Sourav", "Subrata", "Debanjan", "Arpan", "Suman",
  "Swapna", "Madhuri", "Rituparna", "Soma", "Tanusree",

  // Punjabi Names
  "Gurpreet", "Mandeep", "Harpreet", "Jagdeep", "Sukhwinder",
  "Simran", "Navpreet", "Jaspreet", "Amarjeet", "Parminder",

  // Unique and Modern Names
  "Aadhya", "Zara", "Ishita", "Kabir", "Rehan",
  "Alia", "Veer", "Isha", "Aryan", "Sia"
];

export const secondNames: string[] = [
  // North Indian Surnames
  "Kumar", "Singh", "Patel", "Sharma", "Mishra",
  "Gupta", "Verma", "Yadav", "Shah", "Jain",
  "Agarwal", "Mahajan", "Malhotra", "Chopra", "Batra",
  "Kapoor", "Mehra", "Saini", "Dhawan", "Khanna",
  "Saxena", "Bakshi", "Mehta", "Nanda", "Gandhi",
  "Desai", "Chaudhary", "Talwar", "Bedi", "Vohra",

  // South Indian Surnames
  "Naidu", "Reddy", "Rao", "Krishna", "Murthy",
  "Narayanan", "Pillai", "Iyer", "Nair", "Raman",
  "Krishnamurthy", "Swaminathan", "Chandrasekhar", "Subramanian", "Venkatesh",
  "Gopalan", "Srinivasan", "Mahadevan", "Shankar", "Prabhu",
  "Natarajan", "Ramakrishnan", "Vasudevan", "Balasubramanian", "Padmanabhan",

  // West Indian Surnames
  "Parekh", "Doshi", "Thakkar", "Modi", "Desai",
  "Parikh", "Gandhi", "Merchant", "Kothari", "Vora",
  "Trivedi", "Dave", "Panchal", "Joshi", "Prajapati",
  "Suthar", "Chauhan", "Bhatt", "Raval", "Choksi",

  // East Indian Surnames
  "Banerjee", "Chatterjee", "Mukherjee", "Dutta", "Ghosh",
  "Roy", "Bose", "Sen", "Das", "Mondal",
  "Sarkar", "Biswas", "Ganguly", "Majumdar", "Chakrabarti",
  "Bhattacharya", "Kar", "Halder", "Pal", "Kundu",

  // Northeast Indian Surnames
  "Gogoi", "Saikia", "Baruah", "Borah", "Hazarika",
  "Phukan", "Bordoloi", "Kalita", "Deka", "Das",
  "Chaliha", "Goswami", "Lahkar", "Medhi", "Bhattacharyya",

  // Maharashtrian Surnames
  "Patil", "Deshpande", "Kulkarni", "Joshi", "Deshmukh",
  "Kale", "Jadhav", "Chavan", "Bhosale", "Kardile",
  "Sawant", "Shinde", "Salunkhe", "Nimbalkar", "Shirke",

  // Regional Variations
  "Rajput", "Chowdhury", "Kamble", "Rathore", "Soreng",
  "Minz", "Toppo", "Besra", "Hembram", "Kandulna",
  "Ansari", "Qureshi", "Siddiqui", "Mansoori", "Saifi",

  // Rare and Unique Surnames
  "Ambedkar", "Chagla", "Dhebar", "Duggal", "Fazalbhoy",
  "Gaitonde", "Kakkar", "Lele", "Nanavati", "Pasricha",
  "Ramachandran", "Shenoy", "Tahiliani", "Vakil", "Wadia",

  // Extended List for Diversity
  "Abraham", "Jacob", "Thomas", "Samuel", "Benjamin",
  "Emmanuel", "Daniel", "Joseph", "George", "John",
  "Koshy", "Mathew", "Varghese", "Eapen", "Chacko",

  // Repeat some common surnames to increase representation
  "Patel", "Singh", "Kumar", "Sharma", "Gupta",
  "Mishra", "Yadav", "Shah", "Jain", "Verma"
];


export const INR = (rupees: string | number | undefined, nodecimal: boolean = false, gap: boolean = false) => {
  // convert number into RUpees
  if (!rupees) return '0.00';
  const number = Number(rupees);

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: nodecimal ? 0 : 2,
    maximumFractionDigits: nodecimal ? 0 : 2
  }).format(number);

  // Add a space between the currency symbol and the number
  return formatted.replace('₹', gap ? '₹ ' : '₹');
}

export const RED_BLACK_ROULETTE_NUMBERS = [
  { number: 1, color: 'red' }, { number: 2, color: 'red' }, { number: 3, color: 'red' }, { number: 4, color: 'red' },
  { number: 5, color: 'red' }, { number: 6, color: 'red' }, { number: 7, color: 'red' }, { number: 8, color: 'red' },
  { number: 9, color: 'black' }, { number: 10, color: 'black' }, { number: 11, color: 'black' }, { number: 12, color: 'black' },
  { number: 13, color: 'black' }, { number: 14, color: 'black' }, { number: 15, color: 'black' }, { number: 16, color: 'black' }
];

export const ROULETTE_NUMBERS = [
  { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' }, { number: 4, color: 'black' },
  { number: 5, color: 'black' }, { number: 6, color: 'red' }, { number: 7, color: 'black' }, { number: 8, color: 'red' },
  { number: 9, color: 'red' }, { number: 10, color: 'black' }, { number: 11, color: 'red' }, { number: 12, color: 'black' },
  { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' }, { number: 16, color: 'red' }
];

export const ROULETTE_COLORS = [
  { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' }, { number: 4, color: 'black' },
  { number: 5, color: 'black' }, { number: 6, color: 'red' }, { number: 7, color: 'black' }, { number: 8, color: 'red' },
  { number: 9, color: 'red' }, { number: 10, color: 'black' }, { number: 11, color: 'red' }, { number: 12, color: 'black' },
  { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' }, { number: 16, color: 'red' }, { number: 17, color: 'green' }
];

export const googleAuth = () => {
  window.open(
    ` ${process.env.NEXT_PUBLIC_API_URL}auth/google?companyId=${process.env.NEXT_PUBLIC_COMPANY_ID}`,
    "_self"
  );
};

export const RED_NUMBERS = [1, 3, 6, 8, 9, 11, 14, 16];
export const BLACK_NUMBERS = [2, 4, 5, 7, 10, 12, 13, 15];
export const deepClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}

export const COMPANYID = Number(process.env.NEXT_PUBLIC_COMPANY_ID) ?? 4;

export const PLATFORMFEES = 4

export const LOBBY_PLATFORM_FEES = 10

export const LEVERAGE_MULTIPLIER = 10;

export const randomUsername = () => {
  return indianNames[Math.floor(Math.random() * indianNames.length)] + " " + secondNames[Math.floor(Math.random() * secondNames.length)];
}


export const randomNumber = (min: number, max: number, multiple: number) => {
  //multiple of 100
  return Math.floor(Math.random() * (max - min + 1)) * multiple;
}


export const formatRupee = (rupees: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(rupees);
}

// Generate current time in 12-hour format (HH:MM AM/PM)
const getCurrentTime = () => {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`
}

// Generate random data
export const generateData = (count: number) => {
  const data = []

  for (let i = 0; i < count; i++) {
    const user = randomUsername()
    const time = getCurrentTime()
    const amount = randomNumber(50, 5000, 10).toString()

    data.push({
      id: Date.now() + i,
      user,
      time,
      amount,
    })
  }

  return data
}

export const SPORTS_BOOK_GAMEID = process.env.NEXT_PUBLIC_SPORTS_BOOK_GAMEID ?? 8653;

export const generateNewCameraPosition = (currentPosition: [number, number, number]) => {
  const [x, y, z] = currentPosition;

  // rotate around the y axis
  const newX = x * Math.cos(Math.PI / 4) - z * Math.sin(Math.PI / 4);
  const newZ = x * Math.sin(Math.PI / 4) + z * Math.cos(Math.PI / 4);

  return [newX, y, newZ];
}

export const baseTheme = {
  "radius": "0.5rem;",
  "primary": "#040029",
  "gameText": "#07171F",
  "tertiary": "#000000",
  "secondary": "#ADEBFF",
  "chip-color": "#f78a32",
  "borderColor": "#280079",
  "input-field": "#000000",
  "top-bar-text": "#FFFFFF",
  "backgroundGame": "#000E37",
  "bet-button-end": "#279BFF",
  "bet-button-mid": "#4DAAFF",
  "last-winner-bg": "#a0b1c3",
  "redGradientEnd": "#ad0707",
  "accent-secondary": "#5fd9ed",
  "bet-button-start": "#0D7FE1",
  "blackGradientEnd": "#000000",
  "innerShadowColor": "rgba(208, 232, 253, 0.05)",
  "redGradientStart": "#ad0707",
  "bet-button-border": "#55B0FF",
  "gameTextSecondary": "#FFFFFF",
  "blackGradientStart": "#000000",
  "gameHeaderHighlight": "linear-gradient(to right, #fafafa, transparent)",
  "secondary-background": "#003459",
  "input-field-background": "#ffffff"
};

export const decodeUrlString = (encoded: string): string => {
  return decodeURIComponent(encoded);
}


export const schedulerTypeOptions = Object.values(SchedulerType).map((type) => ({
  label: type,
  value: type
}));


export const slotWinningMultiplier = [
  {
    multiplier: 8.5,
    winningAmount: (betAmount: number) => betAmount * .98 * 8.5,
    count: 2
  },
  {
    multiplier: 85,
    winningAmount: (betAmount: number) => betAmount * .98 * 85,
    count: 3
  },
  {
    multiplier: 800,
    winningAmount: (betAmount: number) => betAmount * .98 * 800,
    count: 4
  },
  {
    multiplier: 8000,
    winningAmount: (betAmount: number) => betAmount * .98 * 8000,
    count: 5
  },
]

export const SEVEN_UP_DOWN_MULTIPLIER = 2;
export const JACKPOT_MULTIPLIER = 1.96;

export const SEVEN_UP_DOWN_MULTIPLIER_7 = 14.7;

export const COIN_HEAD_TAIL_MULTIPLIER = 2


// Dice multipliers
export const DICE_WINNING_MULTIPLIER_2 = 24;
export const DICE_WINNING_MULTIPLIER_3 = 16;
export const DICE_WINNING_MULTIPLIER_4 = 10;
export const DICE_WINNING_MULTIPLIER_5 = 8;
export const DICE_WINNING_MULTIPLIER_6 = 6;
export const DICE_WINNING_MULTIPLIER_7 = 5;
export const DICE_WINNING_MULTIPLIER_8 = 6;
export const DICE_WINNING_MULTIPLIER_9 = 8;
export const DICE_WINNING_MULTIPLIER_10 = 10;
export const DICE_WINNING_MULTIPLIER_11 = 16;
export const DICE_WINNING_MULTIPLIER_12 = 24;



export const stockGames = [
    {
        href: `/game/single-player/roulette`,
        src: "/images/banner/roulette.png",
        alt: "stock-roulette",
        name: "Stock Roulette",
        type : RoundRecordGameType.DERBY
    },
    {
        href: "/game/single-player/jackpot",
        src: "/images/banner/hi-lo.png",
        name: "Hi Low",
        alt: "coming-soon",
        type : RoundRecordGameType.STOCK_JACKPOT
    },
    {

        href: "/game/single-player/stock-slot",
        src: "/images/banner/stock-slot.png",
        name: "Stock Slot",
        alt: "coming-soon",
        type : RoundRecordGameType.STOCK_SLOTS
    },
    {
        href: "/game/single-player/7-up-down",
        src: "/images/banner/7-up-down.png",
        name: "7 Up Down",
        alt: "coming-soon",
        type : RoundRecordGameType.SEVEN_UP_DOWN
    },
    {
        href: "/game/single-player/head-tail",
        src: "/images/banner/coin-toss.png",
        name: "Head Tail",
        alt: "coming-soon",
        type : RoundRecordGameType.HEAD_TAIL
    },
    {
        href: "/game/single-player/wheel-of-fortune",
        src: "/images/banner/wheel-of-fortune.png",
        name: "Wheel Of Fortune",
        alt: "coming-soon",
        type : RoundRecordGameType.WHEEL_OF_FORTUNE
      },
    {
        href: "/game/single-player/dice-game",
        src: "/images/banner/dice-game.png",
        name: "Dice Game",
        alt: "coming-soon",
        type : RoundRecordGameType.DICE
    },
    // {
    //     href: "/game/single-player/aviator",
    //     // href: "/game/platform/stock-game/aviator",
    //     src: "/images/banner/aviator.png",
    //     name: "Aviator",
    //     alt: "coming-soon",
    //     type : RoundRecordGameType.AVIATOR
    // }
]

export type StockGame = {
    href: string;
    src: string;
    name: string;
    alt: string;
    type: RoundRecordGameType;
}
export const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID??""
export const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID??""

export const isTawkEnabled = !!TAWK_PROPERTY_ID && !!TAWK_WIDGET_ID;


export const copyToClipboard = async (text: string) => {
  try {
      await navigator.clipboard.writeText(text);
      toast.success("Wallet address copied to clipboard");
  } catch (err) {
      console.error(err);
      toast.error("Failed to copy wallet address");
  }
};

export const getRandomPlacementString = () => {
  const randomIndex = randomNumber(0,5,1);
    switch(randomIndex){
      case 0:
        return `Single ${randomNumber(1,16,1)}`
      case 1:
        return "Red"
      case 2:
        return "Black"
      case 3:
        return "Even"
      case 4:
        return "Odd"

      default:
        return `Single ${randomNumber(1,16,1)}`
    }
}
