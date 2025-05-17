"use client";
import CasinoCarousel from "@/components/features/platform/carousel-game-cards";
import { GameAdsCarousel } from "@/components/features/platform/game-ads-carousel";
import { Game, LOBBY_GAMES, SinglePlayerGames, StockDerbyGames } from "@/lib/constants";
export default function GamingAppInterface() {

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white   mx-auto">

            <GameAdsCarousel />

            <CasinoCarousel games={StockDerbyGames as unknown as Game[]} title="Stock Games" />
            <CasinoCarousel games={SinglePlayerGames as unknown as Game[]} title="Single Player Games" />
            <CasinoCarousel games={LOBBY_GAMES as unknown as Game[]} title="Multiplayer Games" />
        </div>
    )
}

