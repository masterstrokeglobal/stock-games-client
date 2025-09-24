'use client'

import GameMarketSelector from "@/components/common/stocks-game-market-selector";
import Navbar from "@/components/features/game/navbar";
import { Button } from "@/components/ui/button";
import { SchedulerType } from "@/models/market-item";
import { useLaunchStocksGame } from "@/react-query/casino-games-queries";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function stockGame() {
    const { gameId } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get market from URL or set to null
    const [selectedMarket, setSelectedMarket] = useState<SchedulerType | null>(
        () => {
            const market = searchParams.get('market');
            return market ? market as SchedulerType : null;
        }
    );

    const { data: game, isLoading } = useLaunchStocksGame(
        gameId as string,
        selectedMarket,
        {
            enabled: !!selectedMarket
        }
    );

    const handleMarketSelection = (market: SchedulerType) => {
        setSelectedMarket(market);
        // Update URL with selected market
        const params = new URLSearchParams(searchParams);
        params.set('market', market);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    if (!selectedMarket) {
        return (
            <GameMarketSelector
                title="SELECT MARKET"
                showNavbar={true}
                onMarketSelect={handleMarketSelection}
            />
        );
    }


    if (isLoading) return (
        <div className="flex justify-center bg-primary-game min-h-screen items-center w-full h-full">
            <div className="flex-col justify-center items-center">
                <Loader2 className="animate-spin mx-auto mb-2 text-white" />
            </div>
        </div>
    );


    if (!game?.redirectUrl) return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white">
            <Navbar />
            <main className="container mx-auto pt-14 flex flex-col gap-2 min-h-screen justify-center items-center">
                <h1 className="text-2xl font-bold">Error loading game</h1>
                <Link href="/game/platform/casino">
                    <Button variant="game">
                        Go back to Stocks
                    </Button>
                </Link>
            </main>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white">
            <Navbar />
            <main className="container mx-auto pt-14">
                <iframe src={game?.redirectUrl} className="w-full min-h-[calc(100vh-3.5rem)]" />
            </main>
        </div>
    );
}