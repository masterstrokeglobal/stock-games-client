"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import TimeDisplay from '@/components/features/7-up-down/BetLockedBanner';
import { BettingArea } from '@/components/features/coin-head-tail/betting-area';
import GameBoard from '@/components/features/coin-head-tail/game-board';
import { StockPriceDisplay } from '@/components/features/coin-head-tail/stock-price';
import { useCurrentGame } from '@/hooks/use-current-game';
import { HeadTailPlacementType } from '@/models/head-tail';
import { RoundRecordGameType } from '@/models/seven-up-down';
import {  useGetRoundRecordById } from '@/react-query/round-record-queries';
import { useEffect, useMemo, useState } from 'react';

const CoinHeadTail = () => {
    const [betAmount, setBetAmount] = useState<number>(100);
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.HEAD_TAIL);

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (!roundRecord) return;
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 3000;
       
        const timer = setTimeout(() => {
            refetch();
        }, resultFetchTime);
        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);
  
    const winningSide : HeadTailPlacementType | null = useMemo(() => {
      if (!isSuccess) return null;

      console.log(roundRecord?.id == data?.data?.id)
      if (roundRecord?.id == data?.data?.id) return data.data?.winningSide;
      return null;
    }, [data, isSuccess, roundRecord]);

  
    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />
    return (
        <section className="flex flex-col  items-center justify-center min-h-[calc(100svh-100px)]">
            <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-gray-900 border border-gray-600 rounded-lg text-white overflow-hidden">
                <StockPriceDisplay roundRecord={roundRecord} winningSide={winningSide} />
                <GameBoard roundRecord={roundRecord} amount={betAmount}>
                    <TimeDisplay className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm  " roundRecord={roundRecord} />
                </GameBoard>
                <BettingArea betAmount={betAmount} setBetAmount={setBetAmount} roundRecord={roundRecord} />
            </div>
        </section>
    );
};

export default CoinHeadTail;
