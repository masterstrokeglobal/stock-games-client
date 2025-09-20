import { NextResponse } from "next/server";

// Temporary in-memory list for demo purposes only
const GAMES = [
    { name: "Derby", identifier: "derby", thumbnail: "", active: true, order: 1 },
    { name: "Stock Slots", identifier: "stock_slots", thumbnail: "", active: true, order: 2 },
    { name: "Stock Jackpot", identifier: "stock_jackpot", thumbnail: "", active: false, order: 3 },
    { name: "Seven Up Down", identifier: "seven_up_down", thumbnail: "", active: true, order: 4 },
    { name: "Head Tail", identifier: "head_tail", thumbnail: "", active: false, order: 5 },
    { name: "Wheel of Fortune", identifier: "wheel_of_fortune", thumbnail: "", active: false, order: 6 },
    { name: "Aviator", identifier: "aviator", thumbnail: "", active: false, order: 7 },
    { name: "Dice", identifier: "dice", thumbnail: "", active: false, order: 8 },
];

export async function GET() {
    return NextResponse.json({ data: GAMES });
}


