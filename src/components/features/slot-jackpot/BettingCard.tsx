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
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { formatRupee } from "@/lib/utils"

interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: RankedMarketItem
}

export function BettingCard({ marketItem, roundRecord, globalBetAmount }: BettingCardProps) {
  const { data: myStockSlotJackpotGameRecord, isPending: isPendingMyStockSlotJackpotGameRecord } = useGetMyStockSlotJackpotGameRecord(roundRecord.id)
  const { mutate: createStockSlotJackpotGameRecord } = useCreateStockSlotJackpotGameRecord()

  const [selectedBetType, setSelectedBetType] = useState<StockSlotJackpotPlacementType>(StockSlotJackpotPlacementType.ZEROTH)
  const [predictedDigits, setPredictedDigits] = useState<string>(selectedBetType === StockSlotJackpotPlacementType.ZEROTH ? "0" : "00");

  const betPlaced = myStockSlotJackpotGameRecord?.find(record => record.placement === selectedBetType && record.marketItem.id === marketItem.id)

  useEffect(() => {
    setPredictedDigits(selectedBetType === StockSlotJackpotPlacementType.ZEROTH ? "0" : "00")
  }, [selectedBetType])

  const isPlaceOver = useIsPlaceOver(roundRecord);

  let price:any = marketItem.price ?? roundRecord.getInitialPrice(marketItem.bitcode ?? "");
  price = parseFloat(price);
  price = price.toFixed(2);
  
  const initialPrice = roundRecord.getInitialPrice(marketItem.bitcode ?? "")
  const currentPrice = marketItem.price ?? initialPrice
  const changePercent = parseFloat(marketItem.change_percent) || 0
  const isPositiveChange = changePercent > 0

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

  const bettingOpen = !isPlaceOver && !isPendingMyStockSlotJackpotGameRecord;

  return (
    <Card className="w-full bg-gradient-to-r from-gray-900 to-gray-800 border-primary text-white">
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Market Info */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{marketItem.name}</h3>
              <p className="text-gray-400 text-sm">{marketItem.codeName}</p>
            </div>
            
            <div className="bg-gray-900/60 p-3 rounded-lg space-y-2 border border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400">Betting Price:</span>
                <span>{marketItem.currency} {initialPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bet Amount:</span>
                <span> {formatRupee(globalBetAmount)}</span>
              </div>
              {betPlaced && (
                <div className="flex justify-between text-amber-400">
                  <span>Your Bet:</span>
                  <span>{betPlaced.placedNumber}</span>
                </div>
              )}
            </div>
          </div>

        
        </div>

        {/* Current Price */}
        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col justify-between">
         { !isPlaceOver && <div className="text-center mb-4">
            <span className="text-gray-400">Current Price</span>
            
          </div>}
          <div className="flex-1 flex flex-col justify-center">
         { !isPlaceOver && <div className="text-center">
              <div className="text-3xl font-bold mb-2">
                {marketItem.currency} {currentPrice?.toFixed(2)}
              </div>
              <div className={`flex items-center justify-center ${isPositiveChange ? "text-green-400" : "text-red-400"}`}>
                {isPositiveChange ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                <span className="font-medium">{isPositiveChange ? "+" : ""}{changePercent.toFixed(2)}%</span>
              </div>
            </div>}
          </div>

          {isPlaceOver && (
            <div className="mt-4 gap-2 text-center">
              <p className="text-gray-300 mb-2 flex items-center justify-center">Final Digits
                <span className="text-white font-bold ml-2">
                  {marketItem.currency} {currentPrice?.toFixed(2)}
                </span>
              </p>
              <DigitPicker showInput={false} betType={StockSlotJackpotPlacementType.BOTH} onChange={setPredictedDigits} value={currentPrice?.toString().slice(-2)} disabled={!!betPlaced} />
            </div>
          )}
        </div>

        {/* Betting Controls */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <Tabs
            defaultValue={selectedBetType}
            className="flex flex-row h-full gap-3"
            onValueChange={(value) => setSelectedBetType(value as StockSlotJackpotPlacementType)}
          >
            <div className="flex-1 flex flex-col justify-between">
            <TabsList className="grid grid-cols-1 gap-2 bg-transparent mb-4">
              <TabsTrigger 
                value="zeroth"
                className="w-full data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 border border-gray-700"
              >
                Last Digit
              </TabsTrigger>
              <TabsTrigger 
                value="tenth"
                className="w-full data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 border border-gray-700"
              >
                First Digit
              </TabsTrigger>
              <TabsTrigger 
                value="both"
                className="w-full data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 border border-gray-700"
              >
                Both Digits
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col">
           

              {!isPlaceOver ? (
                <Button
                  disabled={isPendingMyStockSlotJackpotGameRecord || betPlaced !== undefined}
                  onClick={handlePlaceBet}
                  className={`w-full py-6 text-lg font-bold ${
                    betPlaced 
                      ? "bg-amber-500 hover:bg-amber-600 text-black"
                      : bettingOpen
                        ? "bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white border-2 border-amber-400 shadow-lg shadow-amber-500/20 animate-pulse"
                        : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {isPendingMyStockSlotJackpotGameRecord 
                    ? "Placing..." 
                    : betPlaced 
                      ? `BET PLACED ${betPlaced.placedNumber}` 
                      : `BET ON ${predictedDigits}`
                  }
                </Button>
              ) : betPlaced ? (
                <div className="bg-amber-900/40 rounded-lg border-2 border-amber-500/50 p-4 text-center">
                  <p className="text-sm text-white mb-1">YOUR BET</p>
                  <p className="text-2xl font-bold text-amber-400">{betPlaced.placedNumber}</p>
                </div>
              ) : (
                <div className="bg-red-900/30 rounded-lg border border-red-500/30 p-4 text-center">
                  <p className="text-red-400">No bet placed</p>
                  <p className="text-sm text-gray-400">Better luck next time!</p>
                </div>
              )}
            </div>
            </div>
            {
              !isPlaceOver && (
                <div className="flex-1 -mt-4">
                    <TabsContent value="zeroth" className="h-full">
                  <DigitPicker betType={StockSlotJackpotPlacementType.ZEROTH} onChange={setPredictedDigits} value={predictedDigits} disabled={!!betPlaced} />
                </TabsContent>
                <TabsContent value="tenth" className="h-full">
                  <DigitPicker betType={StockSlotJackpotPlacementType.TENTH} onChange={setPredictedDigits} value={predictedDigits} disabled={!!betPlaced} />
                </TabsContent>
                <TabsContent value="both" className="h-full">
                  <DigitPicker betType={StockSlotJackpotPlacementType.BOTH} onChange={setPredictedDigits} value={predictedDigits} disabled={!!betPlaced} />
                </TabsContent>
              </div>
              )
            }
          </Tabs>
        </div>
      </div>
    </Card>
  )
}