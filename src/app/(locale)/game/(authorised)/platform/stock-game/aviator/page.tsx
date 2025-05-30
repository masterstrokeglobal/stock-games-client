    "use client"

    import { Button } from "@/components/ui/button"
import { LayoutGrid, Menu, Minus, Plus } from "lucide-react"
import { useState } from "react"

    export default function AviatorGame() {
        const [betAmount, setBetAmount] = useState(10.0)
        const [betMode, setBetMode] = useState<"Bet" | "Auto">("Bet")

        const multipliers = [
            "25.77x",
            "5.40x",
            "4.42x",
            "1.21x",
            "17.83x",
            "1.11x",
            "2.88x",
            "1.72x",
            "1.67x",
            "2.76x",
            "1.17x",
            "1.00x",
            "1.21x",
            "3.90x",
            "1.08x",
            "1.03x",
            "4.82x",
        ]

        const quickAmounts = [100.0, 1000.0, 5000.0, 10000.0]

        const adjustBetAmount = (increment: boolean) => {
            const newAmount = increment ? betAmount + 1 : Math.max(1, betAmount - 1)
            setBetAmount(newAmount)
        }

        const setQuickAmount = (amount: number) => {
            setBetAmount(amount)
        }

        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                {/* Multipliers Row */}
                <div className="flex items-center space-x-2 p-4 overflow-x-auto scrollbar-hide">
                    {multipliers.map((multiplier, index) => {
                        const value = Number.parseFloat(multiplier)
                        let textColor = "text-blue-400"

                        if (value >= 10) {
                            textColor = "text-fuchsia-500"
                        } else if (value >= 4) {
                            textColor = "text-purple-500"
                        } else if (value >= 2) {
                            textColor = "text-pink-500"
                        } else if (value >= 1.5) {
                            textColor = "text-blue-400"
                        } else {
                            textColor = "text-blue-400"
                        }

                        return (
                            <div key={index} className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${textColor}`}>
                                {multiplier}
                            </div>
                        )
                    })}
                    <div className="px-2 py-1 rounded-full bg-gray-800 flex items-center justify-center">
                        <Menu className="h-4 w-4" />
                    </div>
                </div>

                {/* Animation Area */}
                <div className="flex-1 relative bg-black overflow-hidden rounded-lg mx-4 mb-4">
                    {/* Radiating lines background */}
                    <div className="absolute inset-0">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute bg-gradient-to-r from-transparent via-gray-800 to-transparent h-1 origin-bottom-left"
                                style={{
                                    bottom: "50%",
                                    left: "0%",
                                    width: "200%",
                                    transform: `rotate(${i * 9 - 90}deg)`,
                                    opacity: 0.3,
                                }}
                            />
                        ))}
                    </div>

                    {/* UFC and Aviator Partnership */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* <div className="flex items-center space-x-4">
                            <div className="text-red-500 text-5xl font-bold">UFC</div>
                            <div className="h-12 w-px bg-white"></div>
                            <div className="flex flex-col items-start">
                                <div className="text-red-500 text-3xl font-bold italic">Aviator</div>
                                <div className="text-red-500 text-sm -mt-1">
                                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4 17L12 10L18 15L20 13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M15 8H20V13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="text-white text-2xl font-bold mt-2">OFFICIAL PARTNERS</div>
                        <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-red-500 to-gray-500 mt-2"></div>

                        {/* SPRIBE Badge */}
                        {/* <div className="mt-8 bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <span className="text-green-500 text-xs">S</span>
                                </div>
                                <div className="text-white font-bold uppercase">SPRIBE</div>
                            </div>
                            <div className="mt-1 text-xs text-center border border-green-500/30 rounded px-2 py-0.5 bg-green-900/20">
                                <div className="flex items-center justify-center space-x-1">
                                    <span className="text-green-500">Official Game</span>
                                    <Check className="h-3 w-3 text-green-500" />
                                </div>
                            </div>
                            <div className="text-xs text-center text-gray-400 mt-1">Since 2018</div>
                        </div>  */}
                    </div>

                    {/* Red airplane in bottom left */}
                    {/* <div className="absolute bottom-4 left-4">
                        <svg
                            className="w-16 h-16 text-red-500 transform -rotate-12"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M22 2L2 9l7 3.5L17 8l-6.5 7.5L18 22l4-20z" stroke="none" />
                        </svg>
                    </div> */}

                    {/* User avatars */}
                    {/* <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                        <div className="flex -space-x-2">
                            <Avatar className="w-8 h-8 border-2 border-gray-700">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback>U1</AvatarFallback>
                            </Avatar>
                            <Avatar className="w-8 h-8 border-2 border-gray-700">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                                <AvatarFallback>U2</AvatarFallback>
                            </Avatar>
                        </div>
                        <span className="text-sm text-gray-400">155</span>
                    </div> */}
                </div>

                {/* Betting Controls */}
                <div className="p-6 bg-black">
                    {/* Bet/Auto Toggle with Grid Icon */}
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex rounded-full bg-gray-800 p-1">
                            <Button
                                variant={betMode === "Bet" ? "default" : "ghost"}
                                size="sm"
                                className={`px-8 py-2 rounded-full text-sm font-medium ${betMode === "Bet" ? "bg-gray-600 text-white" : "bg-transparent text-gray-400 hover:text-white"
                                    }`}
                                onClick={() => setBetMode("Bet")}
                            >
                                Bet
                            </Button>
                            <Button
                                variant={betMode === "Auto" ? "default" : "ghost"}
                                size="sm"
                                className={`px-8 py-2 rounded-full text-sm font-medium ${betMode === "Auto" ? "bg-gray-600 text-white" : "bg-transparent text-gray-400 hover:text-white"
                                    }`}
                                onClick={() => setBetMode("Auto")}
                            >
                                Auto
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-3 bg-gray-800 hover:bg-gray-700 rounded-full h-10 w-10">
                            <LayoutGrid className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>

                    {/* Bet Amount Controls */}
                    <div className="flex items-center justify-center space-x-6 mb-6">
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-gray-800 border-gray-600 hover:bg-gray-700 rounded-full h-12 w-12"
                            onClick={() => adjustBetAmount(false)}
                        >
                            <Minus className="h-5 w-5 text-white" />
                        </Button>
                        <div className="text-center min-w-[100px]">
                            <div className="text-3xl font-bold text-white">{betAmount.toFixed(2)}</div>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-gray-800 border-gray-600 hover:bg-gray-700 rounded-full h-12 w-12"
                            onClick={() => adjustBetAmount(true)}
                        >
                            <Plus className="h-5 w-5 text-white" />
                        </Button>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-3 mb-6 max-w-md mx-auto">
                        {quickAmounts.map((amount) => (
                            <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                className="bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white py-2 text-xs font-medium"
                                onClick={() => setQuickAmount(amount)}
                            >
                                {amount.toLocaleString()}.00
                            </Button>
                        ))}
                    </div>

                    {/* Bet Button */}
                    <div className="max-w-md mx-auto">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg">
                            Bet
                            <br />
                            <span className="text-xl">{betAmount.toFixed(2)} INR</span>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
