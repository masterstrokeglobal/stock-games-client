import React from 'react';
import { useGameStore } from "@/store/game-store";
import { useGameState, useIsPlaceOver } from '@/hooks/use-current-game';
import MarketItem from '@/models/market-item';
import { useStockBettingStore } from '@/store/betting-store';
import TimeLeft from '../lobby/time-left';
import { GameHeader } from './roulette-header';

const StockSelectionGrid = () => {
  const { lobbyRound } = useGameStore();
  const { selectedStock, setSelectedStock } = useStockBettingStore();
  const isPlaceOver = useIsPlaceOver(lobbyRound?.roundRecord ?? null);
  if (!lobbyRound || !lobbyRound.roundRecord) return null;
  const gameState = useGameState(lobbyRound?.roundRecord);

  const marketItems = lobbyRound.roundRecord.market || [];

  const handleSelectStock = (stock: MarketItem) => {
    if (isPlaceOver) return;
    setSelectedStock(stock);
  };

  // Create rows of 4 items each

  return (
    <div className="w-full mb-6">
      <GameHeader gameState={gameState} className='lg:flex items-center px-4 justify-between lg:flex-row' />
      <div className="grid grid-cols-4 grid-rows-4 gap-4 h-full px-4">
        {marketItems.map((stock) => (
          <div
            key={stock.id}
            onClick={() => handleSelectStock(stock)}
            className={`
                  flex flex-row items-center justify-between w-full h-14  bg-[#1A2D58] p-3 rounded-lg cursor-pointer transition-all
                  ${selectedStock?.id === stock.id ? 'ring-2 ring-yellow-500 shadow-yellow-500/30' : 'hover:bg-[#243a6d]'}
                  ${isPlaceOver ? 'opacity-70 cursor-not-allowed' : ''}
                  aspect-square
                `}
          >
            <span className="text-md font-bold text-white  ">{stock.name}</span>
            <span className="text-xs text-gray-300 truncate  ">{stock.codeName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockSelectionGrid;