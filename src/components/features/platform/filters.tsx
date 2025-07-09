"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GameCategories, ProviderEnum } from "@/models/casino-games"
import { Search, SlidersHorizontal, X } from "lucide-react"

export type Filter = {
    search: string;
    category?: string;
    platform?: string;
    provider?: string;
    type?: string;
    popular?: boolean;
    new?: boolean;
}

type Props = {
    filter: Filter;
    setFilter: (filter: Filter) => void;
}

const GameFilters = ({ filter, setFilter }: Props) => {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    return (
        <div className="relative mb-8 md:mx-auto w-full">
            {/* Mobile layout */}
            <div className="flex md:hidden flex-row items-center gap-2 w-full">
                <div className="relative flex-1">
                    <Input
                        className="w-full bg-primary-game border border-platform-border ring-0 focus:bg-primary-game/80 focus:border-platform-border text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 pl-10 pr-12 rounded-none"
                        placeholder="Search"
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 dark:text-gray-400" size={20} />
                </div>
                <button
                    className="flex items-center justify-center h-12 w-12 border border-platform-border bg-primary-game rounded-none"
                    onClick={() => setMobileFiltersOpen((open) => !open)}
                    aria-label={mobileFiltersOpen ? "Close filters" : "Open filters"}
                    type="button"
                >
                    {mobileFiltersOpen ? (
                        <X className="text-gray-200 dark:text-gray-400" size={22} />
                    ) : (
                        <SlidersHorizontal className="text-gray-200 dark:text-gray-400" size={22} />
                    )}
                </button>
            </div>
            {/* Mobile: Show filters below when open */}
            {mobileFiltersOpen && (
                <div className="flex flex-col gap-2 mt-2 md:hidden">
                    {/* Category filter */}
                    <div className="w-full">
                        <Select onValueChange={(value) => setFilter({ ...filter, category: value })} value={filter.category}>
                            <SelectTrigger className="w-full bg-primary-game border-platform-border focus:bg-primary-game/80 border focus:border-game-secondary text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 rounded-none">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent className="bg-primary-game rounded-none border-platform-border">
                                <SelectItem value="all" className="text-white">All</SelectItem>
                                {GameCategories.map((category) => (
                                    <SelectItem key={category.value} value={category.value} className="text-white capitalize">{category.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Platform filter */}
                    <div className="w-full">
                        <Select onValueChange={(value) => setFilter({ ...filter, provider: value })} value={filter.provider}>
                            <SelectTrigger className="w-full bg-primary-game border-platform-border focus:bg-primary-game/80 border focus:border-game-secondary text-white placeholder:text-gray-400 h-12 rounded-none">
                                <SelectValue placeholder="Select Platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-primary-game rounded-none border-platform-border">
                                <SelectItem value="all" className="text-white">All</SelectItem>
                                {Object.values(ProviderEnum).map((platform) => (
                                    <SelectItem key={platform} value={platform} className="text-white capitalize">{platform.split("_").join(" ")}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Desktop layout */}
            <div className="hidden md:flex flex-row items-center gap-2 w-full">
                {/* Search input */}
                <div className="relative w-full max-w-2xl">
                    <Input
                        className="w-full bg-primary-game border-platform-border ring-0 focus:bg-primary-game/80 border focus:border-platform-border text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 pl-10 rounded-none"
                        placeholder="Search games..."
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200 dark:text-gray-400" size={20} />
                </div>
                {/* Category filter */}
                <div className="w-full max-w-xs">
                    <Select onValueChange={(value) => setFilter({ ...filter, category: value })} value={filter.category}>
                        <SelectTrigger className="w-full bg-primary-game border-platform-border focus:bg-primary-game/80 border focus:border-game-secondary text-white placeholder:text-gray-200 dark:placeholder:text-gray-400 h-12 rounded-none">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-primary-game rounded-none border-platform-border">
                            <SelectItem value="all" className="text-white">All</SelectItem>
                            {GameCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value} className="text-white capitalize">{category.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Platform filter */}
                <div className="w-full max-w-xs">
                    <Select onValueChange={(value) => setFilter({ ...filter, provider: value })} value={filter.provider}>
                        <SelectTrigger className="w-full bg-primary-game border-platform-border focus:bg-primary-game/80 border focus:border-game-secondary text-white placeholder:text-gray-400 h-12 rounded-none">
                            <SelectValue placeholder="Select Platform" />
                        </SelectTrigger>
                        <SelectContent className="bg-primary-game rounded-none border-platform-border">
                            <SelectItem value="all" className="text-white">All</SelectItem>
                            {Object.values(ProviderEnum).map((platform) => (
                                <SelectItem key={platform} value={platform} className="text-white capitalize">{platform.split("_").join(" ")}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default GameFilters;