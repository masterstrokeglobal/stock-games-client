import { RankedMarketItem } from '@/hooks/use-multi-socket-leaderboard';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import React from 'react';
import TriangleDownGlow from '../common/triangle-down-glow';
import TriangleUpGlow from '../common/triangle-up-glow';
interface StockPriceProps {
  rankedMarketItem: RankedMarketItem;
  className?: string;
}

export const StockPrice: React.FC<StockPriceProps> = ({ rankedMarketItem, className }) => {
  return (
    <div className={cn("bg-transparent mx-auto space-y-1 p-1 h-12 w-10 relative", className)}>
      <div className="flex items-start flex-col gap-1 flex-1">
        <span className="line-clamp-1 text-left text-xs truncate block w-20  sm:text-sm">{rankedMarketItem.name}</span>
      </div>
      <div className="flex items-center gap-x-1 truncate">
        <span className={cn('font-semibold text-xs sm:text-sm', parseFloat(rankedMarketItem.change_percent) > 0 ? 'text-green-500' : 'text-red-500')}>{rankedMarketItem.price??"--"}</span>
        {parseFloat(rankedMarketItem.change_percent) > 0 ? <TriangleUpGlow className="size-4" /> : <TriangleDownGlow className="size-4" />}
      </div>
    </div>
  );
};

export const StockPriceDisplay: React.FC<{ stocks: RankedMarketItem[], roundRecordWithWinningId: RoundRecord | null }> = ({ stocks, roundRecordWithWinningId }) => {

  const sortedStocks = stocks.sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent));

  const sortedStocksWithWinningId = roundRecordWithWinningId?.sortedMarketItems || null;

  const stocksToDisplay = sortedStocksWithWinningId || sortedStocks;
  return (
    <div className="flex flex-col justify-between items-start bg-transparent">
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