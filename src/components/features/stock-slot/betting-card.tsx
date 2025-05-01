"use client"

import { Card } from "@/components/ui/card"
import { useGameState } from "@/hooks/use-current-game"
import { RankedMarketItem } from "@/hooks/use-leadboard"
import { RoundRecord } from "@/models/round-record"
import { StockSlotPlacementType } from "@/models/stock-slot-placement"
import { useCreateStockSlotGameRecord, useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: RankedMarketItem
}

export function BettingCard({ marketItem, globalBetAmount, roundRecord }: BettingCardProps) {
  // Add state to track animation visibility
  const [playUpAnimation, setPlayUpAnimation] = useState(false);
  const [playDownAnimation, setPlayDownAnimation] = useState(false);

  const { data: stockSlotPlacements } = useGetMyStockSlotGameRecord(roundRecord.id);

  const { mutate: createStockSlotGameRecord, isPending: isPlacingBet } = useCreateStockSlotGameRecord();

  const [isUpPlaced, isDownPlaced] = useMemo(() => {
    const isUpPlaced = stockSlotPlacements?.findIndex((placement) => placement.placement === "high" && placement.round.id === roundRecord.id && placement.marketItem.id === marketItem.id) !== -1
    const isDownPlaced = stockSlotPlacements?.findIndex((placement) => placement.placement === "low" && placement.round.id === roundRecord.id && placement.marketItem.id === marketItem.id) !== -1
    return [isUpPlaced, isDownPlaced]
  }, [stockSlotPlacements, roundRecord.id, marketItem.id])

  const onAddToBetSlip = useCallback((direction: StockSlotPlacementType) => {
    if (isUpPlaced && direction === "high") return;
    if (isDownPlaced && direction === "low") return;
    if (!roundRecord.id || !marketItem.id) return;
    
  
    createStockSlotGameRecord({
      roundId: roundRecord.id.toString(),
      marketItem: marketItem.id,
      placement: direction,
      amount: globalBetAmount
    },{
      onSuccess: () => {
    if (direction === "high") {
      setPlayUpAnimation(true);
      setTimeout(() => setPlayUpAnimation(false), 2000); // Hide animation after 2 seconds
    } else {
      setPlayDownAnimation(true);
          setTimeout(() => setPlayDownAnimation(false), 2000); // Hide animation after 2 seconds
        }
      }
    })
  }, [roundRecord.id, marketItem.id, globalBetAmount, createStockSlotGameRecord, isUpPlaced, isDownPlaced])


  const initialPrice = roundRecord.initialValues?.[marketItem.bitcode?.toLowerCase() ?? ""]
  return (
    <Card className="min-w-[280px]  bg-primary border-primary text-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">

              <div className="font-medium text-sm">{marketItem.name}</div>
              <div className="text-xs text-gray-400">{marketItem.codeName}</div>
      </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-xs font-bold">
              {marketItem.currency} &nbsp;
              <span className="text-xs text-gray-400">
                {marketItem.price ?? initialPrice}
              </span>
            </div>
          </div>
          <div className={`text-xs ${parseFloat(marketItem.change_percent) > 0 ? "text-green-400" : "text-red-400"}`}>
            {parseFloat(marketItem.change_percent) > 0 ? "+" : ""}
            {marketItem.change_percent??0}
          </div>
        </div>
        <div className="text-sm text-center font-semibold my-2 flex items-center justify-between">
          <span className="text-gray-400">
            Betting Price
          </span>
            <span className="text-xs text-gray-400">
              {marketItem.currency} &nbsp;{initialPrice?.toFixed(2)}
            </span>
        </div>


        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`rounded-md p-2 ${isUpPlaced ? "bg-green-500 text-white" : "bg-green-900/30 text-green-400"}`}>
            <div className="flex items-center text-xs mb-1">
              <ArrowUpIcon className="w-3 h-3 mr-1" />
              <span>UP</span>
              <span className="ml-auto font-bold">1.96</span>
            </div>
          </div>
          <div className={`rounded-md p-2 ${isDownPlaced ? "bg-red-500 text-white" : "bg-red-900/30 text-red-400"}`}>
            <div className="flex items-center text-xs mb-1 ">
              <ArrowDownIcon className="w-3 h-3 mr-1" />
              <span>DOWN</span>
              <span className="ml-auto font-bold">1.96</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <button
              disabled={isPlacingBet}
              className={`flex items-center justify-center rounded-md py-2 w-full ${isUpPlaced ? "bg-green-500 text-white" : "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                }`}
              onClick={() => onAddToBetSlip("high")}
            >
              <span className="font-bold text-sm">
                {isPlacingBet ? "Placing..." : "BET UP"}
              </span>
            </button>
            {playUpAnimation && (
              <DotLottieReact
                className="w-60 absolute -bottom-1/2 z-10 left-0"
                src="/animation/coin-splash.lottie"
                autoplay
              />
            )}
          </div>
          
          <div className="relative">
            <button
              disabled={isPlacingBet}
              className={`flex items-center justify-center rounded-md py-2 w-full ${isDownPlaced ? "bg-red-500 text-white" : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                }`}
              onClick={() => onAddToBetSlip("low")}
            >
              <span className="font-bold text-sm">
                {isPlacingBet ? "Placing..." : "BET DOWN"}
              </span>
            </button>
            {playDownAnimation && (
              <DotLottieReact
                className="w-60 absolute -bottom-1/2 z-10 left-0"
                src="/animation/coin-splash.lottie"
                autoplay
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

