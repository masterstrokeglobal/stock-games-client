"use client"

import GameCard from "@/components/features/casino-games/game-card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { GameCategory } from "@/models/casino-games"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"

interface CategoryCarouselProps {
    categoryId?: GameCategory,
    popular?: boolean,
    new?: boolean,
    title: string
}

export default function CategoryCarousel({ categoryId, title, popular, new: isNew }: CategoryCarouselProps) {
    const { data, isLoading } = useGetCasinoGames({
        limit: 200,
        popular,
        excludeCategory: categoryId,
        new: isNew
    })


    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="md:text-2xl text- font-bold">{title}</h2>
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
        <Carousel className="w-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="md:text-2xl text-base font-bold">{title}</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
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
