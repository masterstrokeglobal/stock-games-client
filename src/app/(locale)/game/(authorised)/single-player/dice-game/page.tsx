"use client"
import { DiceGameTimeDisplay } from '@/components/common/bet-locked-banner';
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MaintainceScreen from '@/components/common/maintaince-screen';
import MarketSelector from '@/components/common/market-selector';
import { BettingArea } from '@/components/features/dice-game/betting-area';
import CurrentBets from '@/components/features/dice-game/current-bets';
import Dice3D from '@/components/features/dice-game/dice-3d';
import BettingGrid from '@/components/features/dice-game/game-board';
import HelpButton from '@/components/features/dice-game/help-button';
import LastRoundWinner from '@/components/features/dice-game/last-round';
import LeaderBoard from '@/components/features/dice-game/leaderboard';
import RoundTimings from '@/components/features/dice-game/round-timings';
import Navbar from '@/components/features/game/navbar';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { BREAKPOINTS, useWindowSize } from '@/hooks/use-window-size';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';

const WheelOfFortune = () => {
    const { width } = useWindowSize();
    const { marketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.DICE);

    const roundRecordWithWinningId = useWinningId(roundRecord);

    const isTablet = width < BREAKPOINTS.lg;


    if (!marketSelected) return (
        <section className=" space-y-4 pt-14 min-h-screen ">
            <Navbar />
            <MarketSelector className='max-w-2xl mx-auto' title="Dice Game Market" />
        </section>
    )

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[100svh]' />

    if (isTablet) return <section className=" space-y-4 pt-14 bg-[#140538] font-inter">
        <Navbar />
        <Dice3D className='sm:min-h-80 xs:min-h-72 min-h-60  w-full' roundRecord={roundRecord} roundRecordWithWinningId={roundRecordWithWinningId} />
        <BettingGrid roundRecord={roundRecord} globalBetAmount={betAmount} winningMarketId={roundRecordWithWinningId?.winningId || null} >
            <DiceGameTimeDisplay className="w-full max-w-sm  " roundRecord={roundRecord} />
        </BettingGrid>
        <div className='flex flex-col gap-4 px-4'>
            <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            <CurrentBets tableClassName='h-64' className='min-h-64' roundRecord={roundRecord} />
            <LeaderBoard roundRecord={roundRecord} className="border-[#4467CC80] grid-rows-1 h-auto w-full rounded-md  border" />
            <LastRoundWinner roundRecord={roundRecord} className="border-[#4467CC80] grid-rows-1 h-auto w-full rounded-md border" />
            <MaintainceScreen />
            <HelpButton />
        </div>
    </section>
    return (
        <section className=" flex-col  items-start justify-start h-screen grid-cols-12 grid grid-rows-1 pt-14 bg-[#140538] font-inter">
            <Navbar />
            <div className="col-span-3 border-r py-5 px-3 border-[#4467CC80] h-full grid gap-4 grid-rows-2 ">
                <LeaderBoard roundRecord={roundRecord} className="border-[#4467CC80] grid-rows-1 h-auto  border" />
                <LastRoundWinner roundRecord={roundRecord} className="border-[#4467CC80] grid-rows-1 h-auto  border" />
            </div>
            <div className="flex flex-col pt-5 px-3  col-span-6 overflow-y-auto  w-full relative h-full  rounded-none mx-auto  text-white overflow-hidden">
                <MaintainceScreen />
                <Dice3D className='min-h-[300px]' roundRecord={roundRecord} roundRecordWithWinningId={roundRecordWithWinningId} />
                <BettingGrid roundRecord={roundRecord} globalBetAmount={betAmount} winningMarketId={roundRecordWithWinningId?.winningId || null} >
                    <DiceGameTimeDisplay className="w-full max-w-sm  " roundRecord={roundRecord} />
                </BettingGrid>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
            <div className="col-span-3 border-l py-3 px-2 overflow-y-auto border-[#4467CC80] space-y-5 flex justify-between flex-col  h-full">
                <RoundTimings roundRecord={roundRecord} />
                <CurrentBets tableClassName='h-64' className='min-h-64' roundRecord={roundRecord} />
                <HelpButton />
            </div>
        </section>
    );
};

export default WheelOfFortune;
