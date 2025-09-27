"use client"

import StockGameCard from "@/components/common/stock-game-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import useWindowSize from "@/hooks/use-window-size"
import { stockGames } from "@/lib/utils"
import { useGetMyCompany } from "@/react-query/company-queries"
import { useGetCasinoGames } from "@/react-query/casino-games-queries"
import { useTranslations } from "next-intl"
import Link from "next/link"


export default function StockGameCarousel() {
    const { width } = useWindowSize();
    const t = useTranslations("platform.stock-game-carousel");
    const { data: company } = useGetMyCompany();
    const { data: setGameData } = useGetCasinoGames({
        providerName: "stockgames",
        subProviderName: "stockgames",
        providerCompany: "stockgames",
        limit: 1,
    });
    const setGame = setGameData?.games?.[0];

    const isLargeDesktop = width >= 1280;
    return (
        <Carousel opts={{ loop: false, startIndex: 0, slidesToScroll: isLargeDesktop ? 2 : 1 }} className="w-full">

            <div className="space-y-1">
                <div className="flex items-center justify-between">
                    <h2 className="md:text-2xl sm:text-base text-sm font-semibold text-platform-text">{t("title")}</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40 md:w-8 md:h-8 w-6 h-6" />
                        <Link href="/game/platform/stock-games" className="flex" >
                            <Button size="sm" variant="platform-primary" className="rounded-full md:text-sm text-xs md:px-3 px-2 md:h-8 h-6">{t("view-all")}</Button>
                        </Link>
                    </div>
                </div>
                <CarouselContent>
                    {setGame && (
                        <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <Link href={`/game/stocks/${setGame.name.toLowerCase()}/${setGame.id}`} className="w-full">
                                <Card className={`overflow-hidden rounded-none relative shadow-lg border border-[#4467CC] dark:border-none`} style={{ aspectRatio: '170/240' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={setGame.imageUrl || "/placeholder.svg?height=400&width=300"}
                                        alt={setGame.name}
                                        className="w-full h-full object-top"
                                    />
                                </Card>
                            </Link>
                        </CarouselItem>
                    )}
                    {stockGames.filter((game) => !company?.gameRestrictions.includes(game.type)).map((game, index) => (
                        <CarouselItem key={index} className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <StockGameCard game={game} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>
        </Carousel>
    )
}
