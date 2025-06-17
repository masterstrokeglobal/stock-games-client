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
        <div className="w-full p-6 bg-[url('/images/dice-game/dice-bg-2.png')]" >
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold text-[#e6b85c] mb-2">Your Bets</h3>
            {Object.values(aggregatedPlacements).map((aggregated, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#14311c]  p-4  border-2 border-[#e6b85c] shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-[#e6b85c]/90 to-[#e6b85c]/100 p-3 text-white border rounded-sm border-[#e6b85c]">
                    <div className="text-lg font-bold text-white">
                      {aggregated.number}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-[#e6b85c] opacity-80">
                      Number {aggregated.number}
                    </span>
                    <span className="text-xs text-[#e6b85c]/70">
                      {aggregated.count} bet{aggregated.count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e6b85c] to-[#ffb84c] flex items-center justify-center border-2 border-[#e6b85c] shadow-[0_0_10px_#e6b85c80]">
                    <span className="text-lg font-bold text-[#7a1c18]">₹</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-[#e6b85c]">₹{aggregated.totalAmount}</span>
                    <span className="text-xs text-[#e6b85c]/70">Total</span>
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
      <div
        className="w-full p-6  bg-[url('/images/dice-game/dice-bg-2.png')] bg-cover bg-center ">
        <div className="flex justify-center relative mb-4">
          <div className="mr-2 absolute left-3 top-3 bottom-2 flex items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#e6b85c] shadow-[0_0_10px_#e6b85c80]"
              style={{
                background: "linear-gradient(135deg, #e6b85c 60%, #ffb84c 100%)"
              }}
            >
              <span className="text-lg text-[#7a1c18] font-bold">₹</span>
            </div>
          </div>
          <Input
            type="number"
            min={userDetails?.company?.minPlacement}
            max={userDetails?.company?.maxPlacement}
            placeholder="Enter bet amount"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            className={cn(
              "p-2 rounded-none pl-14 h-14 border-2 text-[#e6b85c] text-xl bg-[#14311c] focus:border-[#e6b85c] focus:ring-2 focus:ring-[#e6b85c]/30 transition-all",
              "border-[#e6b85c] placeholder-[#e6b85c]/60"
            )}
            style={{
              boxShadow: "0 0 0 4px #7a1c18"
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full">
          {coinValues?.map((amount) => (
            <Button
              className={cn(
                'rounded-full transition-all flex-1 duration-200 relative group overflow-hidden border-2 border-[#e6b85c] font-bold',
                betAmount === amount
                  ? 'bg-gradient-to-br from-[#e6b85c] to-[#ffb84c] text-[#7a1c18] shadow-[0_0_10px_#e6b85c80]'
                  : 'bg-[#14311c] text-[#e6b85c] hover:bg-[#1e4d2b]'
              )}
              key={amount}
              onClick={() => setBetAmount(amount)}
              style={{
                minWidth: 64,
                minHeight: 40,
                boxShadow: betAmount === amount ? "0 0 0 4px #7a1c18" : undefined
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