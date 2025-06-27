"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from '@/context/auth-context';
import { useShowResults } from '@/hooks/use-current-game';
import { cn, INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useGetMyCurrentRoundDiceGamePlacement } from "@/react-query/dice-game-queries";
import React from 'react';
import DiceGameResultDialog from "./game-result";

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
  const { userDetails } = useAuthStore();
  const { data: placements } = useGetMyCurrentRoundDiceGamePlacement(roundRecord.id);
  const coinValues = userDetails?.company?.coinValues;

  const showResult = useShowResults(roundRecord, placements ?? []);

  return (
    <>
      <div
        className="w-full md:p-6 bg-cover bg-center ">
        <div className="flex justify-center relative mb-4">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white">
            Rs.
          </span>
          <Input
            type="number"
            min={userDetails?.company?.minPlacement}
            max={userDetails?.company?.maxPlacement}
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className={cn(
              "p-2  remove-spin border-2 text-lg h-12 pl-12 text-white rounded-md dice-input border-none bg-[#4467CC] focus:border-[#d1daf7] focus:ring-2 focus:ring-[#d1daf7] transition-all")}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 h-full w-fit p-0 flex flex-col justify-center text-white">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBetAmount(Math.min(betAmount + 100, userDetails?.company?.maxPlacement || 1000))}
              className="h-5"
            >
              <svg  className="rotate-180" width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L8 8L14 2" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5"
              onClick={() => setBetAmount(Math.max(betAmount - 100, userDetails?.company?.minPlacement || 100))}
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L8 8L14 2" stroke="#E0E0E0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          {coinValues?.map((amount) => (
            <Button
              className={cn(
                'rounded-full border-none transition-all flex-1 duration-200 relative group overflow-hidden border-2 font-bold',
                betAmount === amount
                  ? 'bg-[#0D329F] text-white'
                  : 'bg-[#1193E1] border border-[#4467CC80] text-white hover:bg-[#0D329F]/80'
              )}
              key={amount}
              onClick={() => setBetAmount(amount)}
              style={{
                boxShadow: "4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset"
              }}
            >
              <div className="flex items-center">
                <span className="text-base">{INR(amount, true)}</span>
              </div>
              <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%]",
                betAmount === amount && "animate-shimmer"
              )} />
            </Button>
          ))}
        </div>
      </div>
      <DiceGameResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
    </>
  );
};