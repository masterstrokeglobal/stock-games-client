"use client"

import CategoryCarousel from "@/components/features/casino-games/category-carousel"
import { CasinoProvidersCarousel } from "@/components/features/casino-games/game-providers"
import CasinoGameResult from "@/components/features/platform/casino-game-result"
import GameFilters, { Filter } from "@/components/features/platform/filters"
import { checkCasinoAllowed, COMPANYID } from "@/lib/utils"
import { GameTypeEnum } from "@/models/casino-games"
import { notFound, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function GamingAppInterface() {
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const provider = searchParams.get("provider") || "all";
    const type = searchParams.get("type");

    const popular = searchParams.get("popular") === "true" || false;
    const isNew = searchParams.get("new") === "true" || false;

    const [filter, setFilter] = useState<Filter>({
        search: search,
        category: category,
        provider: provider,
    });

    useEffect(() => {
        if (search) {
            setFilter({ ...filter, search: search })
        }
        if (category) {
            setFilter({ ...filter, category: category })
        }
        if (provider) {
            setFilter({ ...filter, provider: provider })
        }
        if (type) {
            setFilter({ ...filter, type: type })
        }
        console.log(filter, search, category, provider, type)
    }, [search, category, provider, type])


    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    if (!isCasinoAllowed) notFound();

    const areFiltersApplied = filter.search || filter.category !== "all" || filter.provider !== "all" || filter.type  || popular || isNew;

    console.log(filter, search, category, provider, type, popular, isNew)
    return (
        <>
            <main className="md:mx-auto w-full md:px-4 mt-4">
                {/* Search Bar */}

                <GameFilters filter={{
                    search: search,
                    category: category,
                    provider: provider,
                    type: type || undefined
                }} setFilter={setFilter} />
                {/* Content: Either search results or category carousels */}
                {areFiltersApplied ? (
                  <CasinoGameResult filter={{
                    search: search,
                    category: category,
                    provider: provider,
                    type: type || undefined,
                    popular: popular,
                    new: isNew
                  }} className="my-8" />
                ) : (
                    <div className="space-y-12">
                        {/* most popular games , ne games with emoji  */}
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
