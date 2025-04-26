"use client"

import { Card } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, TrendingUpIcon } from "lucide-react"
import Image from "next/image"

interface BettingCardProps {
  asset: Asset
  betSlip: BetSlipItem[]
  globalBetAmount: number
  onAddToBetSlip: (asset: Asset, direction: BetDirection) => void
}

export function BettingCard({ asset, betSlip, onAddToBetSlip }: BettingCardProps) {
  const isUpSelected = betSlip.some((bet) => bet.id === asset.id && bet.direction === "up")
  const isDownSelected = betSlip.some((bet) => bet.id === asset.id && bet.direction === "down")

  return (
    <Card className="min-w-[280px] max-w-[280px] bg-primary border-primary text-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                asset.market === "NSE"
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
          <div className="text-xs text-gray-400">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`rounded-md p-2 ${isUpSelected ? "bg-green-500 text-white" : "bg-green-900/30 text-green-400"}`}>
            <div className="flex items-center text-xs mb-1">
              <ArrowUpIcon className="w-3 h-3 mr-1" />
              <span>UP</span>
              <span className="ml-auto font-bold">1.96</span>
            </div>
          </div>
          <div className={`rounded-md p-2 ${isDownSelected ? "bg-red-500 text-white" : "bg-red-900/30 text-red-400"}`}>
            <div className="flex items-center text-xs mb-1 ">
              <ArrowDownIcon className="w-3 h-3 mr-1" />
              <span>DOWN</span>
              <span className="ml-auto font-bold">1.96</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className={`flex items-center justify-center rounded-md py-2 ${
              isUpSelected ? "bg-green-500 text-white" : "bg-green-900/30 text-green-400 hover:bg-green-900/50"
            }`}
            onClick={() => onAddToBetSlip(asset, "up")}
          >
            <span className="font-bold text-sm">BET UP</span>
          </button>
          <button
            className={`flex items-center justify-center rounded-md py-2 ${
              isDownSelected ? "bg-red-500 text-white" : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
            }`}
            onClick={() => onAddToBetSlip(asset, "down")}
          >
            <span className="font-bold text-sm">BET DOWN</span>
          </button>
        </div>
      </div>
    </Card>
  )
}
