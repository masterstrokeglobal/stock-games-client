"use client"

import { Filter } from "@/components/features/platform/filters"
import GapGameResult from "@/components/features/platform/gap-game-result"
import { Input } from "@/components/ui/input"
import useCasinoAllowed from "@/hooks/use-is-casino-allowed"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { useMemo } from "react"

export default function GapGamingInterface() {
    const t = useTranslations("platform.casino-games");
    const searchParams = useSearchParams();

    // Build filter object from search params - focused on gap games
    const filter = useMemo<Filter>(() => {
        return {
            search: searchParams.get("search") || ""
        }
    }, [searchParams]);

    // For updating the URL when filters change
    const router = useRouter();
    const setFilter = (newFilter: Filter) => {
        const params = new URLSearchParams();
        if (newFilter.search) params.set("search", newFilter.search);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const { isLoading, isCasinoAllowed } = useCasinoAllowed();

    if (!isCasinoAllowed && !isLoading) notFound();

    return (
        <>
            <main className="md:mx-auto w-full md:px-4 mt-4">
                {/* Search Bar */}
                <div className="relative mb-8 md:mx-auto w-full">
                    {/* Mobile layout */}
                    <div className="flex  flex-row items-center gap-2 w-full">
                        <div className="relative flex-1">
                            <Input
                                className="w-full bg-primary-game border border-platform-border ring-0 focus:bg-primary-game/80 focus:border-platform-border text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 pl-10 pr-12 rounded-none"
                                placeholder={t("search-games")}
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 dark:text-gray-400" size={20} />
                        </div>
                    </div>

                </div>

                {/* Gap Game Results - Always shown at bottom */}
                <GapGameResult
                    filter={filter}
                    className="my-8"
                />
            </main>
        </>
    )
}
