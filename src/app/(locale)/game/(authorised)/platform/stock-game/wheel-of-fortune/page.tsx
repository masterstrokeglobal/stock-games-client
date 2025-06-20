"use client"
import TimeDisplay from '@/components/common/bet-locked-banner';
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MaintainceScreen from '@/components/common/maintaince-screen';
import MarketSelector from '@/components/common/market-selector';
import StockGameHeader from '@/components/common/stock-game-header';
import { BettingArea } from '@/components/features/wheel-of-fortune/betting-area';
import GameBoard from '@/components/features/wheel-of-fortune/game-board';
import { StockPriceDisplay } from '@/components/features/wheel-of-fortune/stock-price';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';


const WheelOfFortune = () => {
    const { marketSelected, setMarketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const {
        roundRecord,
        isLoading
    } = useCurrentGame(RoundRecordGameType.WHEEL_OF_FORTUNE);


    const roundRecordWithWinningId = useWinningId(roundRecord);
    const winningMarketId = roundRecordWithWinningId?.winningId || null;

    if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Wheel of Fortune Market" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    return (
        <section className="flex flex-col  items-center justify-center min-h-[calc(100svh-100px)] -md:mx-12 -mx-4">
            <div className="flex flex-col min-h-screen max-w-2xl relative w-full mx-auto bg-gray-900 border border-gray-600 md:rounded-lg text-white overflow-hidden">
                <StockGameHeader onBack={() => setMarketSelected(false)} title="Wheel of Fortune" />
                <MaintainceScreen />
                <StockPriceDisplay roundRecord={roundRecord} winningMarketId={winningMarketId} />
                <GameBoard roundRecord={roundRecord} amount={betAmount} roundRecordWithWinningId={roundRecordWithWinningId}>
                    <TimeDisplay className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm  " roundRecord={roundRecord} />
                </GameBoard>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default WheelOfFortune;