"use client"

import GameCard from "@/components/features/casino-games/game-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GameCategories, ProviderEnum } from "@/models/casino-games"
import { useInfiniteGetCasinoGames } from "@/react-query/casino-games-queries"
import { notFound } from "next/navigation"
import { Filter } from "./filters"
import useCasinoAllowed from "@/hooks/use-is-casino-allowed"

export default function GapGameResult({ filter, className }: { filter: Filter, className?: string }) {
    const {
        data: searchResults,
        isLoading: searchLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteGetCasinoGames({
        search: filter.search || undefined,
        type: filter.type || undefined,
        stockGameChoice: filter.stockGameChoice,
        providerOfWeek: filter.providerOfWeek,
        category: filter.category === "all" ? undefined : (filter.category as (typeof GameCategories)[number]["value"]),
        provider: filter.provider === "all" ? undefined : (filter.provider as ProviderEnum),
        // Gap-specific filters
        providerCompany: "gap",
        subProvider: ProviderEnum.mac88,
        limit: 30,
        popular: filter.popular,
        new: filter.new
    });

    const { isLoading, isCasinoAllowed } = useCasinoAllowed();
    if (!isCasinoAllowed && !isLoading) notFound();

    // Calculate shown and total
    const shown = searchResults?.pages.reduce((acc, page) => acc + (page.games?.length || 0), 0) || 0;
    const total = searchResults?.pages[0]?.count || 0;

    // Custom gap game grid with proper thumbnail sizing
    const GapGameGrid = ({ games }: { games: any[] }) => {
        if (games.length === 0) {
            return (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400 text-lg">No gap games found</p>
                </div>
            )
        }

        return (
            <div className="grid xs:grid-cols-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-6 gap-3">
                {games.map((game) => (
                    <GameCard 
                        key={game.id} 
                        game={game} 
                        className="aspect-[5/3]" // Gap-specific thumbnail size
                    />
                ))}
            </div>
        )
    }

    return (
        <>
            <div className={cn("mt-8", className)}>
                {searchLoading || isFetchingNextPage ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <GapGameGrid games={searchResults?.pages.flatMap((page) => page.games) || []} />
                )}
            </div>
            <div className="flex flex-col items-center mt-12 mb-8">
                <div className="w-full max-w-xs mb-2">
                    <div className="relative h-2 dark:bg-[#23245A] bg-white rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-2 dark:bg-[#4B53E2] bg-[#64B6FD] rounded-full transition-all"
                            style={{
                                width: total > 0 ? `${(shown / total) * 100}%` : "0%"
                            }}
                        />
                    </div>
                </div>
                <div className="text-lg text-platform-text font-medium mb-4">
                    {`Showing ${shown} of ${total} gap games`}
                </div>
                {hasNextPage && (
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="border border-primary-game dark:border-platform-border bg-white rounded-none dark:bg-transparent hover:bg-primary-game text-platform-text dark:hover:bg-platform-border"
                    >
                        {isFetchingNextPage ? "Loading..." : "Show more"}
                    </Button>
                )}
            </div>
        </>
    );
}
