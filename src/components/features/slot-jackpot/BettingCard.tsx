"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RankedMarketItem } from "@/hooks/use-leadboard"
import { RoundRecord } from "@/models/round-record"
import { StockSlotJackpotPlacementType } from "@/models/stock-slot-jackpot"
import { useCreateStockSlotJackpotGameRecord, useGetMyStockSlotJackpotGameRecord } from "@/react-query/game-record-queries"
import { useEffect, useState } from "react"
import { DigitPicker } from "./DigitPicker"
import { useIsPlaceOver } from "@/hooks/use-current-game"
import { toast } from "sonner"
interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: RankedMarketItem
}

export function BettingCard({ marketItem, roundRecord, globalBetAmount }: BettingCardProps) {
  const { data: myStockSlotJackpotGameRecord, isPending: isPendingMyStockSlotJackpotGameRecord } = useGetMyStockSlotJackpotGameRecord(roundRecord.id)
  const { mutate: createStockSlotJackpotGameRecord } = useCreateStockSlotJackpotGameRecord()

  const [selectedBetType, setSelectedBetType] = useState<StockSlotJackpotPlacementType>(  StockSlotJackpotPlacementType.ZEROTH)
  const [predictedDigits, setPredictedDigits] = useState<string>(selectedBetType === StockSlotJackpotPlacementType.ZEROTH ? "0" : "00");

  const betPlaced = myStockSlotJackpotGameRecord?.find(record => record.placement === selectedBetType && record.marketItem.id === marketItem.id)

  // Reset predicted digits when bet type changes
  useEffect(() => {
    setPredictedDigits(selectedBetType === StockSlotJackpotPlacementType.ZEROTH ? "0" : "00")
  }, [selectedBetType])

  const isPlaceOver = useIsPlaceOver(roundRecord);


  // Extract the last digits from the price for display
  const price = marketItem.price?.toString() ?? roundRecord.getInitialPrice(marketItem.bitcode ?? "").toString();
  const lastDigit = price?.slice(-1)
  const lastTwoDigits = price?.slice(-2).padStart(2, "0");

  const handlePlaceBet = () => {
    if (!roundRecord.id || !marketItem.id) return;
    if (betPlaced) {
      toast.error("You have already placed a bet on this market item")
      return;
    }
    createStockSlotJackpotGameRecord({  
      roundId: roundRecord.id,
      marketItem: marketItem.id,
      placement: selectedBetType,
      amount: globalBetAmount,
      placedNumber: parseInt(predictedDigits)
    })
  }

  const isDisabled = betPlaced !== undefined || isPlaceOver;

  return (
    <Card className="w-[384px] bg-[#1A1E2E] border-[#2A2F42] text-white">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium text-sm">{marketItem.name}</div>
          <div className="text-xs text-gray-400">{marketItem.codeName}</div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-lg font-bold">
              {marketItem.currency} &nbsp;{marketItem.price}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold text-amber-500 glow">
              {selectedBetType === "zeroth" ? lastDigit : lastTwoDigits}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mb-2">Drag or tap to select your prediction</div>

        <Tabs
          defaultValue={selectedBetType}
          className="w-full flex gap-2"
          onValueChange={(value) => setSelectedBetType(value as StockSlotJackpotPlacementType)}
        >
          <div className="flex-1">
            <TabsList className="w-full  h-fit  flex-col gap-3.5  p-1 mb-3">
              <TabsTrigger value="zeroth" className="h-12 w-full data-[state=active]:bg-[#2A2F42]">
                Last Digit
              </TabsTrigger>
              <TabsTrigger value="tenth" className="h-12 w-full data-[state=active]:bg-[#2A2F42]">
                First Digit
              </TabsTrigger>
              <TabsTrigger value="both" className="h-12 w-full data-[state=active]:bg-[#2A2F42]">
                Both
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <Button
                disabled={isPendingMyStockSlotJackpotGameRecord || isPlaceOver}
                className={`w-full py-3 text-lg font-bold ${betPlaced
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-[#2A2F42] hover:bg-[#3A3F52] text-amber-500 border border-amber-500/50"
                  }`}
                onClick={handlePlaceBet}
              >
                
                {isPendingMyStockSlotJackpotGameRecord ? "Placing bet..." : ""}
                {betPlaced ? `BET Placed ${betPlaced.placedNumber}` : isPlaceOver ? "Place Over" : `BET ON ${predictedDigits}`}
              </Button>
            </div>
          </div>

          <TabsContent value="zeroth" className="mt-0 flex-1">
              <DigitPicker betType={StockSlotJackpotPlacementType.ZEROTH} onChange={setPredictedDigits} value={predictedDigits} disabled={isDisabled} />
          </TabsContent>

          <TabsContent value="tenth" className="mt-0 flex-1">
            <DigitPicker betType={StockSlotJackpotPlacementType.TENTH} onChange={setPredictedDigits} value={predictedDigits} disabled={isDisabled} />
          </TabsContent>
          <TabsContent value="both" className="mt-0 flex-1">
            <DigitPicker betType={StockSlotJackpotPlacementType.BOTH} onChange={setPredictedDigits} value={predictedDigits} disabled={isDisabled} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  )
}
