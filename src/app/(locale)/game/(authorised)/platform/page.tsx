"use client";
import { FinancialTable } from "@/components/features/platform/finantial-table";
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { generateData, SPORTS_BOOK_GAMEID } from "@/lib/utils";
import { IconCoins, IconCricket, IconGift } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const GAME_CARDS = [
    {
        title: "Stock Games",
        icon: IconCoins,
        image: "/images/stock-roulette.png",
        href: "/game/platform/stock-games",
        buttonText: "Enter"
    },
    {
        title: "Casino Games",
        icon: IconGift,
        image: "/images/casino-games.png",
        href: "/game/platform/casino",
        buttonText: "Enter"
    },
    {
        title: "Sports Book",
        icon: IconCricket,
        image: "/images/sports-book.png",
        href: `/game/casino/${SPORTS_BOOK_GAMEID}`,
        buttonText: "Play Now"
    }
];

const PlatformPage = () => {
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        setData(generateData(10))

        const interval = setInterval(() => {
            setData((prevData) => {
                const newEntry = generateData(1)[0]
                const updatedData = [newEntry, ...prevData]
                if (updatedData.length > 10) {
                    return updatedData.slice(0, 10)
                }
                return updatedData
            })
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <GameAdsCarousel />
            {/* Desktop View */}
            <div className="hidden md:grid grid-cols-3 my-20 gap-6">
                {GAME_CARDS.map((card, index) => (
                    <div key={index}>
                        <div className="flex items-center gap-2 mb-4">
                            <card.icon className="h-6 w-6 text-white" stroke={1.5} />
                            <h2 className="font-bold text-white">{card.title}</h2>
                        </div>
                        <Image
                            src={card.image}
                            alt={card.title.toLowerCase()}
                            width={500}
                            height={500}
                            className="rounded-lg overflow-hidden object-cover object-top"
                        />
                        <Link href={card.href}>
                            <Button variant="game" className="mt-4 w-full">{card.buttonText}</Button>
                        </Link>
                    </div>
                ))}
            </div>


            {/* Mobile View */}
            <div className="md:hidden my-10">


                <Carousel className="w-full" opts={{
                    align: "start",
                    containScroll: "trimSnaps"
                }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Our Games</h2>
                        <div className="flex gap-2">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                        </div>
                    </div>
                    <CarouselContent>
                        {GAME_CARDS.map((card, index) => (
                            <CarouselItem key={index} className="basis-1/2 ">
                                <div className="flex flex-col items-center relative rounded-lg">
                                    <Image
                                        src={card.image}
                                        alt={card.title.toLowerCase()}
                                        width={500}
                                        height={500}
                                        className="rounded-lg overflow-hidden object-cover object-top"
                                    />
                                    <div className="absolute rounded-lg flex flex-col items-center justify-end bottom-0 left-0 z-10 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/2 text-white p-2">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <card.icon className="h-6 w-6 text-white" stroke={1.5} />
                                            {card.title}</h2>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div className="container-main space-y-6 mb-12">
                <img src="/images/banner/1.avif" alt="stock-roulette" className="rounded-lg w-full h-auto" />
                <img src="/images/banner/2.avif" alt="stock-roulette" className="rounded-lg w-full h-auto" />
            </div>
            <header className="items-center mb-3 pl-1 justify-between md:flex hidden">
                <h2 className="font-semibold text-white">Winning Reports</h2>
            </header>
            <FinancialTable data={data} className="w-full md:flex hidden mb-10" />
        </>
    )
}

export default PlatformPage;
