import { useState, useEffect } from "react";
import { SlotCanvas } from "./slot-canvas";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { RoundRecord } from "@/models/round-record";

export const Slot = ({roundRecord}: {roundRecord: RoundRecord}) => {

    const [stockStates, setStockStates] = useState<number[]>([0, 0, 0, 0, 0])
    const [time, setTime] = useState<string>("88:88")

    const { stocks } = useLeaderboard(roundRecord)

        console.log("stocks round", stocks)



    useEffect(() => {
        const interval = setInterval(() => {
            setStockStates(prev => prev.map(() => Math.floor(Math.random() * 10)))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-1 w-full h-full flex-col max-h-[500px] items-center justify-center"> 
            <div className="flex-1 w-full h-full relative z-0">
                <div className="canvas-container absolute z-[-1] left-[50%] translate-x-[-50%] opacity-50 top-[240px] translate-y-[-50%] w-[270px] h-[187px]">
                    <SlotCanvas stockStates={stockStates} />
                </div>
                <div className="h-[500px] w-full relative z-10">
                    <img src="/images/slot-machine/slotMachine.png" alt="slot-machine-bg" className="w-full h-full object-contain" />
                </div>
                <div className="absolute z-10 top-[150px] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[270px] h-[187px] text-center">
                    <h1 
                        className="text-5xl text-white font-bold keania-one-regular text-[#888C27]" 
                        style={{ fontFamily: '"Keania One", cursive, sans-serif' }}
                    >
                        {time}
                    </h1>
                </div>
            </div>
        </div>
    )
}