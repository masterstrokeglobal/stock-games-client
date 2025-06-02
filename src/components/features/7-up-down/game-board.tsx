import { useIsPlaceOver } from '@/hooks/use-current-game';
import { RankedMarketItem, useLeaderboard } from '@/hooks/use-leadboard';
import { INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { SevenUpDownPlacementType } from '@/models/seven-up-down';
import { useCreateSevenUpDownPlacement, useGetMyCurrentRoundSevenUpDownPlacement } from '@/react-query/7-up-down';
import React, { PropsWithChildren } from 'react';

const MarketItemDisplay: React.FC<{ items: RankedMarketItem[], isPositive: boolean }> = ({ items, isPositive }) => {
  // Calculate non-overlapping positions using grid-based approach
  const calculateSafePosition = (existingPositions: Array<{x: number, y: number}>) => {
    const gridSize = 10; // Size of each grid cell
    const padding = 15; // Minimum padding between items
    const grid: boolean[][] = Array(100/gridSize).fill(false).map(() => Array(100/gridSize).fill(false));
    
    // Mark existing positions in grid
    existingPositions.forEach(pos => {
      const gridX = Math.floor(pos.x / gridSize);
      const gridY = Math.floor(pos.y / gridSize);
      if (gridX >= 0 && gridX < grid.length && gridY >= 0 && gridY < grid[0].length) {
        grid[gridX][gridY] = true;
        // Mark surrounding cells as occupied too
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = gridX + dx;
            const ny = gridY + dy;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
              grid[nx][ny] = true;
            }
          }
        }
      }
    });
    
    // Find empty cells
    const emptyCells: Array<{x: number, y: number}> = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        if (!grid[i][j]) {
          emptyCells.push({
            x: (i * gridSize) + (Math.random() * gridSize),
            y: (j * gridSize) + (Math.random() * gridSize)
          });
        }
      }
    }
    
    // If no empty cells found, create emergency position
    if (emptyCells.length === 0) {
      return {
        x: Math.random() * 100,
        y: Math.random() * 100
      };
    }
    
    // Return random empty cell position
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Ensure position is within bounds and add small random offset
    return {
      x: Math.max(padding, Math.min(100 - padding, randomCell.x)),
      y: Math.max(padding, Math.min(100 - padding, randomCell.y))
    };
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => {
        const positions = items.slice(0, index).map((_, i) => {
          const el = document.querySelector(`[data-item-index="${i}"]`);
          return {
            x: el ? parseFloat(el.getAttribute('data-x') || '0') : 0,
            y: el ? parseFloat(el.getAttribute('data-y') || '0') : 0
          };
        });
        
        const {x, y} = calculateSafePosition(positions);

        return (
          <div
            key={index}
            data-item-index={index}
            data-x={x}
            data-y={y}
            className={`px-2 text-[10px] py-1 rounded-full text-white absolute`}
            style={{
              backgroundColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
              animationDelay: `${index * 0.3}s`,
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.5s linear',
              animation: `float 4s linear infinite, move ${4 + index}s linear infinite`
            }}
          >
            <div className="font-medium">{item.codeName}</div>
          </div>
        );
      })}
    </div>
  );
};

export const GameBoard: React.FC<PropsWithChildren<{ roundRecord: RoundRecord, amount: number }>> = ({ roundRecord, children, amount }) => {
  const { mutate } = useCreateSevenUpDownPlacement();
  const isPlaceOver = useIsPlaceOver(roundRecord);
  const { data: currentRoundPlacements } = useGetMyCurrentRoundSevenUpDownPlacement(roundRecord.id);

  const {stocks:marketItems} = useLeaderboard(roundRecord);

  const positiveItems = marketItems.filter(item => parseFloat(item.change_percent) > 0);
  const negativeItems = marketItems.filter(item => parseFloat(item.change_percent) <= 0 || item.change_percent == undefined);

  const upBets = currentRoundPlacements?.filter(p => p.placement === SevenUpDownPlacementType.UP) || [];
  const downBets = currentRoundPlacements?.filter(p => p.placement === SevenUpDownPlacementType.DOWN) || [];
  const sevenBets = currentRoundPlacements?.filter(p => p.placement === SevenUpDownPlacementType.SEVEN) || [];

  const handleBoardClick = (type: SevenUpDownPlacementType) => {
    if (isPlaceOver) return;
    mutate({
      roundId: roundRecord.id,
      placement: type,
      amount: amount,
    });
  }

  
  return (
    <div style={{ backgroundImage: 'url(/images/7-up.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="relative md:px-12 px-4 pt-20 pb-4 bg-brown-900">
      {children}
      <div className="relative h-64 w-full">
        {/* 8-12 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.UP)} className="absolute inset-x-0 top-0 h-32 hover:scale-[1.02] cursor-pointer transition-all duration-300 bg-yellow-500 bg-opacity-20 rounded-t-3xl border-yellow-500 border-2 flex flex-col items-center justify-start pt-4">
          <div className="text-2xl font-bold text-yellow-400">8~14</div>
          <div className="text-sm text-yellow-400">1:2</div>
          
          {!isPlaceOver ? (
            upBets.map((bet, i) => (
              <div 
                key={i}
                className="absolute p-1 aspect-square rounded-full bg-chip flex items-center justify-center text-xs font-bold"
                style={{
                  right: '10px',
                  top: `${10 + (i * 40)}px`
                }}
              >
                {bet.amount}
              </div>
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MarketItemDisplay items={positiveItems} isPositive={true} />
            </div>
          )}
        </div>

        {/* Center 7 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.SEVEN)} className="absolute cursor-pointer hover:bg-red-950 left-1/2 top-1/2 hover:scale-[1.02] transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-900 rounded-full border-2 border-yellow-500 flex flex-col items-center justify-center z-10">
          <div className="text-4xl font-bold text-yellow-400">7</div>
          <div className="text-sm text-yellow-400">1:4</div>
          {!isPlaceOver && sevenBets.length > 0 && <div className="text-xs text-white aspect-square rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-chip w-fit">{INR(sevenBets.reduce((acc, bet) => acc + bet.amount, 0))}</div>}
        </div>

        {/* 2-6 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.DOWN)} className="absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-300 h-32 bg-yellow-500 bg-opacity-20 rounded-b-3xl border-2 border-yellow-500 flex flex-col items-center justify-end py-4">
          <div className="text-2xl font-bold text-yellow-400">0~6</div>
          <div className="text-sm text-yellow-400">1:2</div>

          {!isPlaceOver ? (
            downBets.map((bet, i) => (
              <div 
                key={i}
                className="absolute px-2 h-auto aspect-square rounded-full bg-chip flex items-center justify-center text-xs font-bold"
                style={{
                  right: '10px',
                  bottom: `${10 + (i * 40)}px`
                }}
              >
                {bet.amount}
              </div>
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MarketItemDisplay items={negativeItems} isPositive={false} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
