"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import { useCurrentGame, useShowResults } from '@/hooks/use-current-game';
import { RoundRecordGameType } from '@/models/seven-up-down';
import TimeDisplay from './components/BetLockedBanner';
import { BettingArea } from './components/BettingArea';
import { GameBoard } from './components/GameBoard';
import { StockPriceDisplay } from './components/StockPriceDisplay';
import { useState } from 'react';

const SevenUpSevenDown = () => {
  const [betAmount, setBetAmount] = useState<number>(100);
  const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.SEVEN_UP_DOWN);


  if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)]">
      <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-gray-900 text-white overflow-hidden">
        <StockPriceDisplay roundRecord={roundRecord} />
        <GameBoard roundRecord={roundRecord} amount={betAmount}>
          <TimeDisplay className="absolute top-0 left-0 w-full " roundRecord={roundRecord} />
        </GameBoard>
        <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
        {/* Betting statistics */}
        {/* <div className="bg-gray-100 text-black px-2 py-1 flex text-xs">
          <div className="flex-2 text-sm text-gray-600 ml-1">
            calculated from last 10 rounds
          </div>
        </div> */}

        {/* Dice history */}
        {/* <div className="bg-gray-200 flex p-1 overflow-x-auto">
          {diceHistory.map((diceSum, index) => {
            let diceValues;
            switch (diceSum) {
              case 8: diceValues = [6, 2]; break;
              case 11: diceValues = [5, 6]; break;
              case 14: diceValues = [6, 5]; break;
              case 17: diceValues = [6, 6]; break;
              default: diceValues = [1, 1];
            }

            return (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center mx-0.5 text-sm font-bold 
                            ${diceSum === 8 ? 'bg-green-500' : 'bg-gray-300'} relative`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {diceSum}
                </div>
                <div className="transform scale-25 opacity-0">
                  <DiceSet values={diceValues} />
                </div>
              </div>
            );
          })}
        </div> */}

      </div>
    </section>
  );
};

export default SevenUpSevenDown;
