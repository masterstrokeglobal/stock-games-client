"use client"

import GameGrid from "@/components/features/casino-games/game-grid"
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel"
import { Input } from "@/components/ui/input"
import { checkCasinoAllowed, COMPANYID, decodeUrlString } from "@/lib/utils"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"
import { Search } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import { useState } from "react"

export default function GamingAppInterface() {
    const [searchQuery, setSearchQuery] = useState("");
    const category = decodeUrlString(useParams().category as string);
    const { data: searchResults, isLoading: searchLoading } = useGetCasinoGames({
        search: searchQuery || undefined,
        category: category || undefined,
    })

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    if (!isCasinoAllowed || !category) notFound();
    
    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white">            
            <GameAdsCarousel /> 
            <main className="container mx-auto mt-20 px-4 py-6">
                {/* Search Bar */}
                <div className="relative mb-8 max-w-2xl mx-auto">
                    <div className="relative">
                        <Input
                            className="w-full bg-background-secondary focus:bg-background-secondary/80 border-transparent border-2 focus:border-game-secondary text-white placeholder:text-gray-400 pl-10 h-12 rounded-full"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
                <header className="container mx-auto  py-4">
                <h1 className="text-2xl font-bold capitalize">{category.toString().split("_").join(" ")}</h1>
            </header>

                {/* Content: Either search results or category carousels */}
                {searchQuery ? (
                    <div className="mt-8">
                        {searchLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <GameGrid games={searchResults?.games || []} />
                        )}
                    </div>
                ) : (
                    <GameGrid games={searchResults?.games || []} />
                )}
            </main>
        </div>
    )
}
