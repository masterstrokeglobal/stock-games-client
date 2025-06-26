"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from '@/context/auth-context';
import { useIsPlaceOver, useShowResults } from '@/hooks/use-current-game';
import { cn, INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useGetMyCurrentRoundWheelOfFortunePlacement } from "@/react-query/wheel-of-fortune-queries";
import { Minus, Plus } from "lucide-react";
import React from 'react';
import WheelOfFortuneResultDialog from "./game-result";

interface BettingAreaProps {
  betAmount: number;
  roundRecord: RoundRecord;
  setBetAmount: (amount: number) => void;
  className?: string;
}

export const BettingArea: React.FC<BettingAreaProps> = ({
  betAmount,
  setBetAmount,
  roundRecord,
  className
}) => {
  const { userDetails } = useAuthStore();
  const isPlaceOver = useIsPlaceOver(roundRecord);
  const { data: placements } = useGetMyCurrentRoundWheelOfFortunePlacement(roundRecord.id);
  const coinValues = userDetails?.company?.coinValues;
  const showResult = useShowResults(roundRecord, placements ?? []);

  const handleDecreaseBetAmount = () => {
    setBetAmount(betAmount - 100);
  };
  const handleIncreaseBetAmount = () => {
    setBetAmount(betAmount + 100);
  };

  return (
    <>
      <div className={cn("w-full flex flex-col font-montserrat tracking-wide justify-between gap-4  text-white ", className)}>
        <div className="grid grid-cols-2 gap-2 w-full">
          {coinValues?.map((amount) => (
            <Button
              className={cn(
                'rounded-md transition-all py-4 h-12 duration-200 relative group overflow-hidden bg-[#366D51] border-2 border-[#5DA69A] hover:bg-[#366D51] hover:border-[#5DA69A] ')}
              key={amount}
              onClick={() => setBetAmount(amount)}
            >
              <div className="flex items-center">
                <span className="text-sm">{INR(amount, true)}</span>
              </div>
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%]",
                betAmount === amount && "animate-shimmer"
              )} />
            </Button>
          ))}
        </div>
        <div className="flex justify-center relative mb-4">
          <Button onClick={handleDecreaseBetAmount} className="rounded-full absolute left-2 top-2  h-8 w-10 px-0 flex items-center justify-center bg-[#366D51] border border-[#5DA69A]">
            <Minus className="size-6" />
          </Button>
          <Input
            type="number"
            min={userDetails?.company?.minPlacement}
            max={userDetails?.company?.maxPlacement}
            placeholder="Enter bet amount"
            disabled={isPlaceOver}
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="p-2 rounded-full h-12 border-2 text-center bg-transparent border-[#5DA69A] text-white text-xl  focus:border-[#5DA69A] focus:ring-2 focus:ring-[#5DA69A]/20 transition-all"
          />
          <Button onClick={handleIncreaseBetAmount} className="rounded-full absolute right-2 top-2  h-8 w-10 px-0 flex items-center justify-center bg-[#366D51] border border-[#5DA69A]">
            <Plus className="size-6" />
          </Button>
        </div>
        <div style={{borderColor: '#5DA69A', boxShadow: '0px 0px 5.7px 0px rgba(93, 166, 154, 1)'}} className="flex py-4 rounded-lg text-lg justify-center text-white  relative z-[11] items-center w-full flex-col bg-[#324241] border-2 border-[#5DA69A]  gap-4">
          <span className="text-lg uppercase font-bold tracking-wider">
            Total Bet
          </span>
          <span className="font-bold">
            {INR(betAmount, true)}
          </span>
        </div>
      </div>
      <WheelOfFortuneResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
    </>
  );
};