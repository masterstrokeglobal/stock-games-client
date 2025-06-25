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

    const winningColor = useMemo(() => {
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
                <>
                    <div style={{
                        backgroundImage: winningColor ? winningColor.backgroundGradient : "transparent",
                        boxShadow: winningColor ? winningColor.shadow : "none",
                        borderColor: winningColor ? winningColor.borderColor : "transparent",
                    }} className={cn("w-full backdrop-blur-lg  md:max-w-md xs:max-w-screen-xs max-w-72  rounded-md z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 border-2")}>
                        <div className="text-center font-medium uppercase">
                            <h3 className="md:text-3xl sm:text-2xl text-xl font-semibold italic sansation-regular text-white uppercase tracking-wider">
                                Winner
                            </h3>
                            <hr style={{ backgroundColor: winningColor ? winningColor.borderColor : "transparent" }} className={cn(" h-0.5 border-none my-4 mx-[25%]")} />
                            <p className="text-white md:text-2xl text-xl font-medium sansation-regular    ">
                                {winningColor?.name}
                            </p>
                            <p className=" text-white md:text-lg text-base font-light sansation-light tracking-widest">
                                ({roundRecord.market.find(
                                    (market) => market.id === winningMarketId?.[0]
                                )?.name})

                            </p>
                        </div>
                    </div>
                    <div
                        style={{
                            background: 'radial-gradient(circle,rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 100%)',
                        }}
                        className="w-full h-full absolute top-0 left-0  " />
                </>
            )}
        </div>
    );
};

export default WheelOfFortune;
