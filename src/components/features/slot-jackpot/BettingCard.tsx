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

interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: RankedMarketItem
}

export function BettingCard({ marketItem, roundRecord, globalBetAmount }: BettingCardProps) {
  const { data: myStockSlotJackpotGameRecord, isPending: isPendingMyStockSlotJackpotGameRecord } = useGetMyStockSlotJackpotGameRecord(roundRecord.id)
  const { mutate: createStockSlotJackpotGameRecord } = useCreateStockSlotJackpotGameRecord()

  const [selectedBetType, setSelectedBetType] = useState<StockSlotJackpotPlacementType>("zeroth")
  const [predictedDigits, setPredictedDigits] = useState<string>(selectedBetType === "zeroth" ? "0" : "00");

  const isSelected = myStockSlotJackpotGameRecord?.some(record => record.placement === selectedBetType && record.marketItem.id === marketItem.id)

  // Reset predicted digits when bet type changes
  useEffect(() => {
    setPredictedDigits(selectedBetType === "zeroth" ? "0" : "00")
  }, [selectedBetType])


  // Extract the last digits from the price for display
  const price = marketItem.price?.toString().replace(/,/g, "")
  const lastDigit = price?.slice(-1)
  const lastTwoDigits = price?.slice(-2).padStart(2, "0");

  const handlePlaceBet = () => {
    if (!roundRecord.id || !marketItem.id) return;
    createStockSlotJackpotGameRecord({
      roundId: roundRecord.id,
      marketItem: marketItem.id,
      placement: selectedBetType,
      amount: globalBetAmount
    })
  }

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
          defaultValue="single-digit"
          className="w-full flex gap-2"
          onValueChange={(value) => setSelectedBetType(value as StockSlotJackpotPlacementType)}
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
                10th Digit
              </TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <Button
                disabled={isPendingMyStockSlotJackpotGameRecord}
                className={`w-full py-3 text-lg font-bold ${isSelected
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-[#2A2F42] hover:bg-[#3A3F52] text-amber-500 border border-amber-500/50"
                  }`}
                onClick={handlePlaceBet}
              >
                {isPendingMyStockSlotJackpotGameRecord ? "Placing bet..." : isSelected ? "REMOVE BET" : `BET ON ${predictedDigits}`}
              </Button>
            </div>
          </div>

          <TabsContent value="single-digit" className="mt-0 flex-1">
            <DigitPicker betType="single-digit" onChange={setPredictedDigits} value={predictedDigits} />
          </TabsContent>

          <TabsContent value="double-digit" className="mt-0 flex-1">
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
