"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from '@/context/auth-context';
import { useIsPlaceOver, useShowResults } from '@/hooks/use-current-game';
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
  const isPlaceOver = useIsPlaceOver(roundRecord);
  const coinValues = userDetails?.company?.coinValues;

  const showResult = useShowResults(roundRecord, placements ?? []);

  if (isPlaceOver && placements?.length) {
    // Aggregate placements by number
    const aggregatedPlacements = placements.reduce((acc, placement) => {
      const number = placement.number;
      if (!acc[number]) {
        acc[number] = {
          number,
          totalAmount: 0,
          count: 0
        };
      }
      acc[number].totalAmount += placement.amount;
      acc[number].count += 1;
      return acc;
    }, {} as Record<number, { number: number; totalAmount: number; count: number }>);

    return (
      <>
        <div className="w-full bg-[#1a1b2e] text-white p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-amber-400 mb-2">Your Bets</h3>
            {Object.values(aggregatedPlacements).map((aggregated, index) => (
              <div key={index} className="flex items-center justify-between bg-[#2a2b3e] p-4 rounded-xl border-2 border-amber-500/30 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-amber-500/30 to-red-500/30 p-3 rounded-lg">
                    <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-400">
                      {aggregated.number}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-amber-200 opacity-70">
                      Number {aggregated.number}
                    </span>
                    <span className="text-xs text-amber-300/50">
                      {aggregated.count} bet{aggregated.count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-amber-300">₹{aggregated.totalAmount}</span>
                    <span className="text-xs text-amber-300/50">Total</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DiceGameResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
      </>
    );
  }
  return (
    <>
      <div className="w-full bg-[#1a1b2e] text-white p-6">
        <div className="flex justify-center relative mb-4">
          <div className="mr-2 absolute left-3 top-3 bottom-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <span className="text-lg">₹</span>
            </div>
          </div>
          <Input
            type="number"
            min={userDetails?.company?.minPlacement}
            max={userDetails?.company?.maxPlacement}
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className="p-2 rounded-2xl pl-14 h-14 border-2 border-amber-500/50 text-white text-xl bg-[#2a2b3e] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          {coinValues?.map((amount) => (
            <Button
              className={cn(
                'rounded-full  transition-all duration-200 relative group overflow-hidden',
                betAmount === amount ? 'bg-gradient-to-br from-amber-400 to-red-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-[#2a2b3e] hover:bg-[#3a3b4e]'
              )}
              key={amount}
              onClick={() => setBetAmount(amount)}
            >
              <div className="flex items-center">
                <span className="text-sm">{INR(amount)}</span>
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