"use client"

import FavoriteMarketItem from "@/components/common/favorite-markitem"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsPlaceOver } from "@/hooks/use-current-game"
import { RankedMarketItem } from "@/hooks/use-leadboard"
import { formatRupee } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { StockSlotJackpotPlacementType } from "@/models/stock-slot-jackpot"
import { useCreateStockSlotJackpotGameRecord, useGetMyStockSlotJackpotGameRecord } from "@/react-query/game-record-queries"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DigitPicker } from "./DigitPicker"

interface BettingCardProps {
  globalBetAmount: number,
  roundRecord: RoundRecord,
  marketItem: RankedMarketItem
}

export function BettingCard({ marketItem, roundRecord, globalBetAmount }: BettingCardProps) {
  const { data: myStockSlotJackpotGameRecord, isPending: isPendingMyStockSlotJackpotGameRecord } = useGetMyStockSlotJackpotGameRecord(roundRecord.id)
  const { mutate: createStockSlotJackpotGameRecord } = useCreateStockSlotJackpotGameRecord()

  const marketSLotGameRecord = myStockSlotJackpotGameRecord?.filter(record => record.marketItem.id === marketItem.id)
  const [selectedBetType, setSelectedBetType] = useState<StockSlotJackpotPlacementType>(StockSlotJackpotPlacementType.ZEROTH)
  const [predictedDigits, setPredictedDigits] = useState<string>(selectedBetType === StockSlotJackpotPlacementType.ZEROTH ? "0" : "00");

  const betPlaced = myStockSlotJackpotGameRecord?.find(record => record.placement === selectedBetType && record.marketItem.id === marketItem.id)

  useEffect(() => {
    setPredictedDigits(selectedBetType === StockSlotJackpotPlacementType.ZEROTH ? "0" : "00")
  }, [selectedBetType])

  const isPlaceOver = useIsPlaceOver(roundRecord);


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

  const totalBetAmount = marketSLotGameRecord?.reduce((acc, record) => acc + record.amount, 0)

  const bettingOpen = !isPlaceOver && !isPendingMyStockSlotJackpotGameRecord;

  const lastTwoDigits = parseFloat(currentPrice.toString()).toFixed(2).toString().slice(-2);

  return (

    <div className="">
      <Card className="w-full relative bg-gradient-to-r md:pr-8 bg-gray-900  border border-gray-700 text-white">
        <div className="card__border" />
        {marketItem.id && <FavoriteMarketItem marketItemId={marketItem.id} className="absolute top-2 right-2" />}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3  gap-4">
          <div className="bg-white/10 cards__inner backdrop-blur-md rounded-xl  flex flex-col justify-between">
            <div className="cards__card card">
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
                  <span> {formatRupee(totalBetAmount ?? 0)}</span>
                </div>                {marketSLotGameRecord?.map(record => (
                  <div key={record.id} className="flex border-b border-gray-700 pb-2 justify-between items-center text-sm">
                    <span className="font-medium">
                      {formatRupee(record.amount)} on {record.typeName} {' '}
                      &nbsp;
                      <span className="text-purple-500 font-bold">
                        {record.placedNumber}
                      </span>
                    </span>
                    <span className="text-green-400">
                      Win: {formatRupee(record.amount * 1.96)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Price */}
          <div className=" cards__inner group  backdrop-blur-md  rounded-lg  flex flex-col justify-between">
            <div className="cards__card card">
            {!isPlaceOver && <div className="text-center mb-4">
              <span className="text-gray-400 group-hover:text-gray-700 transition-all duration-300">Current Price</span>

            </div>}
            <div className="flex-1 flex flex-col justify-center">
              {!isPlaceOver && <div className="text-center">
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
                <DigitPicker showInput={false} betType={StockSlotJackpotPlacementType.BOTH} onChange={setPredictedDigits} value={lastTwoDigits} disabled={!!betPlaced} />
              </div>
            )}
            </div>
          </div>

          {/* Betting Controls */}
          <div className="cards__inner backdrop-blur-md  ">
            <div className="cards__card card">
            <Tabs
              defaultValue={selectedBetType}
              className="flex flex-row h-full gap-3"
              onValueChange={(value) => setSelectedBetType(value as StockSlotJackpotPlacementType)}
            >
              <div className="flex-1 flex flex-col justify-between">
                <TabsList className="grid grid-cols-1 gap-2 bg-transparent mb-4">
                  <TabsTrigger
                    value="zeroth"
                    className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 border border-gray-700"
                  >
                    Last Digit
                  </TabsTrigger>
                  <TabsTrigger
                    value="tenth"
                    className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 border border-gray-700"
                  >
                    First Digit
                  </TabsTrigger>
                  <TabsTrigger
                    value="both"
                    className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 border border-gray-700"
                  >
                    Both Digits
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-col">


                  {!isPlaceOver ? (
                    <Button
                      disabled={isPendingMyStockSlotJackpotGameRecord || betPlaced !== undefined}
                      onClick={handlePlaceBet}
                      className={`w-full py-6 text-lg font-bold ${betPlaced
                        ? "bg-purple-500 hover:bg-purple-600 text-black"
                        : bettingOpen
                          ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/20 animate-pulse"
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
                    <div className="bg-purple-900/40 rounded-lg border-2 border-purple-500/50 p-4 text-center">
                      <p className="text-sm text-white mb-1">YOUR BET</p>
                      <p className="text-2xl font-bold text-purple-400">{selectedBetType === StockSlotJackpotPlacementType.BOTH ? betPlaced.placedNumber.toPrecision(2) : betPlaced.placedNumber}</p>
                    </div>
                  ) : (
                    <div className="bg-red-900/30 rounded-lg border border-red-500/30 p-4 text-center">
                      <p className="text-red-400">No bet placed</p>
                      <p className="text-sm text-gray-400">Please place a bet to win!</p>
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
        </div>
      </Card>
    </div>
  )
}