"use client"

import CasinoGameResult from "@/components/features/platform/casino-game-result"
import GameFilters, { Filter } from "@/components/features/platform/filters"
import useCasinoAllowed from "@/hooks/use-is-casino-allowed"
import { useTranslations } from "next-intl"
import { notFound } from "next/navigation"
import { useState } from "react"

export default function SlotGamesPage() {
    const t = useTranslations("platform.casino-games");
    const [filter, setFilter] = useState<Filter>({
        search: "",
        category: "all",
        provider: "all"
    });

    const { isLoading, isCasinoAllowed } = useCasinoAllowed();

    if (!isCasinoAllowed && !isLoading) notFound();

    return (
        <div className="flex flex-col min-h-screen">
            <main className="container mx-auto mt-4 md:px-4 pb-6">
                {/* Search Bar */}
                <GameFilters filter={filter} setFilter={setFilter} />
                <header className="container mx-auto  py-2">
                        <h1 className="text-2xl font-bold capitalize text-platform-text">{t("title")}</h1>
                </header>

                {/* Content: Either search results or category carousels */}
                <CasinoGameResult filter={filter} />
            </main>
        </div>
    )
}
