"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import StockGameHeader from '@/components/common/stock-game-header';
import TimeDisplay from '@/components/common/bet-locked-banner';
import { BettingArea } from '@/components/features/7-up-down/BettingArea';
import { GameBoard } from '@/components/features/7-up-down/game-board';
import { StockPriceDisplay } from '@/components/features/7-up-down/StockPriceDisplay';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';

const SevenUpSevenDown = () => {
  const { marketSelected, setMarketSelected } = useMarketSelector();
  const [betAmount, setBetAmount] = useState<number>(100);
  const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.SEVEN_UP_DOWN);

  if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="7 Up 7 Down Market" />
  if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />
  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)]">
      <div className="flex flex-col min-h-screen rounded-lg border border-gray-700  max-w-2xl w-full mx-auto bg-gray-900 text-white overflow-hidden">
        <StockGameHeader onBack={() => setMarketSelected(false)} title="7 Up & 7 Down" />
        <StockPriceDisplay roundRecord={roundRecord} />
        <GameBoard roundRecord={roundRecord} amount={betAmount}>
          <TimeDisplay className="absolute top-0 left-0 w-full " roundRecord={roundRecord} />
        </GameBoard>
        <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
      </div>
    </section>
  );
};

export default SevenUpSevenDown;
