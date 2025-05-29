"use client";
import { RoundRecord } from "@/models/round-record";
import { WheelCanvas } from "./wheel-canvas";
import React, { useEffect, useState } from "react";

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

    const [showResult, setShowResult] = React.useState(false);
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

    if (!roundRecord) {
        return (
            <div className={`flex h-[500px] w-full items-center justify-center ${className || ""}`}>
                <div className="text-gray-500">Loading wheel...</div>
            </div>
        );
    }

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

    return (
        <div className={`flex flex-col items-center w-full relative gap-6 ${className || ""}`}>
            <div className="h-[500px] w-full">
                <WheelCanvas
                    isSpinning={isSpinning}
                    roundRecord={roundRecord}
                    winningMarketId={winningMarketId}
                    onSpinComplete={onSpinComplete}
                />

            </div>

            {showResult && displayWinner && winningMarketId && winningMarketId.length > 0 && (
                <div className="w-full  max-w-md border-2 border-amber-700 bg-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 ">
                    <p className="text-center font-medium">
                        Winner:{" "}
                        <span className="font-bold text-amber-700">
                            {roundRecord.market.find(
                                (market) => market.id === winningMarketId?.[0]
                            )?.name}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default WheelOfFortune;
