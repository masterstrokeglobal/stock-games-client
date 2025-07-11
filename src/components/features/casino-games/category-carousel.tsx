"use client"

import GameCard from "@/components/features/casino-games/game-card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { GameCategory } from "@/models/casino-games"
import { GameTypeEnum } from "@/models/casino-games"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"
import Link from "next/link"
import { useMemo } from "react"

interface CategoryCarouselProps {
    categoryId?: GameCategory,
    popular?: boolean,
    new?: boolean,
    slot?: boolean,
    liveGame?: boolean,
    title: string,
    type?: GameTypeEnum,
    direction?: "forward" | "backward"
}

export default function CategoryCarousel({ categoryId, title, popular, new: isNew, slot, liveGame, type }: CategoryCarouselProps) {
    const { data, isLoading } = useGetCasinoGames({
        limit: 100,
        popular,
        excludeCategory: categoryId,
        new: isNew,
        slot,
        type,
        liveGame
    })

    const link = useMemo(() => {
        if (type) {
            return `/game/platform/casino?type=${type}`
        }
        if (categoryId) {
            return `/game/platform/casino?category=${categoryId}`
        }

        if (popular) {
            return `/game/platform/casino?popular=true`
        }

        if (isNew) {
            return `/game/platform/casino?new=true`
        }
        return `/game/platform/casino`
    }, [type, categoryId, popular, isNew])
    
    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="md:text-2xl text-base font-bold">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="aspect-[6/4] rounded-xl bg-background/20 animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    // If no games in this category, don't render the carousel
    if (!data?.games || data.games.length === 0) {
        return null
    }


    return (
        <Carousel opts={{ loop: false, startIndex: 0 ,slidesToScroll: 2}} className="w-full">
            <div className="md:space-y-4 space-y-2">
                <div className="flex items-end justify-between">
                    <h2 className="md:text-2xl sm:text-base text-sm font-semibold text-platform-text">{title}</h2>
                    <div className="flex gap-2 items-end">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
                        <Link href={link}>
                            <Button size="sm" variant="platform-primary" className="rounded-full md:text-sm text-xs md:px-3 px-2 md:h-8 h-6">View All</Button>
                        </Link>
                    </div>
                </div>
                <CarouselContent className="py-4 overflow-visible">
                    {data.games.map((game) => (
                        <CarouselItem key={game.id} className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <GameCard game={game} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>
        </Carousel>
    )
}
