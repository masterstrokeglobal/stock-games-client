"use client";
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel";
import { SchedulerType } from "@/models/market-item";
import Image from "next/image";
import Link from "next/link";
export default function GamingAppInterface() {

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white   mx-auto">

            <GameAdsCarousel />

            {/* Game cards */}
            <header className="container mx-auto max-w-3xl  mt-10 mb-2">
                <h1 className="text-2xl font-bold capitalize">Stock Games</h1>
            </header>
            <div className="grid grid-cols-2 mx-auto max-w-3xl w-full gap-4 mb-6">
                <Link href={`/game?gameType=${SchedulerType.NSE}`} className="w-full">
                    <div className="rounded-xl overflow-hidden border border-yellow-600 relative shadow-lg shadow-green-900/30">
                        <Image src="/images/stock-roulette.png" alt="stock-roulette" className="w-full h-auto object-contain" width={500} height={500} />
                        <div className="md:p-2 w-full absolute bottom-0 bg-gradient-to-b from-transparent to-black text-game-text text-center">
                            <h3 className="font-semibold mb-2 text-sm md:text-xl text-white">NSE STOCKS ROULETTE</h3>
                        </div>
                    </div>
                </Link>

                <Link href={`/game?gameType=${SchedulerType.USA_MARKET}`} className="w-full">
                    <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                        <Image src="/images/ad2.jpg" alt="coming-soon" className="w-full h-auto object-contain  " width={500} height={500} />
                        <div className="md:p-2 w-full absolute bottom-0 bg-gradient-to-b from-transparent to-black text-game-text text-center">
                            <h3 className="font-semibold mb-2 text-sm md:text-xl text-white">USA STOCKS ROULETTE</h3>
                        </div>
                    </div>
                </Link>


                {/* Coming Soon Card */}
                <Link href={`/game/jackpot`}>
                    <div className="rounded-xl overflow-hidden border aspect-square border-blue-700 relative shadow-lg shadow-blue-900">
                        <Image src="/images/ad1.png" alt="coming-soon" className="w-full h-full object-cover " width={500} height={500} />
                    </div>
                </Link>

                <Link href={`/game/slot`}>
                    <div className="rounded-xl overflow-hidden aspect-square border border-blue-700 relative shadow-lg shadow-blue-900">
                        <Image src="/images/ad3.jpg" alt="coming-soon" className="w-full h-full object-top " width={500} height={500} />
                    </div>
                </Link>
            </div>
        </div>
    )
}

