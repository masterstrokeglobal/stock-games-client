"use client"

import { Card } from "@/components/ui/card"
import { useIsPlaceOver } from "@/hooks/use-current-game"
import { RankedMarketItem } from "@/hooks/use-leadboard"
import { cn, formatRupee, JACKPOT_MULTIPLIER } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot"
import { useCreateStockSlotGameRecord, useGetMyStockSlotGameRecord } from "@/react-query/game-record-queries"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useCallback, useMemo, useState } from "react"

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
    const isUpPlaced = stockSlotPlacements?.filter((placement) => placement.placement === "high" && placement.round.id === roundRecord.id && placement.marketItem.id === marketItem.id).reduce((acc, placement) => acc + placement.amount, 0)
    const isDownPlaced = stockSlotPlacements?.filter((placement) => placement.placement === "low" && placement.round.id === roundRecord.id && placement.marketItem.id === marketItem.id).reduce((acc, placement) => acc + placement.amount, 0)
    return [isUpPlaced, isDownPlaced]
  }, [stockSlotPlacements, roundRecord.id, marketItem.id])

  const onAddToBetSlip = useCallback((direction: StockJackpotPlacementType) => {
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

  const upWinAmount = (upPlaced ?? 0) * JACKPOT_MULTIPLIER;
  const downWinAmount = (downPlaced ?? 0) * JACKPOT_MULTIPLIER;

  const bettingOpen = !isPlaceOver && !isPlacingBet;

  return (
    <Card className={cn("w-full  border-none relative text-white p-3 rounded-none border-b", className)}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex flex-col md:flex-1">
          <span className="font-bold text-sm md:text-base line-clamp-1" title={marketItem.name}>{marketItem.name}</span>
          <span className="text-gray-400 text-sm md:text-base">{marketItem.currency} {initialPrice ? initialPrice.toFixed(2) : "--"}</span>
        </div>

        <div className="flex gap-4 mt-2 w-full flex-1">
          <div className="flex-1 relative">
            {downPlaced ? (
              <button disabled={isPlacingBet || isPlaceOver} onClick={() => onAddToBetSlip(StockJackpotPlacementType.LOW)} className="w-full h-8 md:h-10 bg-red-900/40 rounded-lg border-2 border-red-500/50 flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">
                  {isPlacingBet ? "Placing..." : formatRupee(downWinAmount)}
                </span>
              </button>
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

          <div className="flex-1 relative">
            {upPlaced ? (
              <button disabled={isPlacingBet || isPlaceOver} onClick={() => onAddToBetSlip(StockJackpotPlacementType.HIGH)} className="w-full h-8 md:h-10 bg-green-900/40 rounded-lg border-2 border-green-500/50 flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">
                  {isPlacingBet ? "Placing..." : formatRupee(upWinAmount)}
                </span>
              </button>
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
      </div>
    </Card>
  )
}