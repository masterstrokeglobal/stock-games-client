"use client";
import Navbar from "@/components/features/game/navbar";
import { Button } from "@/components/ui/button";
import { useGameLogin } from "@/react-query/casino-games-queries";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";


const GameIdPage = () => {
    const { gameId } = useParams();

    const { data: game, isLoading } = useGameLogin(gameId as string);

    if (isLoading) return <div className="flex justify-center bg-primary-game min-h-screen items-center w-full h-full">
        <div className="flex-col justify-center items-center">
            <Loader2 className="animate-spin mx-auto mb-2 text-white" />
        </div>
    </div>

    if (!game?.redirectUrl) return <div className="flex flex-col min-h-screen bg-primary-game text-white">
        <Navbar />
        <main className="container mx-auto pt-14 flex flex-col gap-2  min-h-screen justify-center items-center">
            <h1 className="text-2xl font-bold">Error loading game</h1>
            <Link href="/game/platform/casino">
                <Button variant="game">
                    Go back to casino
                </Button>
            </Link>
        </main>
    </div>

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white">
            <Navbar />
            <main className="container mx-auto pt-14 ">
                 <iframe src={game.redirectUrl} className="w-full min-h-[calc(100vh-4rem)]" />
            </main>
        </div>
    )
}


export default GameIdPage;