"use client"

import FavoriteMarketItem from "@/components/common/favorite-markitem"
import { Card } from "@/components/ui/card"
import { useIsPlaceOver } from "@/hooks/use-current-game"
import { RankedMarketItem } from "@/hooks/use-leadboard"
import { formatRupee } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { StockSlotPlacementType } from "@/models/stock-slot-placement"
import { useCreateStockSlotGameRecord, useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { ArrowDownIcon, ArrowUpIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
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
  const isPlaceOver = useIsPlaceOver(roundRecord);

  const { data: stockSlotPlacements } = useGetMyStockSlotGameRecord(roundRecord.id);

  const { mutate: createStockSlotGameRecord, isPending: isPlacingBet } = useCreateStockSlotGameRecord();

  const [upPlaced, downPlaced] = useMemo(() => {
    const isUpPlaced = stockSlotPlacements?.find((placement) => placement.placement === "high" && placement.round.id === roundRecord.id && placement.marketItem.id === marketItem.id) 
    const isDownPlaced = stockSlotPlacements?.find((placement) => placement.placement === "low" && placement.round.id === roundRecord.id && placement.marketItem.id === marketItem.id) 
    return [isUpPlaced, isDownPlaced]
  }, [stockSlotPlacements, roundRecord.id, marketItem.id])

  const onAddToBetSlip = useCallback((direction: StockSlotPlacementType) => {
    if (upPlaced && direction === "high") return;
    if (downPlaced && direction === "low") return;
    if (!roundRecord.id || !marketItem.id) return;

    createStockSlotGameRecord({
      roundId: roundRecord.id.toString(),
      marketItem: marketItem.id,
      placement: direction,
      amount: globalBetAmount
    }, {
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
  }, [roundRecord.id, marketItem.id, globalBetAmount, createStockSlotGameRecord, upPlaced, downPlaced])

  const initialPrice = roundRecord.getInitialPrice(marketItem.bitcode ?? "")
  const currentPrice = marketItem.price ?? initialPrice
  const changePercent = parseFloat(marketItem.change_percent) || 0
  const isPositiveChange = changePercent > 0

  const totalPlaced = (upPlaced?.amount ?? 0) + (downPlaced?.amount ?? 0);

  const upWinAmount = (upPlaced?.amount ?? 0) * 1.96
  const downWinAmount = (downPlaced?.amount ?? 0) * 1.96
  
  // Calculate betting status for highlighting
  const bettingOpen = !isPlaceOver && !isPlacingBet;

  return (
    <Card className="w-full bg-gradient-to-r md:pr-8 from-gray-900 to-gray-800 border-primary relative text-white">
    {marketItem.id && <FavoriteMarketItem marketItemId={marketItem.id} className="absolute top-1 right-1" />}
      <div className="p-2 sm:p-4 flex flex-col lg:flex-row w-full gap-2 sm:gap-4">
        {/* Part 1: Stock Details */}
        <div className="flex-1 bg-gray-800/50 rounded-lg p-2 sm:p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 justify-between w-full"> 
              <h3 className="font-bold text-base sm:text-lg">{marketItem.name}</h3>
              <p className="text-gray-400 text-xs sm:text-sm">{marketItem.codeName}</p>
            </div>
          
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-400">Betting Price:</span>
              <span className="font-medium text-xs sm:text-sm">Rs. {initialPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs sm:text-sm text-gray-400">Your Bet:</span>
              <span className="font-medium text-xs sm:text-sm"> {formatRupee(totalPlaced)}</span>
            </div>
          </div>
        </div>

        {/* Part 2: Bet Down Section */}
        <div className="flex-1 bg-gray-800/50 rounded-lg p-2 sm:p-3 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <div className="flex items-center gap-1">
              <TrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
              <span className="font-bold  sm:text-sm text-red-400">DOWN</span>
            </div>
            <span className=" font-bold text-red-300">1.96x</span>
          </div>
          <div className="h-14 sm:h-16 flex items-center justify-center relative">
            { downPlaced ? (
              <div className="w-full h-full bg-red-900/40 rounded-lg border-2 border-red-500/50 flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <p className="font-bold text-xs sm:text-sm text-white tracking-wider">YOU WIN</p>
                  <p className="text-base sm:text-2xl font-bold text-white text-glow-red">{formatRupee(downWinAmount)}</p>
                  <div className="mt-1 flex justify-center">
                    <div className="h-1 w-1 bg-red-400 rounded-full mx-1 animate-bounce"></div>
                    <div className="h-1 w-1 bg-red-400 rounded-full mx-1 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-1 w-1 bg-red-400 rounded-full mx-1 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                disabled={isPlacingBet || isPlaceOver}
                className={`w-full h-full rounded-md flex items-center justify-center font-bold text-sm sm:text-lg 
                  bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500
                  border-2 transition-all
                  ${bettingOpen ? 'border-red-500 shadow-lg shadow-red-500/20 animate-pulse' : 'border-red-500/30'}
                  ${isPlacingBet || isPlaceOver ? "opacity-50 cursor-not-allowed" : "transform hover:scale-[1.02]"}
                `}
                onClick={() => onAddToBetSlip("low")}
              >
                {isPlacingBet ? "Placing..." : isPlaceOver ? "Closed" : "BET DOWN"}
              </button>
            )}
            {playDownAnimation && (
              <DotLottieReact
                className="w-40 sm:w-60 absolute -bottom-1/2 z-10 left-0"
                src="/animation/coin-splash.lottie"
                autoplay
              />
            )}
          </div>
        </div>

        {/* Part 3: Current Price */}
        <div className="flex-1 bg-gray-800/50 rounded-lg p-2 sm:p-3 flex flex-col justify-center items-center">
          <div className="text-center mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm text-gray-400">Current Price</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold">
            {marketItem.currency} {currentPrice?.toFixed(2)}
          </div>
          <div className={`flex items-center mt-1 sm:mt-2 ${isPositiveChange ? "text-green-400" : "text-red-400"}`}>
            {isPositiveChange ? <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
            <span className="text-xs sm:text-sm font-medium">{isPositiveChange ? "+" : ""}{changePercent.toFixed(2)}%</span>
          </div>
        </div>

        {/* Part 4: Bet UP Section */}
        <div className="flex-1 bg-gray-800/50 rounded-lg p-2 sm:p-3 relative flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <div className="flex items-center gap-1">
              <TrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              <span className=" font-bold text-green-400">UP</span>
            </div>
            <span className=" font-bold text-green-300">1.96x</span>
          </div>
          <div className="h-14 sm:h-16 flex items-center justify-center relative">
            {upPlaced ? (
              <div className="w-full h-full bg-green-900/40 rounded-lg border-2 border-green-500/50 flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <p className="font-bold text-xs sm:text-sm text-white tracking-wider">YOU WIN</p>
                  <p className="text-base sm:text-2xl font-bold text-white text-glow-green">{formatRupee(upWinAmount)}</p>
                  <div className="mt-1 flex justify-center">
                    <div className="h-1 w-1 bg-green-400 rounded-full mx-1 animate-bounce"></div>
                    <div className="h-1 w-1 bg-green-400 rounded-full mx-1 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-1 w-1 bg-green-400 rounded-full mx-1 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                disabled={isPlacingBet || isPlaceOver}
                className={`w-full h-full rounded-md flex items-center justify-center font-bold text-sm sm:text-lg 
                  bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500
                  border-2 transition-all
                  ${bettingOpen ? 'border-green-500 shadow-lg shadow-green-500/20 animate-pulse' : 'border-green-500/30'}
                  ${isPlacingBet || isPlaceOver ? "opacity-50 cursor-not-allowed" : "transform hover:scale-[1.02]"}
                `}
                onClick={() => onAddToBetSlip("high")}
              >
                {isPlacingBet ? "Placing..." : isPlaceOver ? "Closed" : "BET UP"}
              </button>
            )}
            {playUpAnimation && (
              <DotLottieReact
                className="w-40 sm:w-60 absolute -bottom-1/2 z-10 left-0"
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