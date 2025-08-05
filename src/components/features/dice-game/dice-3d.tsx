import { usePlacementOver } from '@/hooks/use-current-game';
import { RankedMarketItem } from '@/hooks/use-leadboard';
import useWindowSize from '@/hooks/use-window-size';
import { cn } from '@/lib/utils';
import { MarketItem } from '@/models/market-item';
import { RoundRecord } from '@/models/round-record';
import React, { useEffect, useMemo, useState } from 'react';
import TriangleIcon from '../common/triangle-icon';

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
  stocks: RankedMarketItem[];
  roundRecordWithWinningId: RoundRecord | null;
}

const StockDisplay = ({ stock, className, isSecondCube, roundRecord, winner, isLast }: { stock?: RankedMarketItem, className?: string, isSecondCube?: boolean, roundRecord: RoundRecord | null, winner: boolean, isLast: boolean }) => {

  if (!stock) return null;
  const changePercentageText = roundRecord?.finalPricesPresent ? `${roundRecord.changePercentage(stock?.id || 0)}%` : `${Number(stock?.change_percent) >= 0 ? '+' : ''}${stock?.change_percent ?? "-"}% `;
  const changePercentage = roundRecord?.finalPricesPresent ? roundRecord.changePercentage(stock?.id || 0) : stock?.change_percent;

  const horse = stock?.horse ? stock?.horse % 6 === 0 ? 6 : stock?.horse % 6 : '';
  return (
    <div className={cn("flex flex-col justify-between items-center rounded-none  text-[10px] relative z-20 text-white/90 py-0.5 px-1 transition-colors w-full", className)}>
      <div className="flex items-center justify-between w-full px-1 gap-0.5 min-w-0">
        <span className="font-medium truncate max-w-[60px] font-inter">{stock?.codeName}</span>
        <span className={cn("text-[10px] border border-white/10 w-4 h-4 aspect-square font-bold flex items-center justify-center px-0.5 rounded-full flex-shrink-0", winner && "text-white", isSecondCube && "order-first")}>
          {horse}
        </span>
      </div>
      <span className={cn(
        "font-bold px-0.5 flex items-center gap-1 rounded-none flex-shrink-0",
        changePercentage ? Number(changePercentage) > 0
          ? 'text-[#4FFF83] bg'
          : 'text-[#FF0000]' : "text-white "
      )}>

        <TriangleIcon className={cn(changePercentage ? Number(changePercentage) > 0 ? 'text-[#4FFF83] ' :
          'text-[#FF0000] rotate-180' : 'text-white rotate-90')} />
        {changePercentageText}
      </span>
      {!isLast && <div className={cn('h-px bg-[#4467CC80]  w-full')} />}
    </div>
  );
};

export const Dice3D: React.FC<Dice3DProps> = ({ className = '', roundRecord, roundRecordWithWinningId, stocks }) => {
  const marketItems = roundRecord.market;
  const [showDice, setShowDice] = useState(false);
  const [isTossing,setIsTossing] = useState(false);
  const [diceAppear, setDiceAppear] = useState(false);
  const isPlaceOver = usePlacementOver(roundRecord);
  const isRolling = isPlaceOver && roundRecordWithWinningId?.winningId == null;

  const firstCube = marketItems.slice(0, 6);
  const secondCube = marketItems.slice(6, 12);

  const marketItemsStocks = useMemo(() => {
    return marketItems.map((item) => {
      const stock = roundRecordWithWinningId?.finalPricesPresent ? roundRecordWithWinningId.sortedMarketItems?.find((stock) => stock.id === item.id) : stocks.find((stock) => stock.id === item.id);
      return stock;
    });
  }, [marketItems, stocks, roundRecordWithWinningId]);

  const firstCubeStocks = useMemo(() => {
    return marketItemsStocks.slice(0, 6).sort((a, b) => (b?.change_percent == undefined ? -100 : parseFloat(b?.change_percent)) - (a?.change_percent == undefined ? -100 : parseFloat(a?.change_percent)));
  }, [marketItemsStocks]);

  const secondCubeStocks = useMemo(() => {
    return marketItemsStocks.slice(6, 12).sort((a, b) => (b?.change_percent == undefined ? -100 : parseFloat(b?.change_percent)) - (a?.change_percent == undefined ? -100 : parseFloat(a?.change_percent)));
  }, [marketItemsStocks]);

  // Check if we're waiting for winning data
  const isWaitingForResults = !isRolling && (!roundRecordWithWinningId?.winningId || roundRecordWithWinningId?.winningId.length === 0);

  // Animate dice appearing from below when showDice goes from false to true
  useEffect(() => {
    let showDiceTimeout: ReturnType<typeof setTimeout> | undefined;
    let tossTimeout: ReturnType<typeof setTimeout> | undefined;

    if (isPlaceOver) {
      setIsTossing(true);
      // if (videoRef.current) {
      //   videoRef.current.currentTime = 0;
      //   videoRef.current.play();
      // }
      showDiceTimeout = setTimeout(() => {
        setShowDice(true);
      }, 3000); 
      tossTimeout = setTimeout(() => {
        setIsTossing(false);
      }, 4000);
    } else {
      setShowDice(false);
      setDiceAppear(false);
      setIsTossing(false);
    }

    return () => {
      if (showDiceTimeout) clearTimeout(showDiceTimeout);
      if (tossTimeout) clearTimeout(tossTimeout);
    };
  }, [isPlaceOver]);

  // Watch showDice and trigger appear animation
  useEffect(() => {
    if (showDice) {
      setDiceAppear(false);
      // allow reflow for animation
      const timeout = setTimeout(() => setDiceAppear(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setDiceAppear(false);
    }
  }, [showDice]);

  // Animation CSS
  // You can move this to a CSS/SCSS file if you prefer
  const diceAppearAnimation = `
    @keyframes diceAppearFromBelow100 {
      0% {
        transform: scale(0.2) translateY(400px);
      }
   
      20% {
        transform: scale(.2);
      }
    
      100% {
        transform: scale(1) translateY(0);
      }
    }
    @keyframes diceAppearFromBelow150 {
      0% {
        transform: scale(0.2) translateY(200px);
      }

      20% {
        transform: scale(.2);
      }

      100% {
        transform: scale(1) translateY(0);
      }
    }
    .dice-appear-animate-100 {
      animation: diceAppearFromBelow100 3s cubic-bezier(.22,1.12,.62,1) forwards;
    }
    .dice-appear-animate-150 {
      animation: diceAppearFromBelow150 3s cubic-bezier(.22,1.12,.62,1) forwards;
    }
    .dice-appear-hidden-100 {
      opacity: 0;
      transform: scale(0.2) translateY(100px);
      pointer-events: none;
    }
    .dice-appear-hidden-150 {
      opacity: 0;
      transform: scale(0.2) translateY(150px);
      pointer-events: none;
    }
  `;

  return (
    <>
      <style>{diceAppearAnimation}</style>
      <div className={`font-sans  bg-cover bg-center border border-[#4467CC80] grid grid-rows-1 p-2 rounded-lg overflow-visible ${className}`} >
        <div className="flex justify-between  relative  h-full items-center">
          <div className='flex flex-col  border rounded overflow-hidden border-[#4467CC80] h-full md:w-28 w-[80px]'>
            {/* <TriangleIcon className='size-3 text-white absolute top-4 right-0 translate-x-full  rotate-90' /> */}
            <h2 className='sm:text-sm xsm:text-xs text-[10px] whitespace-nowrap text-white  bg-[#4467CC80] mb-1 text-center py-1'>First Dice</h2>
            {firstCubeStocks?.map((stock, index) => (
              <StockDisplay winner={index === 0} key={stock?.id} stock={stock} className='flex-1 w-full last:border-none' roundRecord={roundRecordWithWinningId} isLast={index === 5} />
            ))}
          </div>
          <div className='relative flex-1 h-full max-w-sm'>
            <h2 className='text-white text-center sm:hidden  uppercase  z-10 text-xs font-semibold tracking-wider absolute top-0 left-1/2 -translate-x-1/2'>Dice Game</h2>
            <img src={isTossing?"/images/dice-game/gennie-toss.gif":"/images/dice-game/gennie-rest.gif"}  className={cn('absolute xsm:-bottom-2 z-10 xsm:h-52 h-40  xsm:left-[30%] left-1/4 -bottom-2')} />
            <div
              style={{
                border: '1px solid rgba(68, 103, 204, 1)',
                boxShadow: '20px 20px 100px 18px rgba(68, 103, 204, 1)',
              }}
              className={cn(
                'flex flex-col absolute left-1/4 rounded-full max-w-full !aspect-square sm:p-8 xsm:p-6 p-0 -translate-x-1/4 sm:-top-2 xsm:top-4 top-8 justify-center items-center gap-8 h-auto sm:w-52 w-40'
              )}
            >
              <div
                className={cn(
                  'flex flex-col gap-6 items-center justify-center w-full'
                )}
              >
                <Cube
                  marketItems={firstCube}
                  showDice={showDice}
                  isRolling={isRolling}
                  className={cn(
                    showDice
                      ? diceAppear
                        ? 'dice-appear-animate-100'
                        : 'dice-appear-hidden-100'
                      : 'dice-appear-hidden-100'
                  )}
                  winningMarketId={roundRecordWithWinningId?.winningId}
                  isLoading={isWaitingForResults}
                />
                <Cube
                  marketItems={secondCube}
                  showDice={showDice}
                  className={cn(
                    showDice
                      ? diceAppear
                        ? 'dice-appear-animate-150'
                        : 'dice-appear-hidden-150'
                      : 'dice-appear-hidden-150'
                  )}
                  isRolling={isRolling}
                  isSecondCube
                  winningMarketId={roundRecordWithWinningId?.winningId}
                  isLoading={isWaitingForResults}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col h-full  md:w-28 w-[80px]  overflow-hidden self-end border border-[#4467CC80] rounded-lg'>
            {/* <TriangleIcon className='size-3 text-white absolute bottom-4 left-0 -translate-x-full  -rotate-90' /> */}
            <h2 className='sm:text-sm xsm:text-xs text-[10px] whitespace-nowrap text-white  bg-[#4467CC80] mb-1 text-center py-1'>Second Dice</h2>

            {secondCubeStocks?.map((stock, index) => (
              <StockDisplay winner={index === 0} key={stock?.id} stock={stock} className='flex-1  w-full' isSecondCube roundRecord={roundRecordWithWinningId} isLast={index === 5} />
            ))}

          </div>
        </div>
      </div>
    </>
  );
};

export default Dice3D;

const DiceFace: React.FC<DiceFaceProps> = ({ marketItem, className, number, isWinning, isLoading }) => {
  const { isMd, isXsm } = useWindowSize();

  // FIXED: renderDots was broken, now it's a function that returns an array
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
            "absolute md:w-1.5 md:h-1.5 w-1 h-1 bg-[#5A3A24] rounded-full shadow-lg",
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

  const size = isXsm ? '30px' : isMd ? '40px' : '44px';
  return (
    <div
      className={cn(
        `absolute ${className}`
      )}
      style={{
        width: size,
        height: size,
        background: isWinning ? 'linear-gradient(135deg, #FFF5D7, #EFD8AC)' : 'linear-gradient(135deg, #FFF5D7, #EFD8AC)',
      }}
    >
      {renderDots(number)}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className={cn(
          "sm:text-[8px] text-[6px] truncate max-w-full selection:bg-transparent text-[#5A3A24] font-medium z-10 relative tracking-wider rotate-15 block",
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
  winningMarketId?: number[];
  showDice?: boolean;
  isLoading?: boolean;
}

export const Cube: React.FC<CubeProps> = ({ marketItems, className, isRolling, winningMarketId, isLoading, isSecondCube, showDice }) => {
  // Ensure we have at least 6 market items, if not, repeat the available ones
  const { isMd, isXsm } = useWindowSize();
  const items = marketItems.length >= 6
    ? marketItems.slice(0, 6)
    : [...marketItems, ...marketItems.slice(0, 6 - marketItems.length)];

  // Find the index of the winning market item
  const winningIndex = winningMarketId !== undefined
    ? items.findIndex(item => winningMarketId?.includes(item.id || 0))
    : -1;

  // Calculate the rotation needed to show the winning face
  const getWinningRotation = () => {
    if (winningIndex === -1) return '';

    const rotations = {
      0: 'rotateX(0deg) rotateY(0deg)',      // front
      5: 'rotateX(0deg) rotateY(180deg)',    // back
      3: 'rotateX(0deg) rotateY(90deg)',     // right
      2: 'rotateX(0deg) rotateY(-90deg)',    // left
      1: 'rotateX(-90deg) rotateY(0deg)',    // top
      4: 'rotateX(90deg) rotateY(0deg)'      // bottom
    };

    return rotations[winningIndex as keyof typeof rotations] || '';
  };

  // Determine if we should show the winning face
  const shouldShowWinningFace = !isRolling && winningMarketId !== undefined && winningIndex !== -1;
  const size = isXsm ? '30px' : isMd ? '40px' : '44px';

  return (
    <div
      className={cn('dice-cube-container', className)}
      style={{
        width: size,
        height: size,
        perspective: '400px',
        scale: showDice ? '1' : '0'
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
          number={1}
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
          isWinning={winningIndex === 5}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};