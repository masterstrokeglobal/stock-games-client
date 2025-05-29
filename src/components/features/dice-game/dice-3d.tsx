import React, { useMemo } from 'react';
import { RoundRecord } from '@/models/round-record';
import { MarketItem } from '@/models/market-item';
import { cn } from '@/lib/utils';
import { usePlacementOver } from '@/hooks/use-current-game';
import { useLeaderboard } from '@/hooks/use-leadboard';
import Image from 'next/image';
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

const StockDisplay = ({ stock }: { stock: any }) => (
  <div className="flex justify-between items-center text-[10px] relative z-20 text-white/90 py-0.5 px-1 bg-black/70 backdrop-blur-sm rounded hover:bg-black transition-colors w-full">
    <div className="flex items-center gap-0.5 min-w-0">
      <span className="font-medium truncate max-w-[40px]">{stock.codeName}</span>
      <span className="text-[8px] font-bold bg-white/10 px-0.5 rounded-full flex-shrink-0">
        {stock.horse % 6 === 0 ? 6 : stock.horse % 6}
      </span>
    </div>
    <span className={cn(
      "font-bold px-0.5 rounded flex-shrink-0",
      Number(stock.change_percent) >= 0
        ? 'text-green-400 bg-green-400/10'
        : 'text-red-400 bg-red-400/10'
    )}>
      {Number(stock.change_percent) >= 0 ? '+' : ''}{stock.change_percent}%
    </span>
  </div>
);

const Dice3D: React.FC<Dice3DProps> = ({ className = '', roundRecord, winningMarketId }) => {
  const marketItems = roundRecord.market;
  const { stocks } = useLeaderboard(roundRecord);
  const isPlaceOver = usePlacementOver(roundRecord);
  const isRolling = false;

  const firstCube = marketItems.slice(0, 6);
  const secondCube = marketItems.slice(6, 12);

  const marketItemsStocks = useMemo(() => {
    console.log(stocks);
    return marketItems.map((item) => {
      const stock = stocks.find((stock) => stock.id === item.id);
      console.log(stock);
      return stock;
    });
  }, [marketItems, stocks]);


  // Check if we're waiting for winning data
  const isWaitingForResults = !isRolling && (!winningMarketId || winningMarketId.length === 0);

  return (
    <div className={`font-sans  bg-cover bg-center overflow-visible ${className}`} style={{ height: '14rem' }}>
      <div className="flex justify-center flex-wrap relative  h-full items-center">
        <div className="flex flex-col bg-[url('/images/dice-game/dice-bg.jpg')] pr-1 bg-cover bg-center flex-1 h-full gap-2 items-center justify-between">
          <div className='grid grid-cols-3 w-full gap-2'>
            {marketItemsStocks.slice(0, 3).map((stock) => (
              <StockDisplay key={stock?.id} stock={stock} />
            ))}
          </div>
          <Cube
            marketItems={firstCube}
            isRolling={isRolling}
            winningMarketId={winningMarketId?.[0]}
            isLoading={isWaitingForResults}
          />
          <div className='grid grid-cols-3 w-full gap-2'>
            {marketItemsStocks.slice(3, 6).map((stock) => (
              <StockDisplay key={stock?.id} stock={stock} />
            ))}
          </div>
        </div>
        <div className=' absolute left-1/2 -translate-x-1/2 h-full z-10'>
          <img src="/images/dice-game/lady.gif" alt="dice-bg" className='h-full w-auto' />
        </div>
        <div className="flex flex-col bg-[url('/images/dice-game/dice-bg.jpg')] pl-1 bg-cover bg-center flex-1 h-full gap-2 items-center justify-between ">
          <div className='grid grid-cols-3 w-full gap-2'>
            {marketItemsStocks.slice(6, 9).map((stock) => (
              <StockDisplay key={stock?.id} stock={stock} />
            ))}
          </div>
          <Cube
            marketItems={secondCube}
            className='delay-1000'
            isRolling={isRolling}
            isSecondCube
            winningMarketId={winningMarketId?.[1]}
            isLoading={isWaitingForResults}
          />
          <div className='grid grid-cols-3 w-full gap-2'>
            {marketItemsStocks.slice(9, 12).map((stock) => (
              <StockDisplay key={stock?.id} stock={stock} />
            ))}
          </div>
        </div>
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
            "absolute w-2 h-2 bg-black rounded-full shadow-lg",
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
        width: '80px',
        height: '80px',
        background: isWinning ? 'linear-gradient(to right, #ffd700, #ffa500)' : 'linear-gradient(to right, #ffd700, #ffa500)',
        border: '2px solid',
        borderImage: 'linear-gradient(90deg, #b8860b 0%, #daa520 50%, #b8860b 100%) 1',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(255, 215, 0, 0.15)'
      }}
    >
      {renderDots(number)}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className={cn(
          "text-[10px] selection:bg-transparent text-black font-medium z-10 relative tracking-wider rotate-15 block",
        )} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
          {marketItem.codeName}
        </span>
      </div>
    </div>
  );
};

interface CubeProps {
  marketItems: MarketItem[];
  className?: string;
  isRolling: boolean;
  isSecondCube?: boolean;
  winningMarketId?: number;
  isLoading?: boolean;
}

const Cube: React.FC<CubeProps> = ({ marketItems, className, isRolling, winningMarketId, isLoading, isSecondCube }) => {
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
        width: '80px',
        height: '80px',
        perspective: '400px'
      }}
    >
      <div
        className="dice-cube"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          animation: isRolling ? isSecondCube ? 'smoothRotation2 2s infinite linear' : 'smoothRotation 1.5s infinite linear' : 'none',
          transform: shouldShowWinningFace ? getWinningRotation() : undefined
        }}
      >
        <DiceFace
          marketItem={items[0]}
          className="dice-front"
          number={5}
          isWinning={winningIndex === 0}
          isLoading={isLoading}
        />
        <DiceFace
          marketItem={items[5]}
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
          marketItem={items[1]}
          className="dice-top"
          number={2}
          isWinning={winningIndex === 4}
          isLoading={isLoading}
        />
        <DiceFace
          marketItem={items[4]}
          className="dice-bottom"
          number={5}
          isWinning={5 === 5}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};