import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { RoundRecord } from '@/models/round-record';
import { ArrowUpIcon } from "@radix-ui/react-icons";
import React from 'react';
import CryptoStockChart from './animated-chart';
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

export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord }> = ({ roundRecord }) => {

  const { stocks } = useLeaderboard(roundRecord);

  const sortedStocks = stocks.sort((a, b) => parseFloat(b.change_percent) - parseFloat(a.change_percent));

  const totalPositiveStocks = sortedStocks.filter(stock => parseFloat(stock.change_percent) > 0).length;
  return (
    <div className="flex flex-col justify-between items-start bg-gray-200">
      <div className="grid grid-cols-7 w-full">
        {sortedStocks.slice(0, 7).map((stock, index) => (
          <StockPrice key={index} rankedMarketItem={stock} />
        ))}
      </div>
      <CryptoStockChart latestValue={totalPositiveStocks} show={true} id={roundRecord.id.toString()} />
      <div className="grid grid-cols-7 w-full">
        {sortedStocks.slice(7).map((stock, index) => (
          <StockPrice key={index} rankedMarketItem={stock} />
        ))}
      </div>
    </div>
  );
}; 