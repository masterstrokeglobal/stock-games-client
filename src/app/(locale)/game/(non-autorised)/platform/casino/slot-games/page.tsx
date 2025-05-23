"use client"

import GameGrid from "@/components/features/casino-games/game-grid"
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel"
import { Input } from "@/components/ui/input"
import { checkCasinoAllowed, COMPANYID } from "@/lib/utils"
import { ProviderEnum } from "@/models/casino-games"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"
import { Search } from "lucide-react"
import { notFound } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { GameCategories } from "@/models/casino-games"

export default function SlotGamesPage() {
    const [filter, setFilter] = useState({
        search: "",
        category: "all",
        provider: "all"
    });
    const { data: searchResults, isLoading: searchLoading } = useGetCasinoGames({
        search: filter.search || undefined,
        slot: true,
        category: filter.category == "all" ? undefined : filter.category,
        provider: filter.provider == "all" ? undefined : filter.provider,
        limit: 100
    })

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    if (!isCasinoAllowed) notFound();

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white">
            <GameAdsCarousel />
            <main className="container mx-auto mt-20 px-4 py-6">
                {/* Search Bar */}
                <div className="relative mb-8  mx-auto flex flex-col md:flex-row justify-start gap-2">
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
                <header className="container mx-auto  py-4">
                    <h1 className="text-2xl font-bold capitalize">Slot Games</h1>
                </header>

                {/* Content: Either search results or category carousels */}
                <div className="mt-8">
                    {searchLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <GameGrid games={searchResults?.games || []} />
                    )}
                </div>
            </main>
        </div>
    )
}
