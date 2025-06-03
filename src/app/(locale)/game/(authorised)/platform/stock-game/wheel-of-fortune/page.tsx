"use client"
import TimeDisplay from '@/components/common/bet-locked-banner';
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import { BettingArea } from '@/components/features/wheel-of-fortune/betting-area';
import GameBoard from '@/components/features/wheel-of-fortune/game-board';
import { StockPriceDisplay } from '@/components/features/wheel-of-fortune/stock-price';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector } from '@/hooks/use-market-selector';
import { RoundRecord, RoundRecordGameType } from '@/models/round-record';
import { useGetRoundRecordById } from '@/react-query/round-record-queries';
import { useEffect, useMemo, useState } from 'react';


const WheelOfFortune = () => {
    const { marketSelected } = useMarketSelector();
    const [betAmount, setBetAmount] = useState<number>(100);
    const {
        roundRecord,
        isLoading
    } = useCurrentGame(RoundRecordGameType.WHEEL_OF_FORTUNE);

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (isSuccess) {
            console.log("round record refetched winningId", data.data.winningId);
        }
    }, [data]);

    useEffect(() => {
        if (!roundRecord) return;
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 2000;

        const timer = setTimeout(() => {
            console.log("refetching round record");
            refetch();
        }, resultFetchTime);
        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winningMarketId: number[] | null = useMemo(() => {
        if (!isSuccess) return null;
        if (roundRecord?.id == data?.data?.id) return (data.data as RoundRecord).winningId || null;
        return null;
    }, [data, isSuccess, roundRecord]);



    if (!marketSelected) return <MarketSelector className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Wheel of Fortune Market" />

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    return (
        <section className="flex flex-col  items-center justify-center min-h-[calc(100svh-100px)]">
            <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-gray-900 border border-gray-600 rounded-lg text-white overflow-hidden">
                <StockPriceDisplay roundRecord={roundRecord} winningMarketId={winningMarketId} />
                <GameBoard roundRecord={roundRecord} amount={betAmount}>
                    <TimeDisplay className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm  " roundRecord={roundRecord} />
                </GameBoard>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default WheelOfFortune;