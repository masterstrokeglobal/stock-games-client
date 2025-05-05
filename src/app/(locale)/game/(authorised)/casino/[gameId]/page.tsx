"use client";
import LoadingScreen from "@/components/common/loading-screen";
import Navbar from "@/components/features/game/navbar";
import { useGameLogin } from "@/react-query/casino-games-queries";
import { useParams } from "next/navigation";


const GameIdPage = () => {
    const { gameId } = useParams();

    const { data: game, isLoading } = useGameLogin(gameId as string);

    if (isLoading) return <LoadingScreen className="h-screen" />

    return (
        <div className="flex flex-col min-h-screen bg-primary-game text-white">
            <Navbar />

            <main className="container mx-auto pt-14 ">
                <iframe src={game.url} className="w-full min-h-[calc(100vh-4rem)]" />
            </main>
        </div>
    )
}


export default GameIdPage;