"use client"
import { Input } from "@/components/ui/input";
import { useAuthStore } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import React from 'react';

interface BettingAreaProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
    betAmount,
    setBetAmount
}) => {
    const { userDetails } = useAuthStore();
    const coinValues = userDetails?.company?.coinValues;

    // Custom chip images
    const chipImages = [
        "/images/head-tail/chip-4.png",
        "/images/head-tail/chip-1.png",
        "/images/head-tail/chip-2.png",
        "/images/head-tail/chip-3.png"
    ];

    return (
        <>
            <div className="w-full flex relative z-10 flex-col md:flex-row items-center justify-center gap-4 bg-transparent px-2 ">
                {/* Chips */}
                <div className="flex ">
                    {coinValues?.map((amount, idx) => (
                        <button
                            key={amount}
                            onClick={() => setBetAmount(amount)}
                            className={cn(
                                "relative flex flex-col size-16 sm:size-24  items-center justify-center outline-none border-nonetransition-all duration-200"                            )}
                            style={{
                                background: "none",
                                padding: 0,
                                borderRadius: "50%",
                            }}
                        >
                            <img
                                src={chipImages[idx % chipImages.length]}
                                alt={`chip-${amount}`}
                                className="w-16 sm:w-24 h-16 sm:h-24 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square object-cover"
                                style={{
                                    filter: betAmount === amount ? "brightness(1.2)" : "none",
                                }}
                            />
                            <span
                                className="sm:text-xs text-[10px] font-semibold relative z-10 -translate-y-[8px] sm:-translate-y-[10px] text-white font-phudu"
                                style={{
                                    textShadow: "0 0 6px #000, 0 0 2px #fff"
                                }}
                            >
                                ₹{amount}
                            </span>
                        </button>
                    ))}
                </div>

<div className="flex gap-2 items-center flex-wrap">
                {/* Bet input and controls */}
                <div className="flex items-center gap-1 flex-1 md:max-w-[200px] h-fit px-2 py-2 rounded-full" style={{
                    border: "1px solid #0074FF",
                    boxShadow: "0px 0px 4.1px 0px rgba(0, 116, 255, 0.86)",
                }}>
                    <button
                        onClick={() => setBetAmount(Math.max((userDetails?.company?.minPlacement ?? 1), betAmount - (coinValues?.[0] ?? 1)))}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold"
                        style={{
                            background: "radial-gradient(50% 50% at 50% 50%, #004DA9 0%, #010571 100%)",
                            boxShadow: "0px 0px 4.1px 0px rgba(0, 116, 255, 0.86)"
                        }}
                        tabIndex={0}
                        aria-label="Decrease bet"
                        type="button"
                    >-</button>
                    <Input
                        type="number"
                        min={userDetails?.company?.minPlacement}
                        max={userDetails?.company?.maxPlacement}
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="w-24 text-center border-none text-sm font-bold text-white bg-transparent h-full rounded-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                        onClick={() => setBetAmount(Math.min((userDetails?.company?.maxPlacement ?? 100000), betAmount + (coinValues?.[0] ?? 1)))}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold"
                        style={{
                            background: "radial-gradient(50% 50% at 50% 50%, #004DA9 0%, #010571 100%)",
                            boxShadow: "0px 0px 4.1px 0px rgba(0, 116, 255, 0.86)"
                        }}
                        tabIndex={0}
                        aria-label="Increase bet"
                        type="button"
                    >+</button>
                </div>

                {/* Total Bet */}
                <div  style={{
                    borderRadius: "30px",
                    border: "1px solid #079FFE",
                    boxShadow: "0px 0px 4.1px 0px rgba(0, 116, 255, 0.86)"
                }}>
                    <div
                        className="flex md:flex-col relative gap-x-2  items-center justify-center rounded-[30px] md:px-6 px-2 py-2 min-w-[120px] md:h-16"
                        style={{
                            background: "linear-gradient(270deg, rgba(11, 156, 254, 0.3) 0%, rgba(211, 5, 254, 0.3) 100%)",
                        }}
                    >
                        <span className="uppercase text-xs text-[#A3D1FF] text-nowrap relative z-10  tracking-widest font-poppins ">Total Bet</span>
                        <span className="text-white text-xl font-semibold text-nowrap font-phudu tracking-wide">₹ {betAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};