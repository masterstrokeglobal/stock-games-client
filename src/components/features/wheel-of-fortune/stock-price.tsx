import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { RoundRecord } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';
import StockWheel from './stock-wheel';
import { usePlacementOver } from '@/hooks/use-current-game';
interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
}

const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem }) => {
  return (
    <div className="bg-black flex text-xs flex-row items-center gap-2 p-2">
      <div className="flex flex-col gap-2">
        <span>{rankedMarketItem.name}</span>
        <span>Price: {rankedMarketItem.price}</span>
      </div>
      <div className="flex flex-col gap-2">
        <ArrowUpIcon className={`w-4 h-4 ${parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
      </div>
    </div>
  );
};

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningMarketId: number[] | null }> = ({ roundRecord, winningMarketId }) => {

  const isPlaceOver = usePlacementOver(roundRecord);
  const isSpinning = winningMarketId == null && isPlaceOver;

  console.log(winningMarketId, isSpinning)
  return (
    <div className="flex flex-col justify-between items-start bg-gray-200">
     <StockWheel roundRecord={roundRecord} winningMarketId={winningMarketId} isSpinning={isSpinning} />
    </div>
  );
}; 