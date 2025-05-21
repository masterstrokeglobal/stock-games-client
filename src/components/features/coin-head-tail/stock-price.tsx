import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { RoundRecord } from '@/models/round-record';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';
import CoinFlip from './coin-toss';

interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
}

const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem }) => {
  return (
    <div className="bg-black flex text-xs flex-row  justify-between px-4 items-center gap-2 p-2">
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

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord }> = ({ roundRecord }) => {
  const { stocks } = useLeaderboard(roundRecord);

  // Get the first stock with the highest change percent
  const topStock = stocks.sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent))[0];
  
  return (
    <div className="flex flex-col justify-center items-start bg-gray-200">
      <div className="w-full">
        {topStock && <StockPrice rankedMarketItem={topStock} />}
      </div>
      <div className='h-screen bg-white'>
        <CoinFlip isFlipping={false} setResult={() => {}} />
      </div>
    </div>
  );
};