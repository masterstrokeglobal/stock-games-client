"use client"

import CategoryCarousel from "@/components/features/casino-games/category-carousel"
import { CasinoProvidersCarousel } from "@/components/features/casino-games/game-providers"
import CasinoGameResult from "@/components/features/platform/casino-game-result"
import GameFilters, { Filter } from "@/components/features/platform/filters"
import useCasinoAllowed from "@/hooks/use-is-casino-allowed"
import { GameTypeEnum } from "@/models/casino-games"
import { useTranslations } from "next-intl"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

export default function GamingAppInterface() {
    const t = useTranslations("platform.casino-games");
    const searchParams = useSearchParams();

    // Build filter object from search params
    const filter = useMemo<Filter>(() => {
        return {
            search: searchParams.get("search") || "",
            category: searchParams.get("category") || "all",
            provider: searchParams.get("provider") || "all",
            type: searchParams.get("type") || undefined,
            popular: searchParams.get("popular") === "true" ? true : undefined,
            new: searchParams.get("new") === "true" ? true : undefined,
            providerOfWeek: searchParams.get("providerOfWeek") === "true" ? true : undefined,
            stockGameChoice: searchParams.get("stockGameChoice") === "true" ? true : undefined,
        }
        // Only recalculate when searchParams changes
    }, [searchParams]);

    // For updating the URL when filters change
    const router = useRouter();
    const setFilter = (newFilter: Filter) => {
        const params = new URLSearchParams();
        if (newFilter.search) params.set("search", newFilter.search);
        if (newFilter.category && newFilter.category !== "all") params.set("category", newFilter.category);
        if (newFilter.provider && newFilter.provider !== "all") params.set("provider", newFilter.provider);
        if (newFilter.type) params.set("type", newFilter.type);
        if (newFilter.popular) params.set("popular", "true");
        if (newFilter.new) params.set("new", "true");
        // If all filters are default, clear the query
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const { isLoading, isCasinoAllowed } = useCasinoAllowed();

    
    const areFiltersApplied =
    !!filter.search ||
    (filter.category && filter.category !== "all") ||
    (filter.provider && filter.provider !== "all") ||
    !!filter.type ||
    !!filter.popular ||
    !!filter.new || !!filter.providerOfWeek || !!filter.stockGameChoice;
    
    if (!isCasinoAllowed && !isLoading) notFound();
    return (
        <>
            <main className="md:mx-auto w-full md:px-4 mt-4">
                {/* Search Bar */}
                <GameFilters filter={filter} setFilter={setFilter} />
                {/* Content: Either search results or category carousels */}
                {areFiltersApplied ? (
                    <CasinoGameResult
                        filter={filter}
                        className="my-8"
                    />
                ) : (
                    <div className="space-y-12">
                        {/* most popular games , new games with emoji  */}
                        <CategoryCarousel title={t("hot-games")} popular={true} />
                        <CategoryCarousel title={t("crash-games")} type={GameTypeEnum.CRASH_GAME} />
                        <CategoryCarousel title={t("game-show")} type={GameTypeEnum.GAME_SHOW} />
                        <CategoryCarousel title={t("instant-win")} type={GameTypeEnum.INSTANT_WIN} />
                        <CategoryCarousel title={t("live-dealer")} type={GameTypeEnum.LIVE_DEALER} />
                        <CategoryCarousel title={t("table-games")} type={GameTypeEnum.TABLE_GAMES} />
                        <CategoryCarousel title={t("slots")} type={GameTypeEnum.SLOTS} />
                        <CategoryCarousel title={t("shooting")} type={GameTypeEnum.SHOOTING} />
                        <CategoryCarousel title={t("lottery")} type={GameTypeEnum.LOTTERY} />
                        <CategoryCarousel title={t("new-released")} new={true} />
                        <CasinoProvidersCarousel title={t("game-providers")} />
                    </div>
                )}
            </main>
        </>
    )
}
