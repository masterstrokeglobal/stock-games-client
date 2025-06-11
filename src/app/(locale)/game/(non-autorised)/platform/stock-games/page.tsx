"use client";
import CasinoCarousel from "@/components/features/platform/carousel-game-cards";
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel";
import { StockDerbyGames } from "@/lib/constants";
export default function GamingAppInterface() {

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white   mx-auto">

            <GameAdsCarousel />
            <CasinoCarousel games={StockDerbyGames} title="Stock Games" />
        </div>
    )
}

