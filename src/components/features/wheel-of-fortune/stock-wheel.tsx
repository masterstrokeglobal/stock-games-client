"use client";

import { RoundRecord } from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface WheelCanvasProps {
    isSpinning: boolean;
    roundRecord?: RoundRecord;
    winningMarketId: number[] | null;
    onSpinComplete?: () => void;
}

interface WheelOfFortuneProps {
    className?: string;
    roundRecord?: RoundRecord;
    winningMarketId: number[] | null;
    isSpinning: boolean;
    onSpinComplete?: () => void;
}

const WheelCanvas: React.FC<WheelCanvasProps> = ({
    isSpinning,
    roundRecord,
    winningMarketId,
    onSpinComplete,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [rotation, setRotation] = useState<number>(0);
    const [spinStartTime, setSpinStartTime] = useState<number | null>(null);
    const [spinDuration, setSpinDuration] = useState<number>(5000);
    const [finalRotation, setFinalRotation] = useState<number>(0);
    const [continuousSpinSpeed] = useState<number>(0.02);
    const requestRef = useRef<number | null>(null);

    const stocks: MarketItem[] = roundRecord?.market || [];
    const segmentAngle: number =
        stocks.length > 0 ? (2 * Math.PI) / stocks.length : 0;

    const drawWheel = useCallback(
        (currentRotation: number): void => {
            const canvas = canvasRef.current;
            if (!canvas || stocks.length === 0) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            if (canvas.width <= 0 || canvas.height <= 0) return;

            const centerX: number = canvas.width / 2;
            const centerY: number = canvas.height / 2;
            const radius: number = Math.max(10, Math.min(centerX, centerY) - 10);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stocks.forEach((stock: MarketItem, index: number) => {
                const startAngle: number = index * segmentAngle + currentRotation;
                const endAngle: number = (index + 1) * segmentAngle + currentRotation;

                const colorConfig = roundRecord?.marketColorConfig(stock.id ?? 0);
                const segmentColor: string =
                    colorConfig?.actualColor ||
                    `hsl(${(index * 360) / stocks.length}, 70%, 60%)`;

                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = segmentColor;
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();

                const midAngle: number = startAngle + segmentAngle / 2;
                const textRadius: number = radius * 0.75;
                const textX: number = centerX + textRadius * Math.cos(midAngle);
                const textY: number = centerY + textRadius * Math.sin(midAngle);

                ctx.save();
                ctx.translate(textX, textY);
                let textRotation: number = midAngle;
                if (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2) {
                    textRotation += Math.PI;
                }
                ctx.rotate(textRotation);
                ctx.fillStyle = "#FFFFFF";
                ctx.strokeStyle = "#000000";
                ctx.font = "10px Arial";
                ctx.lineWidth = 1;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                const text = stock.name || `Stock ${stock.id}`;
                ctx.strokeText(text, 0, 0);
                ctx.fillText(text, 0, 0);
                ctx.restore();
            });

            // Center and pointer
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI);
            ctx.fillStyle = "#333333";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(centerX, centerY - radius - 10);
            ctx.lineTo(centerX - 10, centerY - radius + 10);
            ctx.lineTo(centerX + 10, centerY - radius + 10);
            ctx.closePath();
            ctx.fillStyle = "#FF0000";
            ctx.fill();
        },
        [stocks, segmentAngle, roundRecord]
    );

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || stocks.length === 0) return;

        const container = canvas.parentElement;
        if (!container) return;

        const containerWidth = container.clientWidth || 500;
        const containerHeight = container.clientHeight || 500;

        const size = Math.max(100, Math.min(containerWidth, containerHeight) - 20);
        canvas.width = size;
        canvas.height = size;

        if (size > 20) {
            drawWheel(rotation);
        }
    }, [drawWheel, stocks.length, rotation]);

    useEffect(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        return () => window.removeEventListener("resize", resizeCanvas);
    }, [resizeCanvas]);

    const calculateWinningRotation = useCallback(
        (winningId: number): number => {
            const winningIndex = stocks.findIndex((stock) => stock.id === winningId);
            if (winningIndex === -1) return Math.random() * 2 * Math.PI;
            const targetSegmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
            const desiredRotation = (3 * Math.PI) / 2 - targetSegmentCenter;
            return (desiredRotation + 2 * Math.PI) % (2 * Math.PI);
        },
        [stocks, segmentAngle]
    );

    useEffect(() => {
        if (
            isSpinning &&
            winningMarketId !== null &&
            !spinStartTime &&
            stocks.length > 0
        ) {
            setSpinStartTime(Date.now());

            const targetRotation = calculateWinningRotation(winningMarketId[0]);
            const normalizedCurrent = rotation % (2 * Math.PI);
            const minRotations = 3;
            const delta = (targetRotation - normalizedCurrent + 2 * Math.PI) % (2 * Math.PI);

            setFinalRotation(rotation + minRotations * 2 * Math.PI + delta);
            setSpinDuration(3000 + Math.random() * 2000);
        }
    }, [
        isSpinning,
        winningMarketId,
        stocks.length,
        calculateWinningRotation,
        rotation,
        spinStartTime,
    ]);

    useEffect(() => {
        const animate = (): void => {
            if (spinStartTime && isSpinning && stocks.length > 0) {
                const elapsed = Date.now() - spinStartTime;
                const progress = Math.min(1, elapsed / spinDuration);
                const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
                const easedProgress = easeOut(progress);
                const newRotation =
                    rotation + (finalRotation - rotation) * easedProgress;

                setRotation(newRotation);
                drawWheel(newRotation);

                if (progress >= 1 || !isSpinning) {
                    setSpinStartTime(null);
                    if (onSpinComplete) onSpinComplete();
                }
            } else if (isSpinning && !spinStartTime && !winningMarketId) {
                const newRotation = rotation + continuousSpinSpeed;
                setRotation(newRotation);
                drawWheel(newRotation);
            } else {
                drawWheel(rotation);
            }

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [
        drawWheel,
        finalRotation,
        isSpinning,
        rotation,
        spinDuration,
        spinStartTime,
        stocks.length,
        winningMarketId,
        onSpinComplete,
        continuousSpinSpeed,
    ]);

    if (!roundRecord || stocks.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-gray-500">No market data available</div>
            </div>
        );
    }

    return (
        <div className="relative flex h-full w-full items-center justify-center min-h-[400px] min-w-[400px]">
            <canvas ref={canvasRef} className="max-h-full max-w-full" />
        </div>
    );
};

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
