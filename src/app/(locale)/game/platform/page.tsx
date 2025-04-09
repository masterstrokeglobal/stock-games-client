"use client";
import Navbar from "@/components/features/game/navbar";
import CasinoCarouselAds from "@/components/features/platform/carousel-ads";
import CasinoCarousel from "@/components/features/platform/carousel-game-cards";
import SupportCard from "@/components/features/platform/footer";
import { Game, LOBBY_GAMES, StockDerbyGames, Mini_Mutual_Fund_Games } from "@/lib/constants";

const PlatformPage = () => {
    return <div className="bg-gradient-to-b from-[#3258d3] to-[#0A0F1F] min-h-screen ">
        <Navbar className="sticky top-0 z-50" />
        <div className="w-full mx-auto mt-10 space-y-20">
            <CasinoCarouselAds />
            <CasinoCarousel games={StockDerbyGames as unknown as Game[]} title="Stock Derby" />
            <CasinoCarousel games={LOBBY_GAMES as unknown as Game[]} title="Multiplayer Games" />
            <CasinoCarousel games={Mini_Mutual_Fund_Games as unknown as Game[]} title="Mini Mutual Fund" />
        </div>
        <SupportCard className="mt-20" />
    </div>
};

export default PlatformPage;
