"use client";
import { RoundRecord } from "@/models/round-record";
import { WheelCanvas } from "./wheel-canvas";
import React from "react";

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
    if (!roundRecord) {
        return (
            <div className={`flex h-[500px] w-full items-center justify-center ${className || ""}`}>
                <div className="text-gray-500">Loading wheel...</div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center w-full relative gap-6 ${className || ""}`}>
            <img
                src="/images/wodden-board.jpg"
                alt="wodden-board"
                className="w-full h-full object-fill scale-150 absolute top-0 left-0 z-0"
            />
            <div className="h-[500px] w-full">
                <WheelCanvas
                    isSpinning={isSpinning}
                    roundRecord={roundRecord}
                    winningMarketId={winningMarketId}
                    onSpinComplete={onSpinComplete}
                />
            </div>

            {winningMarketId && winningMarketId.length > 0 && (
                <div className="w-full max-w-md border-2 border-amber-700 bg-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">
                    <p className="text-center font-medium">
                        Winner:{" "}
                        <span className="font-bold text-amber-700">
                            {roundRecord.market.find(
                                (market) => market.id === winningMarketId[0]
                            )?.name}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default WheelOfFortune;
