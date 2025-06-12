import { useIsPlaceOver } from '@/hooks/use-current-game';
import { RankedMarketItem } from '@/hooks/use-leadboard';
import { INR } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { SevenUpDownPlacementType } from '@/models/seven-up-down';
import { useCreateSevenUpDownPlacement, useGetMyCurrentRoundSevenUpDownPlacement } from '@/react-query/7-up-down';
import React, { PropsWithChildren } from 'react';

const MarketItemDisplay: React.FC<{ items: RankedMarketItem[], isPositive: boolean }> = ({ items, isPositive }) => {
  // Calculate non-overlapping positions with more dynamic movement
  const calculatePositions = (itemCount: number) => {
    if (itemCount === 0) return [];
    
    // Define container dimensions (in percentage)
    const containerWidth = 100;
    const containerHeight = 100;
    
    // Center circle exclusion zone
    const centerX = 50; // center of container
    const centerY = 50; // center of container
    const exclusionRadius = 15; // percentage radius to avoid center circle
    
    // Function to check if a position is too close to center
    const isTooCloseToCenter = (x: number, y: number) => {
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      return distance < exclusionRadius;
    };
    
    // Function to adjust position if too close to center
    const adjustPositionAwayFromCenter = (x: number, y: number) => {
      if (!isTooCloseToCenter(x, y)) return { x, y };
      
      // Calculate angle from center to point
      const angle = Math.atan2(y - centerY, x - centerX);
      
      // Push point to edge of exclusion zone
      const newX = centerX + Math.cos(angle) * exclusionRadius;
      const newY = centerY + Math.sin(angle) * exclusionRadius;
      
      return { x: newX, y: newY };
    };
    
    // Increased spacing for more movement
    const minSpacing = 18; // increased from 12
    const itemSize = 6; // reduced item size to allow more space
    
    // Calculate how many columns and rows we can fit
    const maxColumns = Math.floor(containerWidth / (itemSize + minSpacing));
    // const maxRows = Math.floor(containerHeight / (itemSize + minSpacing));
    
    // Use fewer columns to spread items more
    const effectiveColumns = Math.min(maxColumns, Math.max(2, Math.ceil(Math.sqrt(itemCount * 0.8))));
    const effectiveRows = Math.ceil(itemCount / effectiveColumns);
    
    // Calculate actual spacing with more room
    const columnSpacing = (containerWidth - (effectiveColumns * itemSize)) / (effectiveColumns + 1);
    const rowSpacing = (containerHeight - (effectiveRows * itemSize)) / (effectiveRows + 1);
    
    const positions: Array<{x: number, y: number, animationDelay: number, duration: number}> = [];
    
    for (let i = 0; i < itemCount; i++) {
      const row = Math.floor(i / effectiveColumns);
      const col = i % effectiveColumns;
      
      // Much larger random offsets for more dynamic positioning
      const randomOffsetX = (Math.random() - 0.5) * Math.min(columnSpacing * 0.8, 12);
      const randomOffsetY = (Math.random() - 0.5) * Math.min(rowSpacing * 0.8, 12);
      
      const baseX = columnSpacing + (col * (itemSize + columnSpacing)) + (itemSize / 2);
      const baseY = rowSpacing + (row * (itemSize + rowSpacing)) + (itemSize / 2);
      
      // Add extra randomness for even more spread
      const extraRandomX = (Math.random() - 0.5) * 8;
      const extraRandomY = (Math.random() - 0.5) * 8;
      
      let x = baseX + randomOffsetX + extraRandomX;
      let y = baseY + randomOffsetY + extraRandomY;
      
      // Adjust position if too close to center circle
      const adjustedPosition = adjustPositionAwayFromCenter(x, y);
      x = adjustedPosition.x;
      y = adjustedPosition.y;
      
      // Ensure positions stay within bounds with more margin
      positions.push({
        x: Math.max(8, Math.min(92, x)),
        y: Math.max(8, Math.min(92, y)),
        animationDelay: Math.random() * 2, // Random delay up to 2 seconds
        duration: 3 + Math.random() * 4 // Random duration between 3-7 seconds
      });
    }
    
    return positions;
  };

  const positions = calculatePositions(items.length);

  return (
    <div className="absolute inset-0">
      {items.map((item, index) => {
        const position = positions[index];
        if (!position) return null;

        return (
          <div
            key={`${item.codeName}-${index}`}
            className={`px-2 text-[10px] py-1 rounded-full text-white absolute`}
            style={{
              backgroundColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
              animationDelay: `${position.animationDelay}s`,
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.8s ease-in-out',
              animation: `float ${position.duration}s ease-in-out infinite, drift ${position.duration + 2}s linear infinite`,
              zIndex: 20
            }}
          >
            <div className="font-medium whitespace-nowrap">{item.codeName}</div>
          </div>
        );
      })}
      
      {/* Add CSS animations for more dynamic movement */}
      <style jsx>{`
        @keyframes drift {
          0% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
          25% { transform: translate(-50%, -50%) translateX(${Math.random() * 20 - 10}px) translateY(${Math.random() * 20 - 10}px); }
          50% { transform: translate(-50%, -50%) translateX(${Math.random() * 30 - 15}px) translateY(${Math.random() * 30 - 15}px); }
          75% { transform: translate(-50%, -50%) translateX(${Math.random() * 20 - 10}px) translateY(${Math.random() * 20 - 10}px); }
          100% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export const GameBoard: React.FC<PropsWithChildren<{ roundRecord: RoundRecord, amount: number, marketItems: RankedMarketItem[] }>> = ({ roundRecord, children, amount, marketItems }) => {
  const { mutate } = useCreateSevenUpDownPlacement();
  const isPlaceOver = useIsPlaceOver(roundRecord);
  const { data: currentRoundPlacements } = useGetMyCurrentRoundSevenUpDownPlacement(roundRecord.id);


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
      <div className="relative z-0 h-[20rem] w-full">
        {/* 8-12 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.UP)} className="absolute inset-x-0 top-0 h-[10rem] hover:scale-[1.02] cursor-pointer transition-all duration-300 bg-yellow-500 bg-opacity-20 rounded-t-3xl border-yellow-500 border-2 flex flex-col items-center justify-start pt-4">
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
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.DOWN)} className="absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-300 h-[10rem] bg-yellow-500 bg-opacity-20 rounded-b-3xl border-2 border-yellow-500 flex flex-col items-center justify-end py-4">
          <div className="text-2xl font-bold text-yellow-400">0~6</div>
          <div className="text-sm text-yellow-400">1:2</div>

          {!isPlaceOver ? (
            downBets.map((bet, i) => (
              <div 
                key={i}
                className="absolute z-100 px-2 h-auto aspect-square rounded-full bg-chip flex items-center justify-center text-xs font-bold"
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
