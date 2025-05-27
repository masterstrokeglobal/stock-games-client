import React from 'react';
import { RoundRecord } from '@/models/round-record';
import { MarketItem } from '@/models/market-item';
import { cn } from '@/lib/utils';
import { usePlacementOver } from '@/hooks/use-current-game';

interface DiceFaceProps {
  marketItem: MarketItem;
  className: string;
  number: number;
  isWinning?: boolean;
  isLoading?: boolean;
}

interface Dice3DProps {
  className?: string;
  roundRecord: RoundRecord;
  winningMarketId: number[] | null;
}

const Dice3D: React.FC<Dice3DProps> = ({ className = '', roundRecord, winningMarketId }) => {
  const marketItems = roundRecord.market;
  const isPlaceOver = usePlacementOver(roundRecord);
  const isRolling = winningMarketId == null && isPlaceOver;


  const firstCube = marketItems.slice(0, 6);
  const secondCube = marketItems.slice(6, 12);

  // Check if we're waiting for winning data
  const isWaitingForResults = !isRolling && (!winningMarketId || winningMarketId.length === 0);

  return (
    <div className={`p-5 font-sans overflow-visible ${className}`} style={{ height: '16rem' }}>
      <div className="flex justify-center gap-24 flex-wrap h-full items-center">
        <Cube 
          marketItems={firstCube} 
          isRolling={isRolling} 
          winningMarketId={winningMarketId?.[0]}
          isLoading={isWaitingForResults}
        />
        <Cube 
          marketItems={secondCube} 
          className='delay-1000' 
          isRolling={isRolling} 
          winningMarketId={winningMarketId?.[1]}
          isLoading={isWaitingForResults}
        />
      </div>
    </div>
  );
};

export default Dice3D;

const DiceFace: React.FC<DiceFaceProps> = ({ marketItem, className, number, isWinning, isLoading }) => {
  const renderDots = (num: number): JSX.Element[] => {
    const dots: JSX.Element[] = [];
    const positions: Record<number, Array<{ top: string; left: string }>> = {
      1: [{ top: '50%', left: '50%' }],
      2: [{ top: '25%', left: '25%' }, { top: '75%', left: '75%' }],
      3: [{ top: '25%', left: '25%' }, { top: '50%', left: '50%' }, { top: '75%', left: '75%' }],
      4: [
        { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
        { top: '75%', left: '25%' }, { top: '75%', left: '75%' }
      ],
      5: [
        { top: '25%', left: '25%' }, { top: '25%', left: '75%' },
        { top: '50%', left: '50%' },
        { top: '75%', left: '25%' }, { top: '75%', left: '75%' }
      ],
      6: [
        { top: '20%', left: '25%' }, { top: '20%', left: '75%' },
        { top: '50%', left: '25%' }, { top: '50%', left: '75%' },
        { top: '80%', left: '25%' }, { top: '80%', left: '75%' }
      ]
    };

    positions[num]?.forEach((pos, i) => {
      dots.push(
        <div
          key={i}
          className={cn(
            "absolute w-3 h-3 bg-white rounded-full shadow-lg",
            isLoading && "animate-pulse"
          )}
          style={{
            top: pos.top,
            left: pos.left,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        />
      );
    });

    return dots;
  };

  return (
    <div
      className={cn(
        `absolute ${className}`
      )}
      style={{
        width: '120px',
        height: '120px',
        background: isWinning ? '#1e40af' : '#2563eb',
        border: '2px solid #1e40af',
        borderRadius: '8px',
        boxShadow: `
          0 4px 8px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2),
          inset 0 -1px 0 rgba(0, 0, 0, 0.2)
        `
      }}
    >
      {renderDots(number)}
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className={cn(
          "text-white text-sm selection:bg-transparent font-light jersey tracking-wider",
          isLoading && "animate-pulse"
        )} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          {marketItem.name || '?'}
        </span>
      </div>
    </div>
  );
};

interface CubeProps {
  marketItems: MarketItem[];
  className?: string;
  isRolling: boolean;
  winningMarketId?: number;
  isLoading?: boolean;
}

const Cube: React.FC<CubeProps> = ({ marketItems, className, isRolling, winningMarketId, isLoading }) => {
  // Ensure we have at least 6 market items, if not, repeat the available ones
  const items = marketItems.length >= 6 
    ? marketItems.slice(0, 6) 
    : [...marketItems, ...marketItems.slice(0, 6 - marketItems.length)];

  // Find the index of the winning market item
  const winningIndex = winningMarketId !== undefined 
    ? items.findIndex(item => item.id === winningMarketId)
    : -1;

  // Calculate the rotation needed to show the winning face
  const getWinningRotation = () => {
    if (winningIndex === -1) return '';
    
    const rotations = {
      0: 'rotateX(0deg) rotateY(0deg)',      // front
      1: 'rotateX(0deg) rotateY(180deg)',    // back
      2: 'rotateX(0deg) rotateY(90deg)',     // right
      3: 'rotateX(0deg) rotateY(-90deg)',    // left
      4: 'rotateX(-90deg) rotateY(0deg)',    // top
      5: 'rotateX(90deg) rotateY(0deg)'      // bottom
    };
    
    return rotations[winningIndex as keyof typeof rotations] || '';
  };

  // Determine if we should show the winning face
  const shouldShowWinningFace = !isRolling && winningMarketId !== undefined && winningIndex !== -1;

  return (
    <div
      className={cn('dice-cube-container', className)}
      style={{
        width: '60px',
        height: '60px',
        perspective: '600px',
        margin: '0 auto'
      }}
    >
      <div
        className="dice-cube"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          animation: isRolling ? 'smoothRotation 1s infinite linear' : 'none',
          transform: shouldShowWinningFace ? getWinningRotation() : undefined
        }}
      >
        <DiceFace 
          marketItem={items[0]} 
          className="dice-front" 
          number={1} 
          isWinning={winningIndex === 0}
          isLoading={isLoading}
        />
        <DiceFace 
          marketItem={items[1]} 
          className="dice-back" 
          number={6} 
          isWinning={winningIndex === 1}
          isLoading={isLoading}
        />
        <DiceFace 
          marketItem={items[2]} 
          className="dice-right" 
          number={3} 
          isWinning={winningIndex === 2}
          isLoading={isLoading}
        />
        <DiceFace 
          marketItem={items[3]} 
          className="dice-left" 
          number={4} 
          isWinning={winningIndex === 3}
          isLoading={isLoading}
        />
        <DiceFace 
          marketItem={items[4]} 
          className="dice-top" 
          number={2} 
          isWinning={winningIndex === 4}
          isLoading={isLoading}
        />
        <DiceFace 
          marketItem={items[5]} 
          className="dice-bottom" 
          number={5} 
          isWinning={winningIndex === 5}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};