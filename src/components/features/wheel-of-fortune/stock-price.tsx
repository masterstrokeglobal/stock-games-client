import { usePlacementOver } from '@/hooks/use-current-game';
import { RoundRecord } from '@/models/round-record';
import React from 'react';
import StockWheel from './stock-wheel';


export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, winningMarketId: number[] | null }> = ({ roundRecord, winningMarketId }) => {

  const isPlaceOver = usePlacementOver(roundRecord);
  const isSpinning = winningMarketId == null && isPlaceOver;

  return (
    <div className="flex flex-col justify-between items-start bg-gray-200">
     <StockWheel roundRecord={roundRecord} winningMarketId={winningMarketId} isSpinning={isSpinning} />
    </div>
  );
}; 