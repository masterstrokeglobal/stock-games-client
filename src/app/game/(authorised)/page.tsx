"use client";
import CurrentBets from "@/components/features/game/current-bets";
import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import RouletteGame from "@/components/features/game/roulette-game";
import useWindowSize from "@/hooks/use-window-size";
import Image from "next/image";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};
const GamePage = () => {

    const { isMobile } = useWindowSize();
    return (
        <section className="bg-primary-game pt-20 h-screen">
            <Navbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 gap-4 h-full p-4">
                <div
                    style={borderStyle}
                    className="col-span-7 row-span-2 rounded-2xl ">
                    <Image src="/horse-game.png" width={800} height={800} className="w-full h-full" alt="Stock Derby" />
                </div>
                <div
                    style={borderStyle}

                    className="col-span-5 row-span-2 rounded-2xl ">
                    <LeaderBoard />
                </div>
                <div
                    style={borderStyle}
                    className="col-span-7 row-span-3 rounded-2xl ">
                    <RouletteGame />
                </div>
                <div
                    style={borderStyle}
                    className="col-span-5 row-span-3 rounded-2xl ">

                    <CurrentBets />
                </div>
            </main>}

            {isMobile && <MobileGame />}
        </section>
    );
};

export default GamePage;


const MobileGame = () => {
    return <section className="text-white">
        <header className="bg-[#1E2E57] mx-auto flex justify-center flex-col text-center min-h-[20vh]" >
            <h1>Round Starts in</h1>
            <p className="jersey text-8xl leading-[5rem]">1:00</p>
        </header>
        <main className="bg-[#0A1634]">
            <RouletteGame />
            <div className="px-2">
                <CurrentBets />
            </div>
        </main>
    </section>
};