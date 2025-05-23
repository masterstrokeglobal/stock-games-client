import { usePlacementOver } from '@/hooks/use-current-game';
import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { HeadTailPlacementType } from '@/models/head-tail';
import { RoundRecord } from '@/models/round-record';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';
import CoinFlip from './coin-toss';
import { cn } from '@/lib/utils';

interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
}

const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem }) => {
  return (
    <div className="bg-black flex text-xs flex-row  justify-between px-4 items-center gap-2 p-2">
      <div className="flex flex-col gap-2">
        <span>{rankedMarketItem.name}</span>
        <span>Price: <b>
          {rankedMarketItem.initialPrice}
          </b></span>
      </div>
      <div className="flex flex-col gap-2">
        <span className='t'>Current Price:<b>
          {rankedMarketItem.price}
          </b> 
          </span>
        <div className={cn("flex gap-2",parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500')} >
          <ArrowUpIcon className={cn(parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500 rotate-180')} />
          <span> {rankedMarketItem.change_percent} %</span>
        </div>
      </div>
    </div>
  );
};

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningSide: HeadTailPlacementType | null }> = ({ roundRecord, winningSide }) => {
  const { stocks } = useLeaderboard(roundRecord);

  const isPlaceOver = usePlacementOver(roundRecord);
  const isFlipping = winningSide == null && isPlaceOver;


  return (
    <div className="flex flex-col justify-center items-start bg-gray-200">
      <div className="w-full">
        <StockPrice rankedMarketItem={stocks[0]} />
      </div>
      <div className='h-32 w-full bg-white'>
        <CoinFlip isFlipping={isFlipping} resultOutcome={winningSide ?? undefined} />
      </div>
    </div>
  );
};