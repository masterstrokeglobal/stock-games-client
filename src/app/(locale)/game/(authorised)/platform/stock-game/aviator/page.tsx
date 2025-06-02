"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector, useStockSelectorAviator } from '@/hooks/use-market-selector';
import { RoundRecordGameType } from '@/models/round-record';
import { useState } from 'react';
import StockSelectorAviator from '@/components/common/stock-selector-aviator';
import Aviator from '@/components/features/aviator/aviator';

const StockSlot = () => {
    const { marketSelected, setMarketSelected } = useMarketSelector();
    const { stockSelectedAviator, setStockSelectedAviator } = useStockSelectorAviator();
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.STOCK_JACKPOT);

    const [betAmount, setBetAmount] = useState<number>(100);

    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    if (!marketSelected) return <MarketSelector variant='aviator' className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Avaiator" />
    
    if (!stockSelectedAviator) return <StockSelectorAviator className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Stock Selector Avaiator" />

    return (
        <section className="min-h-[calc(100svh-70px)]">
            <Aviator />
        </section>
    );
};

export default StockSlot;
