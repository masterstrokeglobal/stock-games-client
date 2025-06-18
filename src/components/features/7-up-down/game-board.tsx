import { usePlacementOver } from '@/hooks/use-current-game';
import { RankedMarketItem } from '@/hooks/use-leadboard';
import { RoundRecord } from '@/models/round-record';
import { SevenUpDownPlacementType } from '@/models/seven-up-down';
import { useCreateSevenUpDownPlacement, useGetMyCurrentRoundSevenUpDownPlacement } from '@/react-query/7-up-down';
import React, { PropsWithChildren, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { StockPrice } from './StockPriceDisplay';
import { cn } from '@/lib/utils';

interface ItemPosition {
  x: number;
  y: number;
  moveDistance: number;
  isPositive: boolean;
  changedSection?: boolean;
}

function generateGridPositions(count: number, xStart: number, xEnd: number, yStart: number, yEnd: number, avoidCenterY = false) {
  const positions: { x: number, y: number }[] = [];
  const gridCols = Math.ceil(Math.sqrt(count));
  const gridRows = Math.ceil(count / gridCols);
  let i = 0;
  let attempts = 0;
  
  while (positions.length < count && attempts < count * 10) {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    let x = xStart + ((xEnd - xStart) * (col + 0.5) / gridCols);
    let y = yStart + ((yEnd - yStart) * (row + 0.5) / gridRows);
    
    // Add random offset for more natural placement
    x += (Math.random() - 0.5) * 8;
    y += (Math.random() - 0.5) * 8;
    
    // Clamp to prevent overflow
    x = Math.max(5, Math.min(95, x));
    y = Math.max(5, Math.min(95, y));
    
    // Avoid center Y area (40-60%)
    if (avoidCenterY && y > 40 && y < 60) y = y < 50 ? 40 : 60;
    
    // Avoid center X (40-60%) and X < 20%
    if ((x > 40 && x < 60) || x < 20) {
      i++;
      attempts++;
      continue;
    }
    
    positions.push({ x, y });
    i++;
    attempts++;
  }
  
  // If not enough positions, fill with fallback
  while (positions.length < count) {
    positions.push({ x: xStart + 5, y: yStart + 5 });
  }
  
  return positions;
}

const MarketItemDisplay: React.FC<{ 
  items: RankedMarketItem[], 
  showResults: boolean,
  isTransitioning: boolean 
}> = ({ items, showResults }) => {
  const positionsRef = useRef<Map<string, ItemPosition>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const floatPatternsRef = useRef<Map<string, number>>(new Map());
  const animationFrameRef = useRef<number>();

  // Memoize items to prevent unnecessary recalculations
  const memoizedItems = useMemo(() => items, [items]);

  // Initialize float patterns once
  const initializeFloatPatterns = useCallback(() => {
    memoizedItems.forEach(item => {
      if (!item.codeName) return;
      if (!floatPatternsRef.current.has(item.codeName)) {
        floatPatternsRef.current.set(item.codeName, Math.floor(Math.random() * 4));
      }
    });
  }, [memoizedItems]);

  useEffect(() => {
    initializeFloatPatterns();
  }, [initializeFloatPatterns]);

  // Optimized position calculation
  const calculatePositions = useCallback(() => {
    if (!memoizedItems.length) return;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Use requestAnimationFrame for smooth updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const previousPositions = new Map(positionsRef.current);
      
      // Separate items based on their change_percent
      const positiveItems = memoizedItems.filter(item => parseFloat(item.change_percent || '0') > 0);
      const negativeItems = memoizedItems.filter(item => parseFloat(item.change_percent || '0') <= 0);

      // Generate grid positions for each group
      const posPositions = generateGridPositions(positiveItems.length, 20, 90, 5, 35, true);
      const negPositions = generateGridPositions(negativeItems.length, 20, 90, 65, 90, true);

      // Assign positions
      const newPositions = new Map<string, ItemPosition>();
      
      positiveItems.forEach((item, i) => {
        if (!item.codeName) return;
        const priceChange = parseFloat(item.change_percent || '0');
        const prevPos = previousPositions.get(item.codeName);
        
        newPositions.set(item.codeName, {
          x: posPositions[i]?.x ?? 25,
          y: Math.min(posPositions[i]?.y ?? 10, 35),
          moveDistance: Math.min(Math.abs(priceChange) * 0.4, 4),
          isPositive: true,
          changedSection: prevPos ? prevPos.isPositive !== true : false
        });
      });

      negativeItems.forEach((item, i) => {
        if (!item.codeName) return;
        const priceChange = parseFloat(item.change_percent || '0');
        const prevPos = previousPositions.get(item.codeName);
        
        newPositions.set(item.codeName, {
          x: negPositions[i]?.x ?? 25,
          y: Math.max(negPositions[i]?.y ?? 70, 65),
          moveDistance: Math.min(Math.abs(priceChange) * 0.4, 4),
          isPositive: false,
          changedSection: prevPos ? prevPos.isPositive !== false : false
        });
      });

      positionsRef.current = newPositions;
    });
  }, [memoizedItems]);

  useEffect(() => {
    calculatePositions();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [calculatePositions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {memoizedItems.map((item) => {
        if (!item.codeName) return null;
        
        const priceChange = parseFloat(item.change_percent || '0');
        const isPositive = priceChange > 0;
        const position = positionsRef.current.get(item.codeName);
        if (!position) return null;
        
        const floatPattern = floatPatternsRef.current.get(item.codeName) || 0;
        
        // Simplified animation logic to prevent conflicts
        const getAnimationStyle = () => {
          if (showResults) {
            return `resultPulse 2s ease-in-out infinite, float${floatPattern} 2s ease-in-out infinite`;
          }
          
          if (position.changedSection) {
            return `sectionTransition 0.8s ease-out forwards, float${floatPattern} 3s ease-in-out infinite 0.8s`;
          }
          
          return `move${isPositive ? 'Up' : 'Down'} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite, float${floatPattern} 3s ease-in-out infinite`;
        };
        
        return (
          <div
            key={item.codeName}
            className={cn(
              "px-1.5 text-[9px] py-0.5 rounded-full text-white absolute will-change-transform transition-all duration-700 ease-out",
              showResults && "animate-pulse shadow-lg ring-2 ring-white/30"
            )}
            style={{
              backgroundColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%) scale(1)',
              animation: getAnimationStyle(),
              zIndex: 20,
              '--move-distance': `${position.moveDistance}px`,
              '--float-distance': showResults ? '3px' : '2px',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: '1000px',
              WebkitPerspective: '1000px',
              boxShadow: showResults ? '0 0 15px rgba(255, 255, 255, 0.3)' : 'none',
              // Force hardware acceleration
              WebkitTransform: 'translateZ(0)',
              transformStyle: 'preserve-3d',
            } as React.CSSProperties}
          >
            <div className="font-medium whitespace-nowrap">{item.codeName}</div>
          </div>
        );
      })}
      
      {/* Optimized CSS animations */}
      <style jsx>{`
        @keyframes moveUp {
          0%, 100% { 
            transform: translate(-50%, -50%) translateY(0) scale(1); 
          }
          50% { 
            transform: translate(-50%, -50%) translateY(calc(-1 * var(--move-distance))) scale(1.05); 
          }
        }
        
        @keyframes moveDown {
          0%, 100% { 
            transform: translate(-50%, -50%) translateY(0) scale(1); 
          }
          50% { 
            transform: translate(-50%, -50%) translateY(var(--move-distance)) scale(1.05); 
          }
        }
        
        @keyframes sectionTransition {
          0% { 
            transform: translate(-50%, -50%) scale(1) rotateY(0deg); 
            opacity: 1; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1) rotateY(180deg); 
            opacity: 0.7; 
          }
          100% { 
            transform: translate(-50%, -50%) scale(1) rotateY(360deg); 
            opacity: 1; 
          }
        }
        
        @keyframes resultPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1); 
            opacity: 0.9; 
          }
        }
        
        @keyframes float0 {
          0%, 100% { 
            transform: translate(-50%, -50%) translateX(0) translateY(0); 
          }
          25% { 
            transform: translate(-50%, -50%) translateX(var(--float-distance)) translateY(calc(-0.5 * var(--float-distance))); 
          }
          50% { 
            transform: translate(-50%, -50%) translateX(0) translateY(calc(-1 * var(--float-distance))); 
          }
          75% { 
            transform: translate(-50%, -50%) translateX(calc(-1 * var(--float-distance))) translateY(calc(-0.5 * var(--float-distance))); 
          }
        }
        
        @keyframes float1 {
          0%, 100% { 
            transform: translate(-50%, -50%) translateX(0) translateY(0); 
          }
          25% { 
            transform: translate(-50%, -50%) translateX(calc(-1 * var(--float-distance))) translateY(var(--float-distance)); 
          }
          50% { 
            transform: translate(-50%, -50%) translateX(0) translateY(calc(0.5 * var(--float-distance))); 
          }
          75% { 
            transform: translate(-50%, -50%) translateX(var(--float-distance)) translateY(var(--float-distance)); 
          }
        }
        
        @keyframes float2 {
          0%, 100% { 
            transform: translate(-50%, -50%) translateX(0) translateY(0); 
          }
          33% { 
            transform: translate(-50%, -50%) translateX(var(--float-distance)) translateY(0); 
          }
          66% { 
            transform: translate(-50%, -50%) translateX(calc(-1 * var(--float-distance))) translateY(0); 
          }
        }
        
        @keyframes float3 {
          0%, 100% { 
            transform: translate(-50%, -50%) translateX(0) translateY(0); 
          }
          33% { 
            transform: translate(-50%, -50%) translateX(0) translateY(var(--float-distance)); 
          }
          66% { 
            transform: translate(-50%, -50%) translateX(0) translateY(calc(-1 * var(--float-distance))); 
          }
        }
      `}</style>
    </div>
  );
};

export const GameBoard: React.FC<PropsWithChildren<{ 
  roundRecord: RoundRecord, 
  amount: number, 
  marketItems: RankedMarketItem[], 
  roundRecordWithWinningId: RoundRecord | null 
}>> = ({ roundRecord, children, amount, marketItems, roundRecordWithWinningId }) => {
  const { mutate } = useCreateSevenUpDownPlacement();
  const isPlaceOver = usePlacementOver(roundRecord);
  const { data: currentRoundPlacements } = useGetMyCurrentRoundSevenUpDownPlacement(roundRecord.id);
  const [displayItems, setDisplayItems] = useState(marketItems);

  // Immediate, synchronous updates to prevent delay
  useEffect(() => {
    const newItems = roundRecordWithWinningId?.sortedMarketItems || marketItems;
    
    // Use flushSync for immediate DOM updates if available
    if (typeof window !== 'undefined' && 'flushSync' in React) {
      (React as any).flushSync(() => {
        setDisplayItems(newItems);
      });
    } else {
      setDisplayItems(newItems);
    }
  }, [roundRecordWithWinningId, marketItems]);

  // Memoize calculations to prevent unnecessary re-renders
  const betCalculations = useMemo(() => {
    const upBets = currentRoundPlacements?.filter(p => p.placement === SevenUpDownPlacementType.UP) || [];
    const downBets = currentRoundPlacements?.filter(p => p.placement === SevenUpDownPlacementType.DOWN) || [];
    const sevenBets = currentRoundPlacements?.filter(p => p.placement === SevenUpDownPlacementType.SEVEN) || [];

    return {
      totalUpBets: upBets.reduce((acc, bet) => acc + bet.amount, 0),
      totalDownBets: downBets.reduce((acc, bet) => acc + bet.amount, 0),
      totalSevenBets: sevenBets.reduce((acc, bet) => acc + bet.amount, 0),
    };
  }, [currentRoundPlacements]);

  const { totalUpBets, totalDownBets, totalSevenBets } = betCalculations;

  const positiveStocks = useMemo(() => 
    displayItems.filter(item => parseFloat(item.change_percent || '0') > 0).length, 
    [displayItems]
  );

  const showWinner = roundRecordWithWinningId?.finalPricesPresent;

  const handleBoardClick = useCallback((type: SevenUpDownPlacementType) => {
    if (isPlaceOver) return;
    mutate({
      roundId: roundRecord.id,
      placement: type,
      amount: amount,
    });
  }, [isPlaceOver, mutate, roundRecord.id, amount]);

  // Memoize winning section calculation
  const winningSection = useMemo(() => {
    if (!showWinner) return null;
    if (positiveStocks === 7) return 'seven';
    if (positiveStocks > 7) return 'up';
    if (positiveStocks < 7) return 'down';
    return null;
  }, [showWinner, positiveStocks]);

  return (
    <div 
      style={{ 
        backgroundImage: 'url(/images/7-up.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }} 
      className="relative px-[7rem] pt-20 w-full pb-4 bg-brown-900 md:mx-auto"
    >
      {children}
      <div className="flex justify-between w-full">
        <div className="grid grid-rows-7 w-[5rem] absolute left-0 h-full top-0">
          {displayItems.slice(0, 7).map((stock, index) => (
            <StockPrice key={`left-${stock.codeName || index}`} rankedMarketItem={stock} />
          ))}
        </div>
        
        <div className="relative z-0 h-[20rem] w-full">
          {/* Market items display */}
          <div className="absolute inset-0">
            {isPlaceOver && displayItems.length > 0 && (
              <MarketItemDisplay 
                items={displayItems} 
                showResults={showWinner || false}
                isTransitioning={false} // Removed transition state complexity
              />
            )}
          </div>

          {/* 8-14 Area */}
          <div 
            onClick={() => handleBoardClick(SevenUpDownPlacementType.UP)} 
            className={cn(
              "absolute inset-x-0 top-0 h-[10rem] hover:scale-[1.02] cursor-pointer transition-all duration-500 bg-yellow-500 bg-opacity-20 rounded-t-3xl border-yellow-500 border-2 flex flex-col items-center justify-start pt-4",
              winningSection === 'up' && "bg-yellow-600 bg-opacity-30 shadow-lg animate-pulse shadow-yellow-400/50 border-yellow-300"
            )}
          >
            <div className="text-2xl font-bold text-yellow-400">8~14</div>
            <div className="text-sm text-yellow-400">1:2</div>

            {!isPlaceOver && totalUpBets > 0 && (
              <div
                className="absolute p-2 aspect-square rounded-full bg-[url('/images/seven-up-down/coin.png')] bg-cover bg-center flex items-center justify-center text-xs font-bold text-gray-50 transition-all duration-300"
                style={{
                  right: '10px',
                  top: '10px'
                }}
              >
                {totalUpBets}
              </div>
            )}
          </div>

          {/* Center 7 Area */}
          <div 
            onClick={() => handleBoardClick(SevenUpDownPlacementType.SEVEN)} 
            className={cn(
              "absolute cursor-pointer hover:bg-red-950 left-1/2 top-1/2 hover:scale-[1.02] transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-900 rounded-full border-2 border-yellow-500 flex flex-col items-center justify-center z-10",
              winningSection === 'seven' && "bg-yellow-600 shadow-lg shadow-yellow-400/50 animate-pulse border-yellow-300 scale-110"
            )}
          >
            <div className="text-4xl font-bold text-yellow-400">7</div>
            <div className="text-sm text-yellow-400">1:2</div>
            {!isPlaceOver && totalSevenBets > 0 && (
              <div className="text-[10px] bg-[url('/images/seven-up-down/coin.png')] text-gray-50 flex items-center justify-center aspect-square p-1 rounded-full absolute top-1/2 right-0 -translate-y-1/2 bg-chip w-fit transition-all duration-300">
                {totalSevenBets}
              </div>
            )}
          </div>

          {/* 0-6 Area */}
          <div 
            onClick={() => handleBoardClick(SevenUpDownPlacementType.DOWN)} 
            className={cn(
              "absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-500 h-[10rem] bg-yellow-500 bg-opacity-20 rounded-b-3xl border-2 border-yellow-500 flex flex-col items-center justify-end py-4",
              winningSection === 'down' && "bg-yellow-600 bg-opacity-30 shadow-lg shadow-yellow-400/50 animate-pulse border-yellow-300"
            )}
          >
            <div className="text-2xl font-bold text-yellow-400">0~6</div>
            <div className="text-sm text-yellow-400">1:2</div>

            {!isPlaceOver && totalDownBets > 0 && (
              <div
                className="absolute z-100 px-2 h-auto aspect-square rounded-full bg-[url('/images/seven-up-down/coin.png')] bg-cover bg-center flex items-center justify-center text-xs font-bold text-gray-50 transition-all duration-300"
                style={{
                  right: '10px',
                  bottom: '10px'
                }}
              >
                {totalDownBets}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-rows-7 w-[5rem] absolute right-0 h-full  top-0">
          {displayItems.slice(7, 14).map((stock, index) => (
            <StockPrice key={`right-${stock.codeName || index}`} rankedMarketItem={stock} />
          ))}
        </div>
      </div>
    </div>
  );
};