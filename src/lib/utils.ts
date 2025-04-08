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
      return `Single ${HorseNumbers[0] == 17? '0' : HorseNumbers[0]}`;
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


export const INR = (rupees: string) => {
  // convert number into RUpees
  const number = Number(rupees);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(number);
}

export const ROULETTE_NUMBERS = [
  { number: 1, color: 'red' }, { number: 2, color: 'black' }, { number: 3, color: 'red' }, { number: 4, color: 'black' },
  { number: 5, color: 'black' }, { number: 6, color: 'red' }, { number: 7, color: 'black' }, { number: 8, color: 'red' },
  { number: 9, color: 'red' }, { number: 10, color: 'black' }, { number: 11, color: 'red' }, { number: 12, color: 'black' },
  { number: 13, color: 'black' }, { number: 14, color: 'red' }, { number: 15, color: 'black' }, { number: 16, color: 'red' }
];

export const googleAuth = () => {
  window.open(
      ` ${process.env.NEXT_PUBLIC_API_URL}auth/google?companyId=${process.env.NEXT_PUBLIC_COMPANY_ID}`,
      "_self"
  );
};

export const RED_NUMBERS = [1, 3, 6, 8, 9, 11, 14, 16];
export const BLACK_NUMBERS = [2, 4, 5, 7, 10, 12, 13, 15];
export const  deepClone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}

export const COMPANYID = Number(process.env.NEXT_PUBLIC_COMPANY_ID) ?? 4;

export const PLATFORMFEES = 4

export const LOBBY_PLATFORM_FEES = 10

export const LEVERAGE_MULTIPLIER = 10;
