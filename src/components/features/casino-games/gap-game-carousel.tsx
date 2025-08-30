"use client"

import GameCard from "@/components/features/casino-games/game-card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { ProviderEnum } from "@/models/casino-games"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"
import { useTranslations } from "next-intl"
import Link from "next/link"

interface CategoryCarouselProps {
    title: string,
}

export default function GapGameCarousel({ title }: CategoryCarouselProps) {
    const t = useTranslations("platform.casino-games");
    const { data, isLoading } = useGetCasinoGames({
        limit: 100,
        providerCompany: "gap",
        subProvider: ProviderEnum.mac88,
        page: 1,
    })

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
        <Carousel opts={{ loop: false, startIndex: 0, slidesToScroll: 2 }} className="w-full">
            <div className="md:space-y-4 space-y-2">
                <div className="flex items-end justify-between">
                    <h2 className="md:text-2xl sm:text-base text-sm font-semibold text-platform-text">{title}</h2>
                    <div className="flex gap-2 items-end">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
                        <Link href="/game/platform/gap">
                            <Button size="sm" variant="platform-primary" className="rounded-full md:text-sm text-xs md:px-3 px-2 md:h-8 h-6">{t("view-all")}</Button>
                        </Link>
                    </div>
                </div>
                <CarouselContent className="py-4 overflow-visible">
                    {data.games.map((game) => (
                        <CarouselItem key={game.id} className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <GameCard className="aspect-[5/3]" game={game} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>
        </Carousel>
    )
}
