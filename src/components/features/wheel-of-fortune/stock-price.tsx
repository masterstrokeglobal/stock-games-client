import { useGameState, usePlacementOver } from '@/hooks/use-current-game';
import { RoundRecord } from '@/models/round-record';
import React from 'react';
import StockWheel from './stock-wheel';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import GameSettingsPopover from './game-menu';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';


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
    <div className={cn("flex flex-col justify-between items-center relative z-0 ", className)}>
        <div className='md:hidden flex gap-2 w-full mb-4 px-4  justify-between items-center text-white'>
          <Badge className='bg-red-600 h-6 sm:h-8 text-sm sm:text-base tracking-wider block md:hidden uppercase text-white'>
            <span className='size-1.5 sm:size-2 bg-white rounded-full mr-1.5 sm:mr-2' />
            Live
          </Badge>
          <div className='flex items-center gap-2'> 
            312 viewing
          </div>
          <GameSettingsPopover>
            <Button style={{
              boxShadow: '0px 0px 5.4px 0px rgba(72, 131, 121, 1)',
            }} className='bg-[#274D3A] px-2 text-white border border-[#488379]'>
              <MenuIcon />
            </Button>
          </GameSettingsPopover>
        </div>
      <div className='flex items-center w-full  relative justify-between gap-2'>
        <Badge className='bg-red-600 h-6 sm:h-8 text-sm sm:text-base absolute top-0 left-2 tracking-wider hidden md:block uppercase text-white'>
          <span className='size-1.5 sm:size-2 bg-white rounded-full mr-1.5 sm:mr-2' />
          Live
        </Badge>
        <div className='w-full flex items-center justify-center gap-2 flex-col'>
          <h1
            style={{
              textShadow: '0px 0px 20px rgba(53, 71, 68, 1), 0px 0px 40px rgba(53, 71, 68, 0.8), 0px 0px 60px rgba(53, 71, 68, 0.6);',
            }}
            className='md:text-3xl sm:text-2xl text-xl font-bold tracking-wider text-white flex-1 text-center'
          >
            WHEEL OF FORTUNE
          </h1>
          <GameTimer roundRecord={roundRecord} />
        </div>
      </div>
      {isSpinning && (
        <DotLottieReact
          className="absolute z-15 scale-[200%] top-0 left-0 w-full h-full z-10 pointer-events-none"
          src="/animation/sparkle-lottie.json"
          autoplay
          loop
        />
      )}
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

      <span className='bg-[#203C2D] font-josefin text-white px-2 py-1 border border-[#498C80] rounded-md'>
        {statusText} {`${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}
      </span>

    </div>
  );
};