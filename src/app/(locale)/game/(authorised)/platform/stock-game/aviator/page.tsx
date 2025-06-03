"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import StockSelectorAviator from '@/components/common/stock-selector-aviator';
import Aviator from '@/components/features/aviator/aviator';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector, useStockSelectorAviator } from '@/hooks/use-market-selector';
import { RoundRecordGameType } from '@/models/round-record';

const StockSlot = () => {
    const { marketSelected } = useMarketSelector();
    const { stockSelectedAviator } = useStockSelectorAviator();
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.AVIATOR);


    if (!marketSelected) return <MarketSelector variant='aviator' className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Avaiator" />
    
    if (isLoading || !roundRecord) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />


    if (stockSelectedAviator == null) return <StockSelectorAviator roundRecord={roundRecord} className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Stock Selector Avaiator" />

    return (
            <Aviator className='-mx-4 md:-mx-12 -mt-5' />
    );
};

export default StockSlot;
