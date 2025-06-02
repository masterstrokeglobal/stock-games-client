"use client";

import Navbar from "@/components/features/game/navbar";
import RedBlackRouletteGame from "@/components/features/game/red-black-roulette-game";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame } from "@/hooks/use-current-game";
import Last10WinnersCardSpin from "@/components/features/card-spinner/card-spinner";
import PlaceBets from "@/components/features/game/place-bet";
import RedBlackLeaderBoard from "@/components/features/game/red-black-leaderboard";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    Tawk_API: any;
  }
}

const borderStyle = {
  borderColor: "var(--primary-game)",
  borderWidth: "1px",
  borderStyle: "solid",
  backgroundPosition: "center",
  backgroundRepeat: "repeat",
  zIndex: 10,
};


const GamePage = () => {
  const { roundRecord } = useCurrentGame();
  //   const { isMobile } = useWindowSize();
  useHorseRaceSound(roundRecord);

  return (
    <>
      <section className={cn("pt-14 min-h-screen flex flex-col")}>
        <Navbar />
        <main className="grid grid-cols-12 gap-4 flex-1 pt-8 px-4 pb-4 max-w-7xl mx-auto w-full">
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 h-full">
            <div
              className="flex-1 bg-las relative rounded-2xl overflow-hidden w-full"
              style={{
                flex: "0 0 50%", // 70% height
                ...borderStyle,
                backgroundImage: `url(/images/bg-lightning.jpg)`,
                backgroundSize: "100%",
              }}
            >
              {roundRecord && (
                <RedBlackRouletteGame roundRecord={roundRecord} />
              )}
            </div>
            <div
              className="rounded-2xl overflow-y-auto bg-primary-game relative">
              <header className="absolute top-0 left-0 w-full">
                <h1 className="text-xl px-4 py-2 font-semibold text-game-secondary">Last 10 Winners</h1>
              </header>
              {roundRecord && (
                <Last10WinnersCardSpin
                />
              )}
            </div>
          </div>

          {/* Right Column: Top (PlaceBets) and Bottom (LeaderBoard) */}
          <div className="col-span-12 lg:col-span-5  gap-4 h-full  flex flex-col w-full">
            {roundRecord && <RedBlackLeaderBoard roundRecord={roundRecord} className="flex-[2]  bg-primary-game  " />}
            <div className="flex-[3]">
              {roundRecord && <PlaceBets className="border border-red-500" roundRecord={roundRecord} />}
            </div>
          </div>
        </main>
      </section>
    </>
  );
};

export default GamePage;
