"use client";
import { cn } from "@/lib/utils";
import { RoundRecord, WHEEL_COLOR_CONFIG } from "@/models/round-record";
import React, { useEffect, useMemo, useState } from "react";
import { WheelCanvas } from "./wheel-canvas";

interface WheelOfFortuneProps {
    className?: string;
    roundRecord?: RoundRecord;
    winningMarketId: number[] | null;
    isSpinning: boolean;
    onSpinComplete?: () => void;
}
const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({
    roundRecord,
    winningMarketId,
    isSpinning,
    className,
    onSpinComplete,
}) => {

    const [showResult, setShowResult] = useState(false);
    const [displayWinner, setDisplayWinner] = useState(false);
    useEffect(() => {
        if (winningMarketId && winningMarketId.length > 0) {
            setTimeout(() => {
                setDisplayWinner(true);
            }, 1500);
        }
        else {
            setDisplayWinner(false);
        }
    }, [winningMarketId]);

    useEffect(() => {
        if (winningMarketId) {
            setTimeout(() => {
                setShowResult(true);
            }, 2000);
        }
        else {
            setShowResult(false);
        }
    }, [winningMarketId]);

    const winningColor= useMemo(() => {
        if (!winningMarketId || !roundRecord) return null;
        const color = roundRecord.getColorByMarketId(winningMarketId[0] as unknown as number);
        const config = color ? WHEEL_COLOR_CONFIG[color] : null;
        return config || null;
      }, [winningMarketId, roundRecord]);
    
    if (!roundRecord) {
        return (
            <div className={`flex h-[500px] w-full items-center justify-center ${className || ""}`}>
                <div className="text-gray-500">Loading wheel...</div>
            </div>
        );
    }
    
    return (
        <div className={`flex flex-col items-center w-full relative gap-6 ${className || ""}`}>
            <div className="md:min-h-[450px] xs:min-h-[360px] min-h-[200px] w-full">
                <WheelCanvas
                    isSpinning={isSpinning}
                    roundRecord={roundRecord}
                    winningMarketId={winningMarketId}
                    onSpinComplete={onSpinComplete}
                />

            </div>

            {showResult && displayWinner && winningMarketId && winningMarketId.length > 0 && (
                <div style={{
                    backgroundImage: winningColor ? winningColor.backgroundGradient : "transparent",
                    boxShadow: winningColor ? winningColor.shadow : "none",
                }} className={cn("w-full  max-w-md rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 border-2", winningColor ? winningColor.borderColor : "")}>
                    <div className="text-center font-medium uppercase">
                        <h3 className="text-xl font-semibold italic uppercase tracking-wider">
                        Winner
                        </h3>
                        <hr className={cn(" border-t-2 my-4 mx-[25%]", winningColor ? winningColor.borderColor : "")}/>
                        <p   className="text-white text-xl font-medium">
                            {winningColor?.name}
                        </p>
                        <p className=" text-white text-lg font-light tracking-widest">
                            ({roundRecord.market.find(
                                (market) => market.id === winningMarketId?.[0]
                            )?.name})
                            
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WheelOfFortune;
