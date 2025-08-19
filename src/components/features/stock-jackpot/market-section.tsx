"use client"

import { BettingCard } from "@/components/features/stock-jackpot/betting-card"
import JackpotResultDialog from "@/components/features/stock-jackpot/game-result"
import TimeDisplay from "@/components/features/stock-jackpot/time-left"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCurrentGame, useIsPlaceOver, useShowResults } from "@/hooks/use-current-game"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import { RoundRecordGameType } from "@/models/round-record"
import { useGetMyStockJackpotGameRecord } from "@/react-query/game-record-queries"
import { CSSProperties, useMemo } from "react"

const MarketSection = ({ globalBetAmount, className }: { globalBetAmount: number, className?: string }) => {
    const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
    const { data: stockSlotPlacements } = useGetMyStockJackpotGameRecord(roundRecord?.id);
    const { showResults, previousRoundId } = useShowResults(roundRecord, stockSlotPlacements as any);
    const isPlacementOver = useIsPlaceOver(roundRecord);
    const { isDesktop } = useWindowSize();

    const sortedMarketItems = useMemo(() => {
        const filteredMarketItems = roundRecord?.market.sort((a, b) => (a.id || 0) - (b.id || 0))

        if (isPlacementOver) {
            const placedMarketItems = stockSlotPlacements?.map((placement) => placement.marketItem.id ?? 0);
            return filteredMarketItems?.filter((marketItem) => placedMarketItems?.includes(marketItem.id ?? 0));
        }
        return filteredMarketItems;
    }, [roundRecord, isPlacementOver, stockSlotPlacements]);



    if (!roundRecord) return <div className="text-center py-8 text-gray-400 bg-primary/5 rounded-lg border border-primary/10">No markets found matching your search.</div>

    return (
        <div className={cn("relative w-full", className)}>
            <div className="flex lg:justify-between justify-center mx-auto w-full gap-4">
                {/* Left side: first 7 market items */}
                {isDesktop && <div className="flex flex-col relative z-20 gap-2 bg-[#195A6D] bg-opacity-55 backdrop-blur-sm rounded-r-md overflow-hidden w-full max-w-[300px]">
                    {(sortedMarketItems?.length ?? 0) > 0 ? sortedMarketItems?.slice(0, 7).map((marketItem) => (
                        <BettingCard
                            key={marketItem.id}
                            skew="right"
                            roundRecord={roundRecord}
                            globalBetAmount={globalBetAmount}
                            marketItem={marketItem}
                            className="w-full bg-transparent"
                        />
                    )) : (
                        <div className="text-center text-gray-400 h-full rounded-lg border p-2 ">No Bets were Placed.</div>
                    )}
                </div>}
                <div className="md:flex hidden flex-col items-center w-fit min-w-[300px] justify-start sm:gap-6 gap-2">
                    <div className="flex justify-center flex-col gap-2 items-center">
                        {roundRecord && <TimeDisplay className="mb-8" roundRecord={roundRecord} />}
                    </div>
                </div>
                {isDesktop &&
                    <div className={cn("flex flex-col gap-2 relative z-20 bg-[#195A6D] bg-opacity-55 backdrop-blur-sm rounded-l-md overflow-hidden w-full max-w-[300px]", !sortedMarketItems || sortedMarketItems.length <= 7 ? "h-0" : "")}>
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

export const MarketSectionMobile = ({ globalBetAmount, className, styles }: { globalBetAmount: number, className?: string, styles?: CSSProperties }) => {
    const { roundRecord } = useCurrentGame(RoundRecordGameType.STOCK_SLOTS);
    const { data: stockSlotPlacements } = useGetMyStockJackpotGameRecord(roundRecord?.id);
    const isPlacementOver = useIsPlaceOver(roundRecord);

    const sortedMarketItems = useMemo(() => {
        const filteredMarketItems = roundRecord?.market.sort((a, b) => (a.id || 0) - (b.id || 0))

        if (isPlacementOver) {
            const placedMarketItems = stockSlotPlacements?.map((placement) => placement.marketItem.id ?? 0);
            return filteredMarketItems?.filter((marketItem) => placedMarketItems?.includes(marketItem.id ?? 0));
        }
        return filteredMarketItems ?? [];
    }, [roundRecord, isPlacementOver, stockSlotPlacements]);


    return <ScrollArea style={styles} className={cn("flex flex-col gap-2 bg-[#195A6D] z-10 border-[#7DE2FF75] border rounded-xl", className)}>
        {roundRecord && (sortedMarketItems?.length ?? 0) > 0 && sortedMarketItems?.map((marketItem) => (
            <BettingCard
                key={marketItem.id}
                roundRecord={roundRecord}
                globalBetAmount={globalBetAmount}
                marketItem={marketItem}
                className="w-full bg-transparent"
            />
        ))}

        {(sortedMarketItems?.length ?? 0) === 0 && (
            <div className="text-center text-gray-400 h-full flex justify-center p-2 items-center">No Bets were Placed.</div>
        )}
    </ScrollArea>
}

export default MarketSection;