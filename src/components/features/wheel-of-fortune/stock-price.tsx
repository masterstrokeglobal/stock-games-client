import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { RoundRecord } from '@/models/round-record';
import { WheelColor } from '@/models/wheel-of-fortune-placement';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';
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

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningColor: WheelColor | null }> = ({ roundRecord, winningColor }) => {

  const { stocks } = useLeaderboard(roundRecord);

  const sortedStocks = stocks.sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent));

  return (
    <div className="flex flex-col justify-between items-start bg-gray-200">
      <div className="grid grid-cols-6 w-full">
        {sortedStocks.slice(0, 6).map((stock, index) => (
          <StockPrice key={index} rankedMarketItem={stock} />
        ))}
      </div>
      <div className="grid grid-cols-6 w-full">
        {sortedStocks.slice(6).map((stock, index) => (
          <StockPrice key={index} rankedMarketItem={stock} />
        ))}
      </div>
    </div>
  );
}; 