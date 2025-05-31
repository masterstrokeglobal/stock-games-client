"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface GameRound {
  id: number
  time: string
  multiplier: string
  duration: string
  status: "crashed" | "completed"
}

export default function PlaneGame() {
  const [multiplier, setMultiplier] = useState(1.0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [betAmount1, setBetAmount1] = useState("10")
  const [betAmount2, setBetAmount2] = useState("5000")
  const [autoPlay1, setAutoPlay1] = useState(false)
  const [autoPlay2, setAutoPlay2] = useState(false)

  // Sample last rounds data
  const lastRounds: GameRound[] = [
    {
      id: 1,
      time: "14:32:15",
      multiplier: "5.57x",
      duration: "12.3s",
      status: "crashed",
    },
    {
      id: 2,
      time: "14:31:48",
      multiplier: "2.86x",
      duration: "8.1s",
      status: "crashed",
    },
    {
      id: 3,
      time: "14:31:22",
      multiplier: "3.21x",
      duration: "9.7s",
      status: "crashed",
    },
    {
      id: 4,
      time: "14:30:55",
      multiplier: "1.67x",
      duration: "4.2s",
      status: "crashed",
    },
    {
      id: 5,
      time: "14:30:28",
      multiplier: "8.94x",
      duration: "18.6s",
      status: "crashed",
    },
    {
      id: 6,
      time: "14:30:01",
      multiplier: "1.23x",
      duration: "2.8s",
      status: "crashed",
    },
    {
      id: 7,
      time: "14:29:34",
      multiplier: "4.15x",
      duration: "11.2s",
      status: "crashed",
    },
    {
      id: 8,
      time: "14:29:07",
      multiplier: "2.44x",
      duration: "6.9s",
      status: "crashed",
    },
    {
      id: 9,
      time: "14:28:40",
      multiplier: "6.78x",
      duration: "15.4s",
      status: "crashed",
    },
    {
      id: 10,
      time: "14:28:13",
      multiplier: "1.89x",
      duration: "5.1s",
      status: "crashed",
    },
    {
      id: 11,
      time: "14:27:46",
      multiplier: "3.67x",
      duration: "10.3s",
      status: "crashed",
    },
    {
      id: 12,
      time: "14:27:19",
      multiplier: "12.45x",
      duration: "24.7s",
      status: "crashed",
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying) {
      interval = setInterval(() => {
        setMultiplier((prev) => {
          const newValue = Number.parseFloat((prev + 0.01).toFixed(2))
          return newValue
        })
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isPlaying])

  const startGame = () => {
    setIsPlaying(true)
    setMultiplier(1.0)

    // Simulate random game duration between 5-15 seconds
    const duration = 5000 + Math.random() * 10000

    setTimeout(() => {
      setIsPlaying(false)
    }, duration)
  }

  const placeBet = (amount: string) => {
    console.log('amount', amount)
    if (!isPlaying) {
      startGame()
    }
  }

  const quickBetOptions = [
    { value: "500", label: "500" },
    { value: "2000", label: "2K" },
    { value: "5000", label: "5K" },
    { value: "15000", label: "15K" },
  ]

  const getMultiplierColor = (multiplier: string) => {
    const value = Number.parseFloat(multiplier.replace("x", ""))
    if (value >= 10) return "text-purple-400"
    if (value >= 5) return "text-green-400"
    if (value >= 2) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-500">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-end p-4 bg-opacity-20 bg-black backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Last Rounds</span>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative">
            {/* Plane Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/placeholder.svg?height=200&width=300" alt="Plane" className="opacity-70" />
            </div>

            {/* Multiplier */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <h1 className="text-8xl font-bold text-white drop-shadow-lg">{multiplier.toFixed(2)}x</h1>
            </div>

            {/* Betting Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Bet Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center bg-gray-900 rounded-lg">
                      <div className="bg-yellow-400 rounded-full px-2 py-1 m-2">
                        <span className="text-xs font-bold">₹</span>
                      </div>
                      <input
                        type="text"
                        value={betAmount1}
                        onChange={(e) => setBetAmount1(e.target.value)}
                        className="bg-transparent text-white w-full p-2 focus:outline-none"
                      />
                    </div>

                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => placeBet(betAmount1)}
                    >
                      PLACE BET
                    </Button>

                    <div className="flex justify-between">
                      {quickBetOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant="outline"
                          className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                          onClick={() => setBetAmount1(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white">Auto play</span>
                      <Switch checked={autoPlay1} onCheckedChange={setAutoPlay1} />
                    </div>
                  </div>

                  {/* Right Bet Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center bg-gray-900 rounded-lg">
                      <div className="bg-yellow-400 rounded-full px-2 py-1 m-2">
                        <span className="text-xs font-bold">₹</span>
                      </div>
                      <input
                        type="text"
                        value={betAmount2}
                        onChange={(e) => setBetAmount2(e.target.value)}
                        className="bg-transparent text-white w-full p-2 focus:outline-none"
                      />
                    </div>

                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => placeBet(betAmount2)}
                    >
                      PLACE BET
                    </Button>

                    <div className="flex justify-between">
                      {quickBetOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant="outline"
                          className="bg-gray-700 hover:bg-gray-600 text-white border-none"
                          onClick={() => setBetAmount2(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white">Auto play</span>
                      <Switch checked={autoPlay2} onCheckedChange={setAutoPlay2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-96 bg-gray-900 bg-opacity-90 backdrop-blur-sm overflow-y-auto">
            <div className="p-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-700">
                <div className="flex items-center space-x-2">
                  <ChevronDown className="h-5 w-5 text-white" />
                  <span className="text-white font-bold">Last 12 Rounds</span>
                </div>
                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>

              {/* Rounds Table */}
              <div className="space-y-2">
                {/* Table Header */}
                <div className="grid grid-cols-4 gap-3 pb-2 border-b border-gray-700 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <div>Time</div>
                  <div className="text-center">Multi</div>
                  <div className="text-center">Duration</div>
                  <div className="text-center">Status</div>
                </div>

                {/* Table Rows */}
                {lastRounds.map((round) => (
                  <div
                    key={round.id}
                    className="grid grid-cols-4 gap-3 py-2 border-b border-gray-800 hover:bg-gray-800 hover:bg-opacity-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="text-gray-300 text-sm font-mono">{round.time}</span>
                    </div>

                    <div className="text-center">
                      <span className={`text-sm font-bold ${getMultiplierColor(round.multiplier)}`}>
                        {round.multiplier}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-gray-300 text-sm font-mono">{round.duration}</span>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Avg Multi</div>
                    <div className="text-white font-bold">4.23x</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Avg Duration</div>
                    <div className="text-white font-bold">10.8s</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
