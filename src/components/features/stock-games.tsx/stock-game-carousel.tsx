"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card } from "@/components/ui/card"
import { SchedulerType } from "@/models/market-item"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"


const stockGames = [
    {
        href: `/game?gameType=${SchedulerType.NSE}`,
        src: "/images/nse.png",
        alt: "stock-roulette",
    },
    {
        href: `/game?gameType=${SchedulerType.USA_MARKET}`,
        src: "/images/stock-game/usa-market.png",
        alt: "coming-soon",
    },
    {
        href: "/game/jackpot",
        src: "/images/stock-game/stock-jackpot.png",
        alt: "coming-soon",
    },
    {
        href: "/game/platform/stock-game/stock-slot",
        src: "/images/stock-slot.png",
        alt: "coming-soon",
    },
    {
        href: "/game/single-player/7-up-down",
        src: "/images/banner/7-up-game.png",
        alt: "coming-soon",
    },
    {
        href: "/game/single-player/head-tail",
        src: "/images/banner/coin-toss.png",
        alt: "coming-soon"
    },
    {
        href: "/game/single-player/wheel-of-fortune",
        src: "/images/banner/wheel-of-fortune.png",
        alt: "coming-soon",
    },
    {
        href: "/game/single-player/dice-game",
        src: "/images/banner/dice-game.png",
        alt: "coming-soon",
    },
    {
        href: "/game/platform/stock-game/aviator",
        src: "/images/banner/aviator.png",
        alt: "coming-soon",
    }
]

export default function StockGameCarousel() {
    return (
        <Carousel opts={{ loop: false, startIndex: 0 }} className="w-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="md:text-2xl text-base text-platform-text font-bold">Stock Games</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <Link href="/game/platform/stock-games">
                            <Button size="sm" variant="platform-primary" className="rounded-full">
                                View All    
                            </Button>
                        </Link>
                    </div>
                </div>
                <CarouselContent>
                    {stockGames.map((game, index) => (
                        <CarouselItem key={index} className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <Link href={game.href} className="w-full">
                                <Card className={`overflow-hidden  rounded-none relative shadow-lg  border border-[#4467CC] dark:border-none`} style={{ aspectRatio: '170/240' }}>
                                    <Image 
                                        src={game.src} 
                                        alt={game.alt} 
                                        className="w-full h-full object-top" 
                                        width={500} 
                                        height={500} 
                                    />
                                </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </div>
        </Carousel>
    )
}
