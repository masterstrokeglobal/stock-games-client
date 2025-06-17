"use client"
import TimeDisplay from '@/components/common/bet-locked-banner';
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import StockGameHeader from '@/components/common/stock-game-header';
import { BettingArea } from '@/components/features/7-up-down/BettingArea';
import { GameBoard } from '@/components/features/7-up-down/game-board';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { useLeaderboard } from '@/hooks/use-sevenup-leader-board';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';

const SevenUpSevenDown = () => {
  const { marketSelected, setMarketSelected } = useMarketSelector();
  const [betAmount, setBetAmount] = useState<number>(100);
  const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.SEVEN_UP_DOWN);
  const { stocks } = useLeaderboard(roundRecord);
  const roundRecordWithWinningId = useWinningId(roundRecord);

  
  if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="7 Up 7 Down Market" />
  if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)] md:mx-auto -mx-4">
      <div className="flex flex-col min-h-screen md:rounded-lg border border-gray-700  max-w-2xl w-full mx-auto bg-gray-900 text-white overflow-hidden">
        <StockGameHeader onBack={() => setMarketSelected(false)} title="7 Up & 7 Down" />
        <GameBoard roundRecord={roundRecord} amount={betAmount} marketItems={stocks} roundRecordWithWinningId={roundRecordWithWinningId}>
          <TimeDisplay className="absolute top-0 left-1/2 -translate-x-1/2 md:max-w-sm max-w-[200px] w-full" roundRecord={roundRecord} />
        </GameBoard>
        <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
      </div>
    </section>
  );
};

export default SevenUpSevenDown;
