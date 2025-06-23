"use client"



import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { SchedulerType } from "@/models/market-item"
import AutoScroll from "embla-carousel-auto-scroll"
import Image from "next/image"
import Link from "next/link"

export default function StockGameCarousel() {

    return (
        <Carousel opts={{ loop: true }} plugins={[AutoScroll({ active: true, stopOnInteraction: false, stopOnFocusIn: false, stopOnMouseEnter: true, direction: "forward", speed: 3 })]} className="w-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="md:text-2xl text-base font-bold">Stock Games</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                    </div>
                </div>
                <CarouselContent>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href={`/game?gameType=${SchedulerType.NSE}`} className="w-full">
                            <div className="rounded-xl overflow-hidden  relative shadow-lg shadow-green-900/30">
                                <Image src="/images/stock-game/nse.png" alt="stock-roulette" className="w-full h-auto object-contain" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href={`/game?gameType=${SchedulerType.USA_MARKET}`} className="w-full">
                            <div className="rounded-xl overflow-hidden  aspect-square relative shadow-lg shadow-blue-900">
                                <Image src="/images/stock-game/usa-market.png" alt="coming-soon" className="w-full h-auto object-contain" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/jackpot">
                            <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/stock-game/stock-jackpot.png" alt="coming-soon" className="w-full h-full object-cover" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>
                    
                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/platform/stock-game/stock-slot">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/stock-slot.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/platform/stock-game/7-up-7-down">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/banner/7-up-game.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/platform/stock-game/coin-head-tail">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/banner/coin-toss.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/platform/stock-game/wheel-of-fortune">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/banner/wheel-of-fortune.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>
                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/platform/stock-game/dice-game">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/banner/dice-game.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>
                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">  
                        <Link href="/game/redblack">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/redvsblack.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>

                    <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                        <Link href="/game/platform/stock-game/aviator">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/banner/aviator.png" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                            </div>
                        </Link>
                    </CarouselItem>
           </CarouselContent>
            </div>
        </Carousel>
    )
}

