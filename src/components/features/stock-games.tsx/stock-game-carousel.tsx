"use client"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { SchedulerType } from "@/models/market-item"
import Image from "next/image"
import Link from "next/link"

export default function StockGameCarousel() {
    
    return (
        <Carousel className="w-full">
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
                                <div className="rounded-xl overflow-hidden border border-yellow-600 relative shadow-lg shadow-green-900/30">
                                    <Image src="/images/stock-roulette.png" alt="stock-roulette" className="w-full h-auto object-contain" width={500} height={500} />
                                    <div className="md:p-2 w-full absolute bottom-0 bg-gradient-to-b from-transparent to-black text-game-text text-center">
                                        <h3 className="font-semibold mb-2 text-sm md:text-lg text-white">NSE STOCKS ROULETTE</h3>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>

                        <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <Link href={`/game?gameType=${SchedulerType.USA_MARKET}`} className="w-full">
                                <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                                    <Image src="/images/ad2.jpg" alt="coming-soon" className="w-full h-auto object-contain" width={500} height={500} />
                                    <div className="md:p-2 w-full absolute bottom-0 bg-gradient-to-b from-transparent to-black text-game-text text-center">
                                        <h3 className="font-semibold mb-2 text-sm md:text-lg text-white">USA STOCKS ROULETTE</h3>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>

                        <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/ad1.png" alt="coming-soon" className="w-full h-full object-cover" width={500} height={500} />
                                <div className="absolute bottom-0 left-0 w-full h-fit bg-gradient-to-b pt-4 from-transparent to-black text-white p-4">
                                    <h3 className="md:text-lg text-sm font-bold text-center">Coming Soon</h3>
                                </div>
                            </div>
                        </CarouselItem>

                        <CarouselItem className="xs:basis-1/3 basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-4">
                            <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                                <Image src="/images/ad3.jpg" alt="coming-soon" className="w-full h-full object-top" width={500} height={500} />
                                <div className="absolute bottom-0 left-0 w-full h-fit bg-gradient-to-b pt-4 from-transparent to-black text-white p-4">
                                    <h3 className="md:text-lg text-sm font-bold text-center">Coming Soon</h3>
                                </div>
                            </div>
                        </CarouselItem>
                </CarouselContent>
            </div>
        </Carousel>
    )
}
