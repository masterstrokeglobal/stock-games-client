"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MaintainceScreen from '@/components/common/maintaince-screen';
import MarketSelector from '@/components/common/market-selector';
import StockGameHeader from '@/components/common/stock-game-header';
import { BettingArea } from '@/components/features/slot-game/betting-area';
import { Slot } from '@/components/features/slot-machine/slot';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';

const StockSlot = () => {
    const { marketSelected, setMarketSelected } = useMarketSelector();
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.STOCK_JACKPOT);

    const [betAmount, setBetAmount] = useState<number>(100);

    const winningIdRoundRecord = useWinningId(roundRecord);

    if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Stock Slot Market" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    return (
        <section className="flex flex-col md:mx-auto -mx-4 items-center justify-center min-h-[calc(100svh-80px)] h-fit">
            <div className="flex flex-col relative max-w-2xl h-fit w-full md:mx-auto md:mt-0 -mt-6 bg-gray-900 border border-gray-600 md:rounded-lg text-white overflow-hidden">
                <StockGameHeader onBack={() => setMarketSelected(false)} title="Stock Slot" />
                <MaintainceScreen />
                <div className='flex flex-col flex-1 h-fit  items-center justify-center'>
                    <Slot roundRecord={roundRecord} winningIdRoundRecord={winningIdRoundRecord} />
                </div>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default StockSlot;
