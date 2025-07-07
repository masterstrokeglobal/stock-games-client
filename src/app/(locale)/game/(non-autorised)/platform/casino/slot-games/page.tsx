"use client"

import CasinoGameResult from "@/components/features/platform/casino-game-result"
import GameFilters, { Filter } from "@/components/features/platform/filters"
import { checkCasinoAllowed, COMPANYID } from "@/lib/utils"
import { notFound } from "next/navigation"
import { useState } from "react"

export default function SlotGamesPage() {
    const [filter, setFilter] = useState<Filter>({
        search: "",
        category: "all",
        provider: "all"
    });

    const isCasinoAllowed = checkCasinoAllowed(COMPANYID);

    if (!isCasinoAllowed) notFound();

    return (
        <div className="flex flex-col min-h-screen">
            <main className="container mx-auto mt-10 md:px-4 py-6">
                {/* Search Bar */}
                <GameFilters filter={filter} setFilter={setFilter} />
                <header className="container mx-auto  py-4">
                    <h1 className="text-2xl font-bold capitalize text-platform-text">Slot Games</h1>
                </header>

                {/* Content: Either search results or category carousels */}
                <CasinoGameResult filter={filter} />
            </main>
        </div>
    )
}
