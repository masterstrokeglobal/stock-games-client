import { useState, useEffect } from "react";
import { SlotCanvas } from "./slot-canvas";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { RoundRecord } from "@/models/round-record";
import { useGameState } from "@/hooks/use-current-game";

export const Slot = ({ roundRecord }: { roundRecord: RoundRecord }) => {

    const { gameTimeLeft, isPlaceOver, placeTimeLeft } = useGameState(roundRecord)

    const [stockStates, setStockStates] = useState<number[]>([0, 0, 0, 0, 0])

    const [time, setTime] = useState<string>("00")
    const statusText = isPlaceOver ? "Betting Closed" : "Betting Open"
    const { stocks } = useLeaderboard(roundRecord)

    useEffect(() => {
        setTime(!isPlaceOver ? placeTimeLeft.seconds.toString().padStart(2, "0") : gameTimeLeft.seconds.toString().padStart(2, "0") || "00")
    }, [roundRecord, isPlaceOver, placeTimeLeft, gameTimeLeft])

    useEffect(() => {
        if (stocks.length > 0) {
            const newStockStates= [...stockStates]

            let localStocks: any = stocks
            localStocks = localStocks.sort((a: any, b: any) => a.name.localeCompare(b.name))

            localStocks.slice(0, 5).forEach((stock: any, index: any) => {
                if (stock.price) {
                    const price = parseFloat(stock.price).toFixed(2);
                    const [integerPart, decimalPart] = price.split('.');
                    const firstDecimalDigit = decimalPart ? parseInt(decimalPart[0]) : 0;
                    newStockStates[index] = firstDecimalDigit;
                }
            })
            setStockStates(newStockStates)
        }
    }, [stocks])

    return (
        <div className="flex flex-1 w-full flex-col h-[500px] items-center justify-center">
            <div className="flex-1 w-full h-[500px]  relative z-0 slotmachine-gradient">
                <div className="canvas-container absolute z-[-1] left-[50%] translate-x-[-50%] top-[240px] translate-y-[-50%] w-[270px] h-[187px]">
                    <SlotCanvas stockStates={stockStates} />
                </div>

                <div className="h-[300px] w-fit absolute z-10 bottom-[0px] right-[0px] hidden sm:block">
                    <img src="/images/dice-game/lady.gif" alt="slot-machine-bg" className="w-full h-full object-contain" />
                </div>
                <div className="h-[300px] w-fit absolute z-10 bottom-[0px] left-[0px] scale-x-[-1] hidden sm:block">
                    <img src="/images/dice-game/lady.gif" alt="slot-machine-bg" className="w-full h-full object-contain" />
                </div>

                <div className="h-[500px] w-full relative z-10">
                    <img src="/images/slot-machine/slotMachine.png" alt="slot-machine-bg" className="w-full h-full object-contain" />
                </div>
                <div className="absolute z-20 top-[150px] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[270px] h-[187px] text-center">
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
                    <h1 className="text-lg uppercase font-bold keania-one-regular text-yellow-400 drop-shadow-lg">
                        {statusText}
                    </h1>
                </div>
            </div>
        </div>
    )
}