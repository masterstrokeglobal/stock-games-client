"use client"

import FavoriteMarketItem from "@/components/common/favorite-markitem"
import { Card } from "@/components/ui/card"
import { useIsPlaceOver } from "@/hooks/use-current-game"
import { RankedMarketItem } from "@/hooks/use-leadboard"
import { cn, formatRupee } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { useCreateStockSlotGameRecord, useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useCallback, useMemo, useState } from "react"
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot"


interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: RankedMarketItem,
  className?: string
}

export function BettingCard({ marketItem, globalBetAmount, roundRecord, className }: BettingCardProps) {
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

  const onAddToBetSlip = useCallback((direction: StockJackpotPlacementType) => {
    if (upPlaced && direction === StockJackpotPlacementType.HIGH) return;
    if (downPlaced && direction === StockJackpotPlacementType.LOW) return;
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
          setTimeout(() => setPlayUpAnimation(false), 2000);
        } else {
          setPlayDownAnimation(true);
          setTimeout(() => setPlayDownAnimation(false), 2000);
        }
      }
    })
  }, [roundRecord.id, marketItem.id, globalBetAmount, createStockSlotGameRecord, upPlaced, downPlaced])

  const initialPrice = roundRecord.getInitialPrice(marketItem.bitcode ?? "")

  const upWinAmount = (upPlaced?.amount ?? 0) * 1.96
  const downWinAmount = (downPlaced?.amount ?? 0) * 1.96

  const bettingOpen = !isPlaceOver && !isPlacingBet;

  return (
    <Card className={cn("w-full bg-white/10 border-none relative text-white p-3 rounded-none border-b", className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center justify-around md:flex-1">
          <span className="font-bold text-sm md:text-base">{marketItem.name}</span>
          <span className="text-gray-400 text-sm md:text-base ml-2">{marketItem.currency} {initialPrice?.toFixed(2)}</span>
          {marketItem.id && <div className="md:hidden"><FavoriteMarketItem marketItemId={marketItem.id} /></div>}
        </div>

        <div className="flex gap-4 mt-2 w-full flex-1">
          <div className="flex-1 relative w-1/2">
            {downPlaced ? (
              <div className="w-full h-8 md:h-10 bg-red-900/40 rounded-lg border-2 border-red-500/50 flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">{formatRupee(downWinAmount)}</span>
              </div>
            ) : (
              <button
                disabled={isPlacingBet || isPlaceOver}
                className={`w-full h-8 md:h-10 rounded-md flex items-center justify-center font-bold text-xs md:text-sm
                  bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500
                  border-2 transition-all
                  ${bettingOpen ? 'border-red-500 shadow-lg shadow-red-500/20 animate-pulse' : 'border-red-500/30'}
                  ${isPlacingBet || isPlaceOver ? "opacity-50 cursor-not-allowed" : "transform hover:scale-[1.02]"}
                `}
                onClick={() => onAddToBetSlip(StockJackpotPlacementType.LOW)}
              >
                {isPlacingBet ? "Placing..." : isPlaceOver ? "Closed" : "DOWN"}
              </button>
            )}
            {playDownAnimation && (
              <DotLottieReact
                className="w-40 absolute -bottom-1/2 z-10 left-0"
                src="/animation/coin-splash.lottie"
                autoplay
              />
            )}
          </div>

          <div className="flex-1 relative w-1/2">
            {upPlaced ? (
              <div className="w-full h-8 md:h-10 bg-green-900/40 rounded-lg border-2 border-green-500/50 flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">{formatRupee(upWinAmount)}</span>
              </div>
            ) : (
              <button
                disabled={isPlacingBet || isPlaceOver}
                className={`w-full h-8 md:h-10 rounded-md flex items-center justify-center font-bold text-xs md:text-sm
                  bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500
                  border-2 transition-all
                  ${bettingOpen ? 'border-green-500 shadow-lg shadow-green-500/20 animate-pulse' : 'border-green-500/30'}
                  ${isPlacingBet || isPlaceOver ? "opacity-50 cursor-not-allowed" : "transform hover:scale-[1.02]"}
                `}
                onClick={() => onAddToBetSlip(StockJackpotPlacementType.HIGH)}
              >
                {isPlacingBet ? "Placing..." : isPlaceOver ? "Closed" : "UP"}
              </button>
            )}
            {playUpAnimation && (
              <DotLottieReact
                className="w-40 absolute -bottom-1/2 z-10 left-0"
                src="/animation/coin-splash.lottie"
                autoplay
              />
            )}
          </div>
        </div>
        {marketItem.id && <div className="hidden md:block"><FavoriteMarketItem marketItemId={marketItem.id} /></div>}
      </div>
    </Card>
  )
}