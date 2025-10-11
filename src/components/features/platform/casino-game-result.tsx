"use client"

import GameGrid from "@/components/features/casino-games/game-grid"
import { cn } from "@/lib/utils"
import { GameCategories, ProviderEnum } from "@/models/casino-games"
import { useInfiniteGetCasinoGames } from "@/react-query/casino-games-queries"
import { notFound } from "next/navigation"
import { Filter } from "./filters"
import useCasinoAllowed from "@/hooks/use-is-casino-allowed"
import { useEffect, useRef } from "react"

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
        stockGameChoice:filter.stockGameChoice,
        providerOfWeek:filter.providerOfWeek,
        category: filter.category === "all" ? undefined : (filter.category as (typeof GameCategories)[number]["value"]),
        provider: filter.provider === "all" ? undefined : (filter.provider as ProviderEnum),
        subProvider: filter.subProvider as ProviderEnum | undefined,
        limit: 30,
        popular: filter.popular,
        new: filter.new
    });

    const { isLoading, isCasinoAllowed } = useCasinoAllowed();
    if (!isCasinoAllowed && !isLoading) notFound();

    // Calculate shown and total
    const shown = searchResults?.pages.reduce((acc, page) => acc + (page.games?.length || 0), 0) || 0;
    const total = searchResults?.pages[0]?.count || 0;

    // Infinite scroll setup
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMoreElement = loadMoreRef.current;
        if (!loadMoreElement || !hasNextPage || isFetchingNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    fetchNextPage();
                }
            },
            {
                threshold: 0.5, // Trigger when 50% of the element is visible (center of screen)
                rootMargin: '0px 0px 100px 0px' // Start loading 100px before the element comes into view
            }
        );

        observer.observe(loadMoreElement);

        return () => {
            observer.disconnect();
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
                    <div className="relative h-2 dark:bg-[#23245A] bg-white rounded-full overflow-hidden">
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
                
                {/* Infinite scroll trigger element */}
                {hasNextPage && (
                    <div ref={loadMoreRef} className="w-full h-4 flex justify-center items-center">
                        {isFetchingNextPage && (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-game"></div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
