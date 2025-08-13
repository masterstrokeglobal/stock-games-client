"use client"

import { Card } from "@/components/ui/card"
import { SkewedButton } from "@/components/ui/skew-button"
import { useIsPlaceOver } from "@/hooks/use-current-game"
import { cn } from "@/lib/utils"
import MarketItem from "@/models/market-item"
import { RoundRecord } from "@/models/round-record"
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot"
import { useCreateStockJackpotGameRecord, useGetMyStockJackpotGameRecord } from "@/react-query/game-record-queries"
import { useCallback, useMemo } from "react"

interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: MarketItem,
  className?: string
  skew?: "left" | "right"
}

// Use the provided Chip style
function Chip({ amount, className }: { amount: number, className?: string }) {
  return (
    <span className={cn("inline-flex items-center aspect-square justify-center rounded-full size-6  text-xs font-bold absolute  -right-8 -top-2 z-20", className)}>
      <img src="/images/jackpot/chip.png" alt="Chip" className="w-full h-full object-cover scale-[2] absolute" />
      <span className="relative z-20 text-white font-orbitron text-[8px] font-bold">
        {amount}
      </span>
    </span>
  );
}

export function BettingCard({ marketItem, globalBetAmount, roundRecord, className, skew = "left" }: BettingCardProps) {
  const isPlaceOver = useIsPlaceOver(roundRecord);
  const { data: stockSlotPlacements } = useGetMyStockJackpotGameRecord(roundRecord.id);
  const { mutate: createStockSlotGameRecord, isPending: isPlacingBet } = useCreateStockJackpotGameRecord();

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
    });

  }, [roundRecord.id, marketItem.id, globalBetAmount, createStockSlotGameRecord, upPlaced, downPlaced])

  const initialPrice = roundRecord.getInitialPrice(marketItem.bitcode ?? "")

  return (
    <Card className={cn("w-full border-none relative text-white px-3 rounded-non group", className)}>
      <div className="flex flex-row items-center gap-4 py-2">
        <div className="flex flex-col flex-1">
          <span className="font-bold md:text-[15px] text-[10px] line-clamp-1 lg:max-w-32 font-spacemono" title={marketItem.name}>{marketItem.name}</span>
          <span className="text-gray-400 md:text-[12px] text-[8px]  font-space-grotesk">({marketItem.currency} {initialPrice ? initialPrice.toFixed(2) : "--"})</span>
        </div>
        <div className="flex gap-4  w-full flex-1">
          <div className="flex-1 relative min-w-0">
            <SkewedButton
              variant="red"
              size={"sm"}
              skew={skew}
              fullWidth
              disabled={isPlacingBet || isPlaceOver}
              onClick={() => onAddToBetSlip(StockJackpotPlacementType.LOW)}
              className={cn(
                "!rounded-lg flex items-center justify-center font-bold text-[10px] md:text-sm transition-all",
                (isPlacingBet || isPlaceOver) ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              DOWN
              {downPlaced ? (
                <Chip amount={downPlaced} className="-left-6" />
              ) : null}
            </SkewedButton>
          </div>
          <div className="flex-1 relative min-w-0">
            <SkewedButton
              variant="green"
              size="sm"
              skew={skew}
              fullWidth
              disabled={isPlacingBet || isPlaceOver}
              onClick={() => onAddToBetSlip(StockJackpotPlacementType.HIGH)}
              className={cn(
                "!rounded-lg flex items-center justify-center font-bold text-xs md:text-sm transition-all",
                (isPlacingBet || isPlaceOver) ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              UP
              {upPlaced ? (
                <Chip amount={upPlaced} />
              ) : null}
            </SkewedButton>
          </div>
        </div>
      </div>
      <hr className={cn("bg-[#10B2E1] border-[#10B2E1] group-last:hidden")} />
    </Card>
  )
}