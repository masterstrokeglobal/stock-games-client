"use client"

import { useState, useEffect } from "react"
import { TrendingUpIcon } from "lucide-react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DigitPicker } from "./DigitPicker"

interface BettingCardProps {
  asset: Asset
  betSlip: BetSlipItem[]
  globalBetAmount: number
  onAddBet: (asset: Asset, betType: BetType, predictedDigits: string) => void
}

export function BettingCard({ asset, betSlip, globalBetAmount, onAddBet }: BettingCardProps) {
  const [selectedBetType, setSelectedBetType] = useState<BetType>("single-digit")
  const [predictedDigits, setPredictedDigits] = useState<string>(selectedBetType === "single-digit" ? "0" : "00")

  // Reset predicted digits when bet type changes
  useEffect(() => {
    setPredictedDigits(selectedBetType === "single-digit" ? "0" : "00")
  }, [selectedBetType])

  // Check if this bet is already in the bet slip
  const existingBet = betSlip.find(
    (bet) => bet.id === asset.id && bet.betType === selectedBetType && bet.predictedDigits === predictedDigits,
  )

  const isSelected = !!existingBet

  // Handle bet type change
  const handleBetTypeChange = (type: BetType) => {
    setSelectedBetType(type)
  }

  // Handle placing a bet
  const handlePlaceBet = () => {
    onAddBet(asset, selectedBetType, predictedDigits)
  }

  // Extract the last digits from the price for display
  const price = asset.price.replace(/,/g, "")
  const lastDigit = price.slice(-1)
  const lastTwoDigits = price.slice(-2).padStart(2, "0")

  return (
    <Card className="w-[384px] bg-[#1A1E2E] border-[#2A2F42] text-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${asset.market === "NSE"
                  ? "bg-blue-900/30"
                  : asset.market === "Crypto"
                    ? "bg-yellow-900/30"
                    : "bg-green-900/30"
                }`}
            >
              {asset.market === "NSE" && <TrendingUpIcon className="w-5 h-5 text-blue-400" />}
              {asset.market === "Crypto" && (
                <Image
                  src="/placeholder.svg?height=20&width=20"
                  width={20}
                  height={20}
                  alt="Crypto"
                  className="text-yellow-400"
                />
              )}
              {asset.market === "US Stocks" && (
                <Image
                  src="/placeholder.svg?height=20&width=20"
                  width={20}
                  height={20}
                  alt="US Stock"
                  className="text-green-400"
                />
              )}
            </div>
            <div className="ml-3">
              <div className="font-medium text-sm">{asset.name}</div>
              <div className="text-xs text-gray-400">{asset.symbol}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-lg font-bold">
              {asset.market === "NSE" ? "₹" : "$"}
              {asset.price}
            </div>
            <div className={`text-xs ${asset.isPositive ? "text-green-400" : "text-red-400"}`}>
              {asset.isPositive ? "+" : "-"}
              {asset.change}
            </div>
          </div>



          <div className="flex flex-col items-end">
            <div className="text-xl font-bold text-amber-500 glow">
              {selectedBetType === "single-digit" ? lastDigit : lastTwoDigits}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mb-2">Drag or tap to select your prediction</div>

        <Tabs
          defaultValue="single-digit"
          className="w-full flex"
          onValueChange={(value) => handleBetTypeChange(value as BetType)}
        >
          <div className="flex-1">
            <TabsList className="w-full  h-fit  flex-col gap-3.5  p-1 mb-3">
              <TabsTrigger value="single-digit" className="h-12 w-full data-[state=active]:bg-[#2A2F42]">
                Last Digit
              </TabsTrigger>
              <TabsTrigger value="double-digit" className="h-12 w-full data-[state=active]:bg-[#2A2F42]">
                Last 2 Digits
              </TabsTrigger>
              <TabsTrigger value="third-digit" className="h-12 w-full data-[state=active]:bg-[#2A2F42]">
                10'th Digit
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <Button
                className={`w-full py-3 text-lg font-bold ${isSelected
                    ? "bg-amber-500 hover:bg-amber-600 text-black"
                    : "bg-[#2A2F42] hover:bg-[#3A3F52] text-amber-500 border border-amber-500/50"
                  }`}
                onClick={handlePlaceBet}
              >
                {isSelected ? "REMOVE BET" : `BET ON ${predictedDigits}`}
              </Button>
            </div>
          </div>


          <TabsContent value="single-digit" className="mt-0 flex-1">
            <DigitPicker betType="single-digit" onChange={setPredictedDigits} value={predictedDigits} />
          </TabsContent>

          <TabsContent value="double-digit" className="mt-0 flex-1  ">
            <DigitPicker betType="double-digit" onChange={setPredictedDigits} value={predictedDigits} />
          </TabsContent>
          <TabsContent value="third-digit" className="mt-0 flex-1">
            <DigitPicker betType="single-digit" onChange={setPredictedDigits} value={predictedDigits} />
          </TabsContent>
        </Tabs>


      </div>
    </Card>
  )
}
