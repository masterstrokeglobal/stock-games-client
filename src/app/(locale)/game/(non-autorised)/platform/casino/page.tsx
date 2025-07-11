"use client"

import CategoryCarousel from "@/components/features/casino-games/category-carousel"
import { CasinoProvidersCarousel } from "@/components/features/casino-games/game-providers"
import CasinoGameResult from "@/components/features/platform/casino-game-result"
import GameFilters, { Filter } from "@/components/features/platform/filters"
import { checkCasinoAllowed, COMPANYID } from "@/lib/utils"
import { GameTypeEnum } from "@/models/casino-games"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

export default function GamingAppInterface() {
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

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    if (!isCasinoAllowed) notFound();

    const areFiltersApplied =
        !!filter.search ||
        (filter.category && filter.category !== "all") ||
        (filter.provider && filter.provider !== "all") ||
        !!filter.type ||
        !!filter.popular ||
        !!filter.new;

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
                        <CategoryCarousel title="Hot Games" popular={true} />
                        <CategoryCarousel title=" Crash Games" type={GameTypeEnum.CRASH_GAME} />
                        <CategoryCarousel title="Game Show" type={GameTypeEnum.GAME_SHOW} />
                        <CategoryCarousel title="Instant Win" type={GameTypeEnum.INSTANT_WIN} />
                        <CategoryCarousel title="Live Dealer" type={GameTypeEnum.LIVE_DEALER} />
                        <CategoryCarousel title="Table Games" type={GameTypeEnum.TABLE_GAMES} />
                        <CategoryCarousel title="Slots" type={GameTypeEnum.SLOTS} />
                        <CategoryCarousel title="Shooting" type={GameTypeEnum.SHOOTING} />
                        <CategoryCarousel title="Lottery" type={GameTypeEnum.LOTTERY} />
                        <CategoryCarousel title="New Released" new={true} />
                        <CasinoProvidersCarousel title="Game Providers" />
                    </div>
                )}
            </main>
        </>
    )
}
