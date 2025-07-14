"use client"
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/context/auth-context';
import { useShowResults } from '@/hooks/use-current-game';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { useGetMyCurrentRoundSevenUpDownPlacement } from '@/react-query/7-up-down';
import { Minus, Plus } from "lucide-react";
import React from 'react';
import SevenUpDownResultDialog from './game-result';

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
  const { data: placements } = useGetMyCurrentRoundSevenUpDownPlacement(roundRecord.id);
  const coinValues = userDetails?.company?.coinValues;

  const showResult = useShowResults(roundRecord, placements ?? []);

  // Handlers for + and - buttons
  const handleIncrement = () => {
    if (!userDetails?.company?.maxPlacement) return;
    const next = betAmount + 100;
    setBetAmount(
      next > userDetails.company.maxPlacement
        ? userDetails.company.maxPlacement
        : next
    );
  };

  const handleDecrement = () => {
    if (!userDetails?.company?.minPlacement) return;
    const next = betAmount - 100;
    setBetAmount(
      next < userDetails.company.minPlacement
        ? userDetails.company.minPlacement
        : next
    );
  };


  console.log(showResult.showResults, showResult.previousRoundId);
  return (
    <>
      <div className="w-full md:px-2 py-4 md:flex flex-col grid sm:grid-cols-3 grid-cols-1 relative z-10 items-center md:gap-4 gap-2">
        {/* Chips */}
        <div className="grid md:grid-cols-4 grid-cols-2 col-span-2  gap-2 w-full max-w-2xl mb-2">
          {coinValues?.map((amount) => (
            <Button
              key={amount}
              onClick={() => setBetAmount(amount)}
              className={cn(
                "rounded-2xl font-semibold text-white md:text-base text-sm font-montserrat py-2 px-0 transition-all duration-200 border-2",
                betAmount === amount
                  ? "bg-[#3072DA] border-[#285BB2] shadow-[0_0_10px_#3072DA80]"
                  : "bg-[#3072DABF] border-[#285BB2] hover:bg-[#3072DA]",
                "focus:outline-none"
              )}
              style={{
                minWidth: 100,
                background: betAmount === amount ? "#3072DA" : "#3072DABF",
                borderColor: "#285BB2"
              }}
            >
              ₹ {amount}
            </Button>
          ))}
        </div>

        {/* Input with + and - buttons inside */}
        <div className="flex md:flex-row flex-col items-center xl:gap-12 md:gap-8 gap-2 w-full max-w-2xl justify-between">
          {/* Input with + and - buttons inside */}
          <div
            className="flex items-center md:w-auto w-full px-4 md:py-2 py-0.5 flex-1 rounded-2xl border-2 relative"
            style={{
              background: "#295CB440",
              borderColor: "#285BB2"
            }}
          >
            <input
              type="number"
              min={userDetails?.company?.minPlacement}
              max={userDetails?.company?.maxPlacement}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="bg-transparent outline-none border-none text-white font-montserrat text-lg w-full text-center "
              style={{ appearance: "textfield" }}
            />
            
            {/* + Button inside input */}
            <button
              onClick={handleIncrement}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold border"
              style={{
                background: "#3174DE",
                borderColor: "#5667DD"
              }}
              type="button"
            >
              <Plus size={12} />
            </button>
            
            {/* - Button inside input */}
            <button
              onClick={handleDecrement}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold border"
              style={{
                background: "#3174DE",
                borderColor: "#5667DD"
              }}
              type="button"
            >
              <Minus size={12} />
            </button>
          </div>

          {/* Total Bet */}
          <div
            className="flex items-center justify-between md:px-6 px-2 md:py-2 py-0.5 flex-1 rounded-2xl border-2 w-full md:ml-auto"
            style={{
              background: "linear-gradient(90deg, #161B52 0%, #27367C 100%)",
              borderColor: "#5667DD"
            }}
          >
            <span className="text-[#B6C6FF] md:text-base text-sm font-semibold whitespace-nowrap mr-2 tracking-wider">TOTAL BET</span>
            <span className="text-white text-lg font-bold">{betAmount}</span>
          </div>
        </div>
      </div>
      <SevenUpDownResultDialog key={String(showResult.showResults)} open={showResult.showResults} roundRecordId={showResult.previousRoundId ?? 0} />
    </>
  );
};
