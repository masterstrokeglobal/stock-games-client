import { RankedMarketItem } from '@/hooks/use-sevenup-leader-board';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';
interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
}

export const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem }) => {
  return (
    <div className="bg-black flex  text-xs items-center gap-2 p-2 relative border-r border-gray-700 ">
      <div className="flex items-start flex-col gap-2 flex-1">
        <span className='line-clamp-2'>{rankedMarketItem.name}</span>
        <span className={cn('font-semibold', parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500')}>{rankedMarketItem.price}</span>
      </div>
      <div className="flex flex-col gap-2 absolute right-2 bottom-2">
        <ArrowUpIcon className={`w-4 h-4 ${parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
      </div>
    </div>
  );
};

export const StockPriceDisplay: React.FC<{ stocks: RankedMarketItem[], roundRecordWithWinningId: RoundRecord | null }> = ({ stocks, roundRecordWithWinningId }) => {

  const sortedStocks = stocks.sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent));

  const sortedStocksWithWinningId = roundRecordWithWinningId?.sortedMarketItems || null;

  const stocksToDisplay = sortedStocksWithWinningId || sortedStocks;
  return (
    <div className="flex flex-col justify-between items-start bg-gray-200">
      <div className="grid grid-cols-7 w-full">

        {stocksToDisplay.slice(0, 7).map((stock, index) => (
          <StockPrice key={index} rankedMarketItem={stock} />
        ))}
      </div>
      <div className="grid grid-cols-7 w-full">
        {stocksToDisplay.slice(7).map((stock, index) => (
          <StockPrice key={index} rankedMarketItem={stock} />
        ))}
      </div>
    </div>
  );
}; 