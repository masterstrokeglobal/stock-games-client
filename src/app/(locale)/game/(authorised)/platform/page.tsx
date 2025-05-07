"use client";
import { GameAdsCarousel } from "@/components/features/platform/carousel";
import { FinancialTable } from "@/components/features/platform/finantial-table";
import { Button } from "@/components/ui/button";
import { generateData } from "@/lib/utils";
import { GameCategory } from "@/models/casino-games";
import { IconCoins, IconCricket, IconGift } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";



const PlatformPage = () => {
    const [data, setData] = useState<any[]>([])

    // Initialize data
    useEffect(() => {
        setData(generateData(10))

        // Update data every 3 seconds with a new entry
        const interval = setInterval(() => {
            setData((prevData) => {
                const newEntry = generateData(1)[0]
                const updatedData = [newEntry, ...prevData]
                // Keep only 10 items
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
            <GameAdsCarousel  />
            <div className="grid grid-cols-1 my-20 md:grid-cols-3 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <IconCoins className="h-6 w-6 text-white" stroke={1.5} />
                        <h2 className="text-xl font-bold text-white">Stock Games</h2>
                    </div>
                    <Image src="/images/stock-roulette.png" alt="stock-roulette" width={500} height={500} className="rounded-lg overflow-hidden  object-cover object-top" />
                    <p className="text-gray-400 mt-3">
                        Stock Games is a game that allows you to bet on the stock market. You can bet on the stock market by predicting the direction of the stock market.
                    </p>
                    <Button variant="game" className="mt-4 w-full">Play Now</Button>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <IconGift className="h-6 w-6 text-white" stroke={1.5} />
                        <h2 className="text-xl font-bold text-white">Casino Games</h2>
                    </div>
                    <Image src="/images/casino-games.png" alt="casino-games" width={500} height={500} className="rounded-lg overflow-hidden  object-cover object-top" />
                    <p className="text-gray-400 mt-3">Casino Games is a game that allows you to bet on the casino games. You can bet on the casino games by predicting the direction of the casino games.</p>
                    <Link href="/game/platform/casino">
                        <Button variant="game" className="mt-4 w-full">Play Now</Button>
                    </Link>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <IconCricket className="h-6 w-6 text-white" stroke={1.5} />
                        <h2 className="text-xl font-bold text-white">Sports Book</h2>
                    </div>
                    <Image src="/images/sports-book.png" alt="sports-book" width={500} height={500} className="rounded-lg overflow-hidden  object-cover object-top" />
                    <p className="text-gray-400 mt-3">Sports Book is a game that allows you to bet on the Current Sports Matches. You can bet on the Current Sports Matches by predicting the direction of the Current Sports Matches.</p>
                    <Link href={`/game/platform/casino/${GameCategory.SPORTS}`}>
                        <Button variant="game" className="mt-4 w-full">Play Now</Button>
                    </Link>
                </div>
            </div>
            <header className="flex items-center mb-3 pl-1 justify-between">
                <h2 className="text-xl font-semibold text-white"> Winning Reports </h2>
            </header>
            <FinancialTable data={data} className="w-full mb-10" />
        </>
    )
}

export default PlatformPage;
