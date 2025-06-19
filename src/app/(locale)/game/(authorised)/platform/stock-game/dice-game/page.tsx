"use client"
import { DiceGameTimeDisplay } from '@/components/common/bet-locked-banner';
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MaintainceScreen from '@/components/common/maintaince-screen';
import MarketSelector from '@/components/common/market-selector';
import StockGameHeader from '@/components/common/stock-game-header';
import { BettingArea } from '@/components/features/dice-game/betting-area';
import Dice3D from '@/components/features/dice-game/dice-3d';
import BettingGrid, { MobileDice } from '@/components/features/dice-game/game-board';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';

const WheelOfFortune = () => {
    const { marketSelected, setMarketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.DICE);

    const roundRecordWithWinningId = useWinningId(roundRecord);


    if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Dice Game Market" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    return (
        <section className="flex flex-col  items-start justify-start min-h-[calc(100svh-100px)] -mx-4">
            <div className="flex flex-col h-fit max-w-2xl w-full relative  bg-gray-900 border border-gray-600 sm:rounded-lg rounded-none mx-auto  text-white overflow-hidden">
                <StockGameHeader onBack={() => setMarketSelected(false)} title="Dice Game" />
                <MaintainceScreen />
                <Dice3D className='h-36' roundRecord={roundRecord} roundRecordWithWinningId={roundRecordWithWinningId} />
                <BettingGrid className='relative sm:pt-32 pt-20' roundRecord={roundRecord} globalBetAmount={betAmount} winningMarketId={roundRecordWithWinningId?.winningId || null} >
                    <DiceGameTimeDisplay className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm  " roundRecord={roundRecord} />
                    <MobileDice roundRecord={roundRecord} roundRecordWithWinningId={roundRecordWithWinningId} />
                </BettingGrid>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default WheelOfFortune;
