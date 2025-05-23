"use client"

import CategoryCarousel from "@/components/features/casino-games/category-carousel"
import GameGrid from "@/components/features/casino-games/game-grid"
import CasinoProviders from "@/components/features/casino-games/game-providers"
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkCasinoAllowed, COMPANYID } from "@/lib/utils"
import { GameCategories, GameCategory, ProviderEnum } from "@/models/casino-games"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"
import { Search } from "lucide-react"
import { notFound, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Filter = {
    search: string;
    category?: string;
    platform?: string;
    provider?: string;
}
export default function GamingAppInterface() {
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const provider = searchParams.get("provider") || "all";


    const [filter, setFilter] = useState<Filter>({
        search: search,
        category: category,
        provider: provider
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
    }, [search, category, provider])

    const { data: searchResults, isLoading: searchLoading } = useGetCasinoGames({
        search: filter.search || undefined,
        category: filter.category == "all" ? undefined : filter.category,
        provider: filter.provider == "all" ? undefined : filter.provider,
        limit: 100
    })

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    if (!isCasinoAllowed) notFound();

    console.log(filter)
    const areFiltersApplied = filter.search || filter.category !== "all" || filter.provider !== "all";

    console.log(areFiltersApplied)
    return (
        <>
            <GameAdsCarousel />
            <main className="container md:mx-auto w-full mt-20">
                {/* Search Bar */}
                <div className="relative mb-8  md:mx-auto w-full flex flex-col md:flex-row justify-start gap-2">
                    <div className="relative max-w-2xl w-full">
                        <Input
                            className="w-full bg-background-secondary focus:bg-background-secondary/80 border-transparent border-2 focus:border-game-secondary text-white placeholder:text-gray-400 h-12 pl-10 rounded-full"
                            placeholder="Search games..."
                            value={filter.search}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>

                    <Select onValueChange={(value) => setFilter({ ...filter, category: value })} value={filter.category}>
                        <SelectTrigger className="w-full md:max-w-40 bg-background-secondary focus:bg-background-secondary/80 border-transparent border-2 focus:border-game-secondary text-white placeholder:text-gray-400  h-12 rounded-full">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background-secondary rounded-xl border-game-secondary">
                            <SelectItem value="all" className="text-white">All</SelectItem>
                            {GameCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value} className="text-white capitalize">{category.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* platforms  */}
                    <Select onValueChange={(value) => setFilter({ ...filter, provider: value })} value={filter.provider}>
                        <SelectTrigger className="w-full md:max-w-40 bg-background-secondary focus:bg-background-secondary/80 border-transparent border-2 focus:border-game-secondary text-white placeholder:text-gray-400  h-12 rounded-full">
                            <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-background-secondary rounded-xl border-game-secondary">
                            <SelectItem value="all" className="text-white">All</SelectItem>
                            {Object.values(ProviderEnum).map((platform) => (
                                <SelectItem key={platform} value={platform} className="text-white capitalize">{platform.split("_").join(" ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Content: Either search results or category carousels */}
                {areFiltersApplied ? (
                    <div className="mt-8">
                        <h2 className="md:text-2xl text-xl font-bold mb-6">Search Results</h2>
                        {searchLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <GameGrid games={searchResults?.games || []} />
                        )}
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* most popular games , ne games with emoji  */}
                        <CategoryCarousel title="🔥 Hot Games" popular={true} />
                        <CategoryCarousel title="🎲 Table Games" categoryId={GameCategory["Table game"]} />
                        <CategoryCarousel title="🎰 Casino Games" categoryId={GameCategory["Live Dealer"]} />
                        <CategoryCarousel title="🆕 New Games" new={true} />
                        <CasinoProviders />
                    </div>
                )}
            </main>
        </>
    )
}
