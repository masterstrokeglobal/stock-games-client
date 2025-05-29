"use client"
import { Button } from "@/components/ui/button";
import { RoundRecord } from '@/models/round-record';
import { Minus, Plus, Play, Wallet, Zap } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface BettingAreaProps {
    betAmount: number;
    roundRecord: RoundRecord;
    setBetAmount: (amount: number) => void;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
    betAmount,
    setBetAmount
}) => {

    return (
        <div className="w-full bg-[url('/images/slot-game/wodden-bg.jpg')] bg-repeat bg-contain bg-center text-[#E3B872] p-4">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                    <Wallet className="w-5 h-5" />
                    <span className="text-lg">₹500.00</span>
                </div>
                <div className="flex items-center justify-center flex-1 gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-2 py-1 rounded-md">
                    <Image
                        src="/images/coin.png"
                        alt="Bet"
                        width={28} 
                        height={28}
                    />
                    <span className="text-lg">₹{betAmount}</span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="ghost"
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => {}}
                >
                    <Zap className="w-7 h-7 fill-[#E3B872] text-[#E3B872]" />
                </Button>

                <Button
                    variant="ghost" 
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => setBetAmount(Math.max(0, betAmount - 100))}
                >
                    <Minus size={28} className=" text-[#E3B872]" />
                </Button>

                <div className="relative w-24 h-24 group">
                    <button style={{animationDuration: "5s"}} className="absolute inset-0 rounded-full border-4 animate-spin border-[#E3B872] bg-[#2A1810]/80 flex items-center justify-center transition-all duration-300 group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] group-hover:bg-[#2A1810]">
                       
                            <Image 
                                src="/images/slot-game/wheel.png"
                                alt="Spin"
                                width={400}
                                height={400}
                                className="object-contain w-full h-full scale-110 transition-all duration-300 group-hover:brightness-125"
                            />
                    </button>
                </div>

                <Button
                    variant="ghost"
                    className="h-14 w-14 p-0 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => setBetAmount(betAmount + 100)}
                >
                    <Plus className="w-7 h-7 text-[#E3B872]" />
                </Button>

                <Button
                    variant="ghost"
                    className="h-14 w-14 rounded-full bg-[#2A1810]/80 hover:bg-[#2A1810] border-2 border-[#E3B872] transition-all duration-300 hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    onClick={() => {}}
                >
                    <Play className="w-7 h-7 fill-[#E3B872] text-[#E3B872]" />
                </Button>
            </div>
        </div>
    );
};
