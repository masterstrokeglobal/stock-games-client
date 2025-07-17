import { useState, useEffect, useMemo } from "react";
import { SlotCanvas } from "./slot-canvas";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { RoundRecord } from "@/models/round-record";
import { useGameState } from "@/hooks/use-current-game";
import { cn, INR, slotWinningMultiplier } from "@/lib/utils";
import { useGetMySlotGamePlacement } from "@/react-query/slot-game-queries";

export const Slot = ({ roundRecord,winningIdRoundRecord }: { roundRecord: RoundRecord,winningIdRoundRecord:RoundRecord | null }) => {

    const { gameTimeLeft, isPlaceOver, placeTimeLeft } = useGameState(roundRecord)

    const [stockStates, setStockStates] = useState<number[]>([0, 0, 0, 0, 0, 0])

    const [time, setTime] = useState<string>("00")
    const statusText = isPlaceOver ? "Betting Closed" : "Betting Open"
    const { stocks } = useLeaderboard(roundRecord)

    const { data: myPlacementData } = useGetMySlotGamePlacement(roundRecord?.id);

    const totalBetAmount = useMemo(() => {
        return myPlacementData?.data?.reduce((acc, curr) => acc + curr.amount, 0);
    }, [myPlacementData])

    useEffect(()=>{
        console.log("sarthak roundRecord", roundRecord.bonusMultiplier)
    }, [roundRecord])

    useEffect(() => {
        setTime(!isPlaceOver ? placeTimeLeft.seconds.toString().padStart(2, "0") : gameTimeLeft.seconds.toString().padStart(2, "0") || "00")
    }, [roundRecord, isPlaceOver, placeTimeLeft, gameTimeLeft])

    useEffect(() => {
        if (stocks.length > 0) {
            let newStockStates: number[] = [...stockStates]

            let localStocks: any = winningIdRoundRecord?.sortedMarketItems ? winningIdRoundRecord.sortedMarketItems : stocks
            localStocks = localStocks.sort((a: any, b: any) => a.name.localeCompare(b.name))

            localStocks.slice(0, 5).forEach((stock: any, index: any) => {
                if (stock.price) {
                    const price = parseFloat(stock.price).toFixed(2);
                    const [, decimalPart] = price.split('.');
                    const firstDecimalDigit = decimalPart ? parseInt(decimalPart[0]) : 0;
                    newStockStates[index] = firstDecimalDigit;
                }
            })
            const num: number = Number((winningIdRoundRecord?.bonusSymbol || '0X')[0])
            newStockStates[5] = num
            console.log("here this shit", newStockStates)
            setStockStates(newStockStates)
        }
    }, [stocks, winningIdRoundRecord])

    return (
        <div className="flex flex-1 w-full flex-col items-center justify-center slotmachine-gradient">
           
           <div className="flex items-start justify-center md:gap-4 mb-4 w-full px-2">
            {
                slotWinningMultiplier.map((item) => (
            
           <div key={item.multiplier} className="flex flex-col flex-1 items-center justify-center gap-1 sm:gap-2 bg-[#1B1B1B] border-x-2 border-b-2 border-[#E3B872] px-1 sm:px-2 py-1 rounded-b-md">
           <div className="flex items-center gap-1 sm:gap-2 justify-between whitespace-nowrap w-full">
                        <span className="text-gray-300 text-xs">{item.count} Match</span>
                        <span className="text-yellow-400 font-bold text-xs sm:text-sm">x{item.multiplier}</span>
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                         {totalBetAmount ? `Win ${INR(item.winningAmount(totalBetAmount),true)}` : " "}
                    </div>
                </div>
            ))}
            </div>

            <div className="flex-1 w-full h-[500px] relative z-0 flex justify-center items-center">
                
                <div className="canvas-container absolute z-[-1] w-[300px] h-[210px]">
                    <SlotCanvas stockStates={stockStates} />
                </div>

                <div className="h-[250px] w-fit absolute z-10 bottom-[0px] right-[0px] hidden sm:block">
                    <img src="/images/jackpot/lady5.gif" alt="slot-machine-bg" className="w-full h-full object-contain" />
                </div>
                <div className="h-[250px] w-fit absolute z-10 bottom-[0px] left-[0px] scale-x-[-1] hidden sm:block">
                    <img src="/images/jackpot/lady5.gif" alt="slot-machine-bg" className="w-full h-full object-contain" />
                </div>

                <div className="h-full w-full relative z-10 flex justify-center items-center">
                    <img src="/images/slot-machine/slotMachine.png" alt="slot-machine-bg" className="w-[400px] h-full" />
                </div>
                <div className="absolute z-20 top-[165px] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[270px] h-[187px] text-center">
                    <h1
                        className="text-5xl font-bold keania-one-regular text-yellow-400 drop-shadow-lg"
                        style={{
                            fontFamily: '"Keania One", cursive, sans-serif',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                        }}
                    >
                        {time}
                    </h1>

                </div>

                <div className="absolute z-20 top-[420px] left-[49.5%] translate-x-[-50%] translate-y-[-50%]  text-center">
                    <h1 className={cn("text-lg uppercase font-bold keania-one-regular  drop-shadow-lg",isPlaceOver?"text-red-600":"text-yellow-500")}>
                        {statusText}
                    </h1>
                </div>
            </div>
        </div>
    )
}