"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import StockGameHeader from '@/components/common/stock-game-header';
import { BettingArea } from '@/components/features/coin-head-tail/betting-area';
import GameBoard from '@/components/features/coin-head-tail/game-board';
import { StockPriceDisplay } from '@/components/features/coin-head-tail/stock-price';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import useWinningId from '@/hooks/use-winning-id';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';

const CoinHeadTail = () => {
    const { marketSelected, setMarketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.HEAD_TAIL);

    const roundRecordWithWinningSide = useWinningId(roundRecord);

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Coin Head Tail Market" roundRecordType={RoundRecordGameType.HEAD_TAIL} />
    
    return (
        <section className="flex flex-col  items-center justify-center min-h-[calc(100svh-100px)] -mx-4">
            <div className="flex flex-col h-fit max-w-2xl w-full mx-auto bg-gray-900 border border-gray-600 sm:rounded-lg text-white overflow-hidden">
                <StockGameHeader onBack={() => setMarketSelected(false)} title="Coin Head Tail" />
                <StockPriceDisplay roundRecord={roundRecord} winningSide={roundRecordWithWinningSide?.winningSide ?? null} />
                <GameBoard roundRecord={roundRecord} amount={betAmount} roundRecordWithWinningSide={roundRecordWithWinningSide}/>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default CoinHeadTail;
