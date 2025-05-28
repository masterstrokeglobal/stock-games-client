import { usePlacementOver } from '@/hooks/use-current-game';
import { RoundRecord } from '@/models/round-record';
import React from 'react';
import StockWheel from './stock-wheel';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningMarketId: number[] | null }> = ({ roundRecord, winningMarketId }) => {

  const isPlaceOver = usePlacementOver(roundRecord);

  // Additional safety checks to prevent spinning during betting time
  const currentTime = new Date().getTime();
  const placementEndTime = new Date(roundRecord.placementEndTime).getTime();
  const gameEndTime = new Date(roundRecord.endTime).getTime();

  // Only allow spinning if:
  // 1. Current time is past placement end time (betting is closed)
  // 2. Current time is before game end time (game is still active)  
  // 3. There's no winning market ID yet
  // 4. The isPlaceOver hook also confirms betting is over
  const isBettingClosed = currentTime >= placementEndTime;
  const isGameStillActive = currentTime < gameEndTime;
  const hasNoWinner = winningMarketId == null;

  const isSpinning = isBettingClosed && isGameStillActive && hasNoWinner && isPlaceOver;

  return (
    <div className="flex flex-col justify-between items-start bg-gray-200 relative">
      {isSpinning && (
        <DotLottieReact
          className="absolute z-15 scale-[200%] top-0 left-0 w-full h-full z-10 pointer-events-none"
          src="/animation/sparkle-lottie.json"
          autoplay
          loop
        />
      )}
      <div className=''>
        <StockWheel roundRecord={roundRecord} winningMarketId={winningMarketId} isSpinning={isSpinning} />
      </div>
    </div>
  );
}; 