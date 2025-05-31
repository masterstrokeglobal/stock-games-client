"use client"
import { Button } from "@/components/ui/button";
import { useIsPlaceOver } from '@/hooks/use-current-game';
import { RoundRecord } from '@/models/round-record';
import { Minus, Plus, Play, Wallet, Zap } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface BettingAreaProps {
    betAmount: number;
    roundRecord: RoundRecord;
    setBetAmount: (amount: number) => void;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
    betAmount,
    setBetAmount,
    roundRecord
}) => {

    const [currentBetAmount, setCurrentBetAmount] = useState(
        500 // set it max the wallet have if less than 500
    );

    const isPlaceOver = useIsPlaceOver(roundRecord);

    const placeBetHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPlaceOver) return; // Don't allow betting if betting is closed
        if (currentBetAmount !== betAmount) {
            setBetAmount(currentBetAmount);
        }
    }

    return (
        <div className="w-full bg-[url('/images/slot-game/wodden-bg.jpg')] bg-repeat bg-contain bg-center text-[#E3B872] p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                    <Wallet className="w-5 h-5" />
                    <span className="text-lg">₹changeIt to max in wallet</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                    <Image
                        src="/images/coin.png"
                        alt="Bet"
                        width={28}
                        height={28}
                    />
                    <span className="text-lg">₹{currentBetAmount}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-[100px]">

                <Button
                    variant="ghost"
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => setCurrentBetAmount(Math.max(0, currentBetAmount - 100))}
                >
                    <Minus size={28} className=" text-[#E3B872]" />
                </Button>

                <div className="relative w-24 h-24 group relative">
                    <div
                        style={{ animationDuration: "5s" }} className="absolute inset-0 rounded-full border-4 animate-spin border-[#E3B872] bg-[#2A1810]/80 flex items-center justify-center transition-all duration-300 group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] group-hover:bg-[#2A1810]">
                        <Image
                            src="/images/slot-game/wheel.png"
                            alt="Spin"
                            width={400}
                            height={400}
                            className="object-contain w-full h-full scale-110 transition-all duration-300 group-hover:brightness-125"
                        />
                    </div>
                    <div
                        onClick={isPlaceOver ? undefined : placeBetHandler}
                        className={`absolute inset-0 flex items-center justify-center rounded-full ${
                            isPlaceOver ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => setCurrentBetAmount(currentBetAmount + 100)}
                >
                    <Plus className="w-7 h-7 text-[#E3B872]" />
                </Button>

            </div>

            <div className="flex items-center justify-center gap-4">

            </div>
            <div className="flex items-center mt-4 justify-center max-w-sm mx-auto flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                TotalBet :
                <span className="text-lg">₹{betAmount}</span>
            </div>

        </div>
    );
};
