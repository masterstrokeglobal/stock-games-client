import CurrentBets from "@/components/features/game/current-bets";
import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import RouletteGame from "@/components/features/game/roulette-game";
import Image from "next/image";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};
const GamePage = () => {
    return (
        <section className="bg-primary-game pt-20 h-screen">
            <Navbar />
            <main className="grid  grid-cols-12 grid-rows-5 gap-4 h-full p-4">
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
            </main>
        </section>
    );
};

export default GamePage;
