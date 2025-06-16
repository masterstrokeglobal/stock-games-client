"use client"
import GameLoadingScreen from '@/components/common/game-loading-screen';
import MarketSelector from '@/components/common/market-selector';
import Aviator from '@/components/features/aviator/aviator';
import { useCurrentGame } from '@/hooks/use-current-game';
import { useMarketSelector, useStockSelectorAviator } from '@/hooks/use-market-selector';
import { MarketItem } from '@/models/market-item';
import { RoundRecordGameType } from '@/models/round-record';
import { useAviatorToken } from '@/react-query/aviator-queries';
import { useEffect, useMemo } from 'react';
const StockSlot = () => {
    const { marketSelected } = useMarketSelector();
    const { stockSelectedAviator, setStockSelectedAviator } = useStockSelectorAviator();
    const { roundRecord, isLoading } = useCurrentGame(RoundRecordGameType.AVIATOR);
    const { isLoading: isTokenLoading, data: token } = useAviatorToken();

    const isStockPresent = useMemo(() => {
        const isStockPresent = roundRecord?.market.some((item: MarketItem) => item.id == Number(stockSelectedAviator)) ?? false;
        return isStockPresent;
    }, [roundRecord, stockSelectedAviator]);

    // Automatically select the first stock when market is selected and roundRecord is available
    useEffect(() => {
        if (marketSelected && roundRecord && roundRecord.market.length > 0 && !stockSelectedAviator) {
            const firstStock = roundRecord.market[0];
            if (firstStock.id) {
                setStockSelectedAviator(firstStock.id.toString());
            }
        }
    }, [marketSelected, roundRecord, stockSelectedAviator, setStockSelectedAviator]);

    if (!marketSelected) return <MarketSelector variant='aviator' className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Avaiator" />

    if (isLoading || !roundRecord || isTokenLoading || token == null) return <GameLoadingScreen className='min-h-[calc(100svh-100px)]' />

    // if (stockSelectedAviator == null || !isStockPresent) return <StockSelectorAviator token={token} roundRecord={roundRecord} className='min-h-[calc(100svh-100px)] max-w-2xl mx-auto' title="Stock Selector Avaiator" />

    if (stockSelectedAviator !== null || isStockPresent) return <Aviator className='-mx-4 md:-mx-12 -mt-5' roundRecord={roundRecord} token={token} />

    return <></>
};

export default StockSlot;
