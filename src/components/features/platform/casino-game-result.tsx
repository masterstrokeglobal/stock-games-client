"use client"

import GameGrid from "@/components/features/casino-games/game-grid"
import { Button } from "@/components/ui/button"
import { checkCasinoAllowed, cn, COMPANYID } from "@/lib/utils"
import { GameCategories, ProviderEnum } from "@/models/casino-games"
import { useInfiniteGetCasinoGames } from "@/react-query/casino-games-queries"
import { notFound } from "next/navigation"
import { Filter } from "./filters"

export default function CasinoGameResult({ filter, className }: { filter: Filter, className?: string }) {
    const {
        data: searchResults,
        isLoading: searchLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteGetCasinoGames({
        search: filter.search || undefined,
        type: filter.type || undefined,
        category: filter.category === "all" ? undefined : (filter.category as (typeof GameCategories)[number]["value"]),
        provider: filter.provider === "all" ? undefined : (filter.provider as ProviderEnum),
        limit: 30
    });

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);
    if (!isCasinoAllowed) notFound();

    // Calculate shown and total
    const shown = searchResults?.pages.reduce((acc, page) => acc + (page.games?.length || 0), 0) || 0;
    const total = searchResults?.pages[0]?.count || 0;

    return (
        <>
            <div className={cn("mt-8", className)}>
                {searchLoading || isFetchingNextPage ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <GameGrid games={searchResults?.pages.flatMap((page) => page.games) || []} />
                )}
            </div>
            <div className="flex flex-col items-center mt-12 mb-8">
                <div className="w-full max-w-xs mb-2">
                    <div className="relative h-2 bg-[#23245A] rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-2 dark:bg-[#4B53E2] bg-[#64B6FD] rounded-full transition-all"
                            style={{
                                width: total > 0 ? `${(shown / total) * 100}%` : "0%"
                            }}
                        />
                    </div>
                </div>
                <div className="text-lg text-platform-text  font-medium mb-4">
                    {`Showing ${shown} of ${total}`}
                </div>
                {hasNextPage && (
                    <Button
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="border border-platform-border rounded-none dark:bg-transparent bg-primary-game text-platform-text hover:bg-primary-game"
                    >
                        {isFetchingNextPage ? "Loading..." : "Show more"}
                    </Button>
                )}
            </div>
        </>
    );
}
