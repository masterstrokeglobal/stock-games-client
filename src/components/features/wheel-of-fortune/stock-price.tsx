import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGameState, usePlacementOver } from '@/hooks/use-current-game';
import { cn } from '@/lib/utils';
import { RoundRecord } from '@/models/round-record';
import { MenuIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import GameSettingsPopover from './game-menu';
import StockWheel from './stock-wheel';


export const StockPriceDisplay: React.FC<{ roundRecord: RoundRecord, className?: string, winningMarketId: number[] | null }> = ({ roundRecord, winningMarketId, className }) => {

  const isPlaceOver = usePlacementOver(roundRecord);

  // Additional safety checks to prevent spinning during betting time
  const currentTime = new Date().getTime();
  const placementEndTime = new Date(roundRecord.placementEndTime).getTime();
  const gameEndTime = new Date(roundRecord.endTime).getTime();

  const isBettingClosed = currentTime >= placementEndTime;
  const isGameStillActive = currentTime < gameEndTime;
  const hasNoWinner = winningMarketId == null;

  const isSpinning = isBettingClosed && isGameStillActive && hasNoWinner && isPlaceOver;

  return (
    <div className={cn("flex flex-col justify-between items-center relative z-0 overflow-hidden ", className)}>
        <div className='md:hidden flex gap-2 w-full mb-4 px-4  justify-between items-center text-white'>
          <Badge className='bg-red-600 flex items-center  h-6 sm:h-8 text-sm sm:text-base tracking-wider md:hidden uppercase text-white'>
            <div className='size-1.5 sm:size-2 bg-white rounded-full mr-1.5 sm:mr-2' />
            Live
          </Badge>
          <Viewers />
          <GameSettingsPopover>
            <Button style={{
              boxShadow: '0px 0px 5.4px 0px rgba(72, 131, 121, 1)',
            }} className='bg-[#274D3A] px-2 text-white border border-[#488379]'>
              <MenuIcon />
            </Button>
          </GameSettingsPopover>
        </div>
      <div className='flex items-center w-full  relative justify-between gap-2'>
        <Badge className='bg-red-600  items-center  h-6 sm:h-8 text-sm sm:text-base absolute top-0 left-2 tracking-wider hidden md:flex uppercase text-white'>
          <div className='size-1.5 sm:size-2 bg-white rounded-full mr-1.5 sm:mr-2' />
          Live
        </Badge>
        <div className='w-full flex items-center justify-center gap-2 flex-col'>
          <h1
           
            className='md:text-3xl xl:text-4xl fortune-glow font-konkhmer-sleokchher tracking-widest  sm:text-2xl text-xl font-bold  text-white flex-1 text-center'
          >
            WHEEL OF FORTUNE
          </h1>
          <GameTimer roundRecord={roundRecord} />
        </div>
      </div>
      <div className='relative z-20'>
        <StockWheel roundRecord={roundRecord} winningMarketId={winningMarketId} isSpinning={isSpinning} />
      </div>
    </div>
  );
};


const GameTimer = ({ roundRecord }: { roundRecord: RoundRecord }) => {
  const { gameTimeLeft, isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord)
  const statusText = isPlaceOver ? isGameOver ? "Game Over" : "Betting Closed" : "Betting Open"

  const timeLeft = !isPlaceOver ? placeTimeLeft : gameTimeLeft;
  return (
    <div>

      <span className='bg-[#203C2D]  xl:text-3xl md:text-2xl sm:text-xl text-lg font-jersy-20 text-[#5DB98A] font-josefin  font-medium px-2 py-1 border border-[#498C80] rounded-md'>
        {statusText} {`${timeLeft.minutes.toString().padStart(2, '0')} : ${timeLeft.seconds.toString().padStart(2, '0')}`}
      </span>

    </div>
  );
};

export const Viewers = () => {
  const [viewerCount, setViewerCount] = useState(500);
  const [direction, setDirection] = useState(1); // 1 for increasing, -1 for decreasing

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prevCount => {
        const change = Math.floor(Math.random() * 10) + 1; // Random change between 1-10
        let newCount = prevCount + (direction * change);
        
        // Reverse direction when hitting boundaries
        if (newCount >= 600) {
          setDirection(-1);
          newCount = 600;
        } else if (newCount <= 400) {
          setDirection(1);
          newCount = 400;
        }
        
        return newCount;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className='flex items-center gap-2'> 
      {viewerCount} viewing
    </div>
  )
}
