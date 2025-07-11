import { usePlacementOver } from '@/hooks/use-current-game';
import { RankedMarketItem } from '@/hooks/use-leadboard';
import { cn, SEVEN_UP_DOWN_MULTIPLIER } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { SevenUpDownPlacementType } from '@/models/seven-up-down';
import { useCreateSevenUpDownPlacement } from '@/react-query/7-up-down';
import { motion } from 'framer-motion';
import React, { Fragment, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StockPrice } from './StockPriceDisplay';

// Custom Market Row for top/bottom display
const MarketRow: React.FC<{
  items: RankedMarketItem[];
}> = ({ items }) => (
  <div
    className={cn(
      "xsm:flex grid grid-cols-3 w-full justify-around items-center px-2",
      "xs:flex-row flex-col"
    )}
    style={{
      zIndex: 20,
      background: 'linear-gradient(91deg, #0E377B 1.49%, #000E38 100%)',
      borderRadius: 10,
      border: '1px solid #6DC1EE',
    }}
  >
    {items.map((stock, idx) => (
      <Fragment key={stock.codeName || idx}>
        <div
          key={stock.codeName || idx}
          className="flex items-center sm:px-1.5 py-1"
        >
          <StockPrice rankedMarketItem={stock} className="w-full" />
        </div>

        {idx !== items.length - 1 && (
          <div className="w-px h-8 xsm:block hidden bg-[#6DC1EE8C]"></div>
        )}
      </Fragment>
    ))}
  </div>
);

interface ItemPosition {
  x: number;
  y: number;
  moveDistance: number;
  isPositive: boolean;
  changedSection?: boolean;
}

// Positioning logic for chips (market items)
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

function generateNonOverlappingPositions(
  count: number,
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number,
  minDistance = 8
) {
  const positions: { x: number, y: number }[] = [];
  const maxAttempts = count * 50;
  let attempts = 0;

  while (positions.length < count && attempts < maxAttempts) {
    const x = xStart + Math.random() * (xEnd - xStart);
    const y = yStart + Math.random() * (yEnd - yStart);

    // Check if this position conflicts with existing positions
    const hasCollision = positions.some(pos => {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      return distance < minDistance;
    });

    if (!hasCollision) {
      positions.push({ x, y });
    }

    attempts++;
  }

  // Fill remaining positions with fallback spiral pattern
  while (positions.length < count) {
    const angle = (positions.length * 2.4) % (2 * Math.PI);
    const radius = 5 + (positions.length * 2);
    const centerX = (xStart + xEnd) / 2;
    const centerY = (yStart + yEnd) / 2;

    const x = Math.max(xStart, Math.min(xEnd, centerX + Math.cos(angle) * radius));
    const y = Math.max(yStart, Math.min(yEnd, centerY + Math.sin(angle) * radius));

    positions.push({ x, y });
  }

  return positions;
}

// Custom chip style for white background, colored border
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

  // Optimized position calculation with collision detection for results
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

      let posPositions: { x: number, y: number }[];
      let negPositions: { x: number, y: number }[];

      if (showResults) {
        // Use non-overlapping positions for results display
        posPositions = generateNonOverlappingPositions(positiveItems.length, 20, 90, 5, 35, 10);
        negPositions = generateNonOverlappingPositions(negativeItems.length, 20, 90, 65, 95, 10);
      } else {
        // Use regular grid positions during game
        posPositions = generateGridPositions(positiveItems.length, 20, 90, 5, 35, true);
        negPositions = generateGridPositions(negativeItems.length, 20, 90, 65, 95, true);
      }

      // Assign positions
      const newPositions = new Map<string, ItemPosition>();

      positiveItems.forEach((item, i) => {
        if (!item.codeName) return;
        const priceChange = parseFloat(item.change_percent || '0');
        const prevPos = previousPositions.get(item.codeName);

        // Ensure positive items NEVER go below 40% (strict upper section)
        const yPosition = posPositions[i]?.y ?? 10;
        const clampedY = Math.max(5, Math.min(yPosition, 35)); // Max 35% to ensure safe margin

        newPositions.set(item.codeName, {
          x: posPositions[i]?.x ?? 25,
          y: clampedY,
          moveDistance: Math.min(Math.abs(priceChange) * 0.4, 4),
          isPositive: true,
          changedSection: prevPos ? prevPos.isPositive !== true : false
        });
      });

      negativeItems.forEach((item, i) => {
        if (!item.codeName) return;
        const priceChange = parseFloat(item.change_percent || '0');
        const prevPos = previousPositions.get(item.codeName);

        // Ensure negative items NEVER go above 60% (strict lower section)
        const yPosition = negPositions[i]?.y ?? 70;
        const clampedY = Math.min(95, Math.max(yPosition, 65)); // Min 65% to ensure safe margin

        newPositions.set(item.codeName, {
          x: negPositions[i]?.x ?? 25,
          y: clampedY,
          moveDistance: Math.min(Math.abs(priceChange) * 0.4, 4),
          isPositive: false,
          changedSection: prevPos ? prevPos.isPositive !== false : false
        });
      });

      positionsRef.current = newPositions;
    });
  }, [memoizedItems, showResults]);

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

        // Double-check position to prevent section crossing
        const finalY = isPositive ? Math.min(position.y, 35) : Math.max(position.y, 65);

        // Enhanced animation logic with staggered results
        const getAnimationStyle = () => {
          if (showResults) {
            const staggerDelay = (Array.from(positionsRef.current.keys()).indexOf(item.codeName || '') * 0.1);
            return `resultPulse 2s ease-in-out infinite ${staggerDelay}s, float${floatPattern} 2s ease-in-out infinite ${staggerDelay}s`;
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
              "px-1.5 text-[9px] py-0.5 rounded-full text-black border absolute will-change-transform transition-all duration-700 ease-out",
              showResults && "animate-pulse shadow-lg ring-2 ring-white/30",              
              // Add higher z-index for results to prevent overlap issues
              showResults ? "z-30" : "z-20"
            )}
            style={{
              backgroundColor:"white",
              left: `${position.x}%`,
              borderColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
              top: `${finalY}%`,
              transform: 'translate(-50%, -50%) scale(1)',
              animation: getAnimationStyle(),
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
              // Ensure proper spacing in results mode
              minWidth: showResults ? '40px' : 'auto',
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


  const showWinner = roundRecordWithWinningId?.finalPricesPresent;

  const handleBoardClick = useCallback((type: SevenUpDownPlacementType) => {
    if (isPlaceOver) return;
    mutate({
      roundId: roundRecord.id,
      placement: type,
      amount: amount,
    });
  }, [isPlaceOver, mutate, roundRecord.id, amount]);



  return (
    <div
      className="relative  w-full  md:mx-auto"
    >
      {children}
      <div className="flex justify-between flex-col gap-2 w-full">
        <MarketRow items={displayItems.slice(0, 7)} />
        <div className="relative z-0 h-[20rem]   w-full">
          {/* Market items display */}
          <WinnerOverlay roundRecordWithWinningId={roundRecordWithWinningId} />
          <img src="/images/seven-up-down/board.png" alt="board" className="absolute inset-0 w-full h-full object-fill" />
          <div className="absolute inset-0">
            {isPlaceOver && displayItems.length > 0 && (
              <MarketItemDisplay
                items={displayItems}
                showResults={showWinner || false}
                isTransitioning={false} 
              />
            )}
          </div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <SevenBetButton onClick={() => handleBoardClick(SevenUpDownPlacementType.SEVEN)} />
          </div>

          {/* 8-14 Area */}
          <div
            onClick={() => handleBoardClick(SevenUpDownPlacementType.UP)}
            className={cn(
              "absolute inset-x-0 top-0 h-[10rem] hover:scale-[1.02] cursor-pointer transition-all duration-500 flex flex-col items-center justify-start pt-4",
            )}
          >
            <div className="text-2xl font-protest-strike opacity-80 text-white">7 Up</div>
            <div className="text-sm  font-protest-strike opacity-80 text-white">1:{SEVEN_UP_DOWN_MULTIPLIER}</div>
          </div>

          {/* 0-6 Area */}
          <div
            onClick={() => handleBoardClick(SevenUpDownPlacementType.DOWN)}
            className={cn(
              "absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-500 h-[10rem] flex flex-col items-center justify-end py-4",
            )}
          >
            <div className="text-2xl font-protest-strike opacity-80  text-white">7 Down</div>
            <div className="text-sm font-protest-strike opacity-80 text-white">1:{SEVEN_UP_DOWN_MULTIPLIER}</div>
          </div>
        </div>
        <MarketRow items={displayItems.slice(7, 14)} />
      </div>
    </div>
  );
};

const SevenBetButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({  className }) => {
  return (
    <motion.div
      className={cn(
        "absolute cursor-pointer w-48 h-24 flex flex-col items-center justify-center z-10",
        className
      )}

      style={{
        border: '3px solid #FFDE21', // blue border as in the image
        borderRadius: '50%',    // oval shape
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* Rotating gradient background, but not the border */}
      <motion.div
        className="absolute inset-0 "
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
          scale: 2.3,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 30, // very slow
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50% / 40%',
            background: 'linear-gradient(124deg, #E5C300 -4.44%, #805E01 34.69%, #EFCB00 66.57%, #805E01 96.03%)'
          }}
        />
      </motion.div>
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="text-3xl font-bold text-black" style={{ fontFamily: 'Oval, sans-serif' }}>
          7 Up Down
        </div>
      </div>
    </motion.div>
  );
};

const WinnerOverlay: React.FC<{
  roundRecordWithWinningId: RoundRecord | null
}> = ({ roundRecordWithWinningId }) => {
  // Use the same logic as in game-board.tsx for winner section
  // Note: MarketItem does not have change_percent, so use changePercent
  const finalPricesPresent = roundRecordWithWinningId?.finalPricesPresent;
  const positiveStocks = roundRecordWithWinningId?.winningId?.length || 0;
  let winningSection: "seven" | "up" | "down" | null = null;
  if (finalPricesPresent) {
    if (positiveStocks === 7) winningSection = "seven";
    else if (positiveStocks > 7) winningSection = "up";
    else if (positiveStocks < 7) winningSection = "down";
  }

  let winnerLabel = "";
  if (winningSection === "seven") {
    winnerLabel = "7";
  } else if (winningSection === "up") {
    winnerLabel = "7 up";
  } else if (winningSection === "down") {
    winnerLabel = "7 down";
  }

  if (!finalPricesPresent) return null;
  return (
    <>
      <div
        style={{
          background: "linear-gradient(108.92deg, #0C9E02 29.33%, #043801 114.8%)",
          borderColor: "rgba(15, 219, 0, 1)",
          boxShadow: "0px 0px 15px 1px rgba(222, 189, 0, 1)",
        }}
        className={cn(
          "w-full backdrop-blur-lg  xs:max-w-screen-xs max-w-72 rounded-md z-[60] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 border-2"
        )}
      >
        <div className="text-center font-medium">
          <h3 className="md:text-3xl sm:text-2xl text-xl font-bold text-white tracking-wider mb-2" style={{ fontFamily: "sans-serif" }}>
            Winner!
          </h3>
          <p className="text-white md:text-xl text-lg font-semibold" style={{ fontFamily: "sans-serif" }}>
            {winnerLabel}
          </p>
        </div>
      </div>
      <div
       
        className="w-full h-full bg-black/50 scale-110 blur-sm absolute z-40 top-0 left-0"
      />
    </>
  );
};
