"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { stockGames } from "@/lib/utils"
import { useGetMyCompany } from "@/react-query/company-queries"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"



export default function StockGameCarousel() {   
    const t = useTranslations("platform.stock-game-carousel");
    const { data: company } = useGetMyCompany();
    return (
        <Carousel opts={{ loop: false, startIndex: 0 }} className="w-full">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="md:text-2xl text-base text-platform-text font-bold">{t("title")}</h2>
                    <div className="flex gap-2">
                        <CarouselPrevious className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <CarouselNext className="static translate-y-0 bg-background/20 hover:bg-background/40" />
                        <Link href="/game/platform/stock-games">
                            <Button size="sm" variant="platform-primary" className="rounded-full">
                                {t("view-all")}    
                            </Button>
                        </Link>
                    </div>
                </div>
                <CarouselContent>
                    {stockGames.filter((game) => !company?.gameRestrictions.includes(game.type)).map((game, index) => (
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
