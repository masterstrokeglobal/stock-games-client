"use client"

import { BettingCard } from "@/components/features/stock-jackpot/betting-card"
import JackpotResultDialog from "@/components/features/stock-jackpot/game-result"
import TimeDisplay from "@/components/features/stock-jackpot/time-left"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/context/auth-context"
import useCOMEXAvailable from "@/hooks/use-comex-available"
import { useCurrentGame, useShowResults } from "@/hooks/use-current-game"
import useMCXAvailable from "@/hooks/use-mcx-available"
import useNSEAvailable from "@/hooks/use-nse-available"
import useUSAMarketAvailable from "@/hooks/use-usa-available"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import { SchedulerType } from "@/models/market-item"
import { RoundRecordGameType } from "@/models/round-record"
import User from "@/models/user"
import { useGetMyFavorites } from "@/react-query/favorite-market-item-queries"
import { useGetMyStockJackpotGameRecord } from "@/react-query/game-record-queries"
import { useMemo } from "react"

const MarketSection = ({ globalBetAmount, className }: { globalBetAmount: number, className?: string }) => {
    const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
    const { data: stockSlotPlacements } = useGetMyStockJackpotGameRecord(roundRecord?.id);
    const { showResults, previousRoundId } = useShowResults(roundRecord, stockSlotPlacements as any);
    const { isDesktop } = useWindowSize();

    const { data: myFavorites } = useGetMyFavorites();
    const sortedMarketItems = useMemo(() => {
        const filteredMarketItems = roundRecord?.market.sort((a, b) => (a.id || 0) - (b.id || 0))
        return filteredMarketItems?.sort((a, b) => {
            if (!a.id || !b.id) return 0;
            const aFavorite = myFavorites?.includes(a.id);
            const bFavorite = myFavorites?.includes(b.id);
            return !bFavorite ? -1 : !aFavorite ? 1 : 0;
        });
    }, [roundRecord, myFavorites]);

    const { userDetails } = useAuthStore();
    const currentUser = userDetails as User;

    const isNSEAvailable = useNSEAvailable();
    const isUSAMarketAvailable = useUSAMarketAvailable();
    const isMCXAvailable = useMCXAvailable();
    const isComexAvailable = useCOMEXAvailable();

    const isNSEAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.NSE);
    const isUSAMarketAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.USA_MARKET);
    const isMCXAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.MCX);
    const isCOMEXAllowed = !currentUser.isNotAllowedToPlaceOrder(SchedulerType.COMEX);

    if (!roundRecord) return <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">No markets found matching your search.</div>

    return (
        <div className={cn("relative w-full", className)}>

            <div className="flex lg:justify-between justify-center mx-auto w-full gap-4 mt-6">
                {/* Left side: first 7 market items */}
                {isDesktop && <div className="flex flex-col gap-2 bg-[#195A6D] bg-opacity-55 backdrop-blur-sm rounded-r-md overflow-hidden w-full max-w-[300px]">
                    {sortedMarketItems?.slice(0, 7).map((marketItem) => (
                        <BettingCard
                            key={marketItem.id}
                            skew="right"
                            roundRecord={roundRecord}
                            globalBetAmount={globalBetAmount}
                            marketItem={marketItem}
                            className="w-full bg-transparent"
                        />
                    ))}
                </div>}
                <div className="flex flex-col items-center w-fit min-w-[300px] justify-start sm:gap-6 gap-2">
                    <div className="flex justify-center mt-4 flex-col gap-2 items-center">
                        {roundRecord && <TimeDisplay className="mb-8" roundRecord={roundRecord} />}
                    </div>
                    <div className="flex justify-between relative z-20 flex-col md:flex-row items-start ">
                        <TabsList className="w-full md:max-w-md grid grid-cols-2 gap-2  p-1 rounded-lg">
                            <TabsTrigger
                                value={SchedulerType.NSE}
                                disabled={!isNSEAllowed || !isNSEAvailable}
                                className={`w-full rounded-lg font-spacemono transition-colors ${
                                    (!isNSEAllowed || !isNSEAvailable) 
                                        ? 'text-white' 
                                        : 'data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#B0FF2A] data-[state=active]:to-[#3E8100] data-[state=active]:text-white data-[state=inactive]:bg-[#002C3E] data-[state=inactive]:text-white'
                                }`}
                                style={(!isNSEAllowed || !isNSEAvailable) ? {
                                    background: 'linear-gradient(0deg, #B80033 0%, #C42C65 100%)'
                                } : undefined}
                            >
                                NSE
                            </TabsTrigger>
                            <TabsTrigger
                                value={SchedulerType.USA_MARKET}
                                disabled={!isUSAMarketAllowed || !isUSAMarketAvailable}
                                className={`w-full rounded-lg font-spacemono transition-colors ${
                                    (!isUSAMarketAllowed || !isUSAMarketAvailable) 
                                        ? 'text-white' 
                                        : 'data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#B0FF2A] data-[state=active]:to-[#3E8100] data-[state=active]:text-white data-[state=inactive]:bg-[#002C3E] data-[state=inactive]:text-white'
                                }`}
                                style={(!isUSAMarketAllowed || !isUSAMarketAvailable) ? {
                                    background: 'linear-gradient(0deg, #B80033 0%, #C42C65 100%)'
                                } : undefined}
                            >
                                US Stock
                            </TabsTrigger>
                            {isMCXAllowed && (
                                <TabsTrigger
                                    value={SchedulerType.MCX}
                                    disabled={!isMCXAllowed || !isMCXAvailable}
                                    className={`w-full rounded-lg font-spacemono transition-colors ${
                                        (!isMCXAllowed || !isMCXAvailable) 
                                            ? 'text-white' 
                                            : 'data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#B0FF2A] data-[state=active]:to-[#3E8100] data-[state=active]:text-white data-[state=inactive]:bg-[#002C3E] data-[state=inactive]:text-white'
                                    }`}
                                    style={(!isMCXAllowed || !isMCXAvailable) ? {
                                        background: 'linear-gradient(0deg, #B80033 0%, #C42C65 100%)'
                                    } : undefined}
                                >
                                    MCX
                                </TabsTrigger>
                            )}
                            {isCOMEXAllowed && (
                                <TabsTrigger
                                    value={SchedulerType.COMEX}
                                    disabled={!isCOMEXAllowed || !isComexAvailable}
                                    className={`w-full rounded-lg font-spacemono transition-colors ${
                                        (!isCOMEXAllowed || !isComexAvailable) 
                                            ? 'text-white' 
                                            : 'data-[state=active]:bg-gradient-to-b data-[state=active]:from-[#B0FF2A] data-[state=active]:to-[#3E8100] data-[state=active]:text-white data-[state=inactive]:bg-[#002C3E] data-[state=inactive]:text-white'
                                    }`}
                                    style={(!isCOMEXAllowed || !isComexAvailable) ? {
                                        background: 'linear-gradient(0deg, #B80033 0%, #C42C65 100%)'
                                    } : undefined}
                                >
                                    International
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </div>
                </div>
                {isDesktop &&
                    <div className={cn("flex flex-col gap-2 bg-[#195A6D] bg-opacity-55 backdrop-blur-sm rounded-l-md overflow-hidden w-full max-w-[300px]", !sortedMarketItems || sortedMarketItems.length <= 7 ? "h-0" : "")}>
                        {sortedMarketItems?.slice(7, 14).map((marketItem) => (
                            <BettingCard
                                key={marketItem.id}
                                skew="left"
                                roundRecord={roundRecord}
                                globalBetAmount={globalBetAmount}
                                marketItem={marketItem}
                                className="w-full bg-transparent"
                            />
                        ))}
                    </div>}
            </div>


            {previousRoundId && (
                <JackpotResultDialog
                    key={showResults?.toString()}
                    open={showResults}
                    roundRecordId={previousRoundId}
                />
            )}
        </div>
    )
}

export const MarketSectionMobile = ({ globalBetAmount, className }: { globalBetAmount: number, className?: string }) => {
    const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);

    const { data: myFavorites } = useGetMyFavorites();
    const sortedMarketItems = useMemo(() => {
        const filteredMarketItems = roundRecord?.market.sort((a, b) => (a.id || 0) - (b.id || 0))
        return filteredMarketItems?.sort((a, b) => {
            if (!a.id || !b.id) return 0;
            const aFavorite = myFavorites?.includes(a.id);
            const bFavorite = myFavorites?.includes(b.id);
            return !bFavorite ? -1 : !aFavorite ? 1 : 0;
        });
    }, [roundRecord, myFavorites]);


    return <ScrollArea className={cn("flex flex-col gap-2 h-[50svh] bg-[#195A6D] z-10 border-[#7DE2FF75] border rounded-xl", className)}>
        {roundRecord && sortedMarketItems?.map((marketItem) => (
            <BettingCard
                key={marketItem.id}
                roundRecord={roundRecord}
                globalBetAmount={globalBetAmount}
                marketItem={marketItem}
                className="w-full bg-transparent"
            />
        ))}
    </ScrollArea>
}

export default MarketSection;