"use client";

import Last10WinnersCardSpin from "@/components/features/card-spinner/card-spinner";
import Navbar from "@/components/features/game/navbar";
import PlaceBets from "@/components/features/game/place-bet";
import RedBlackLeaderBoard from "@/components/features/game/red-black-leaderboard";
import RedBlackRouletteGame from "@/components/features/game/red-black-roulette-game";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame } from "@/hooks/use-current-game";
import { RoundRecordGameType } from "@/models/round-record";
import { useState } from "react";
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
  const [globalBetAmount, setGlobalBetAmount] = useState(100);
  const { roundRecord } = useCurrentGame(RoundRecordGameType.RED_BLACK);
  useHorseRaceSound(roundRecord);

  return (
    <>
      <section>
        <Navbar />
        <main className="grid md:grid-cols-12 grid-cols-1 md:grid-rows-7 grid-rows-1 gap-4 flex-1 px-4 pb-4 md:h-screen pt-16 mx-auto w-full">
          <div
            className="md:col-span-6 col-span-12 md:row-span-4 bg-las relative rounded-2xl overflow-hidden w-full order-1"
            style={{
              ...borderStyle,
              backgroundImage: `url(/images/bg-lightning.jpg)`,
              backgroundSize: "100%",
            }}
          >
            {roundRecord && (
              <RedBlackRouletteGame roundRecord={roundRecord} globalBetAmount={globalBetAmount} handleGlobalBetAmountChange={setGlobalBetAmount} />
            )}
          </div>

          {roundRecord && <RedBlackLeaderBoard roundRecord={roundRecord} className="md:col-span-6 col-span-12 row-span-3 bg-primary-game order-2" />}

          <div className="md:col-span-6 col-span-12 md:row-span-4 rounded-2xl rostart bg-[url('/images/bg-design.jpg')] overflow-y-auto bg-primary-game relative order-3">
            <header className="absolute top-0 left-0 w-full">
              <h1 className="text-xl px-4 py-2 font-semibold text-game-secondary">Last 10 Winners</h1>
            </header>
            {roundRecord && (
              <Last10WinnersCardSpin />
            )}
          </div>

          {/* Bottom Row */}
          {roundRecord && <PlaceBets roundRecord={roundRecord} className="md:col-span-6 col-span-12 md:row-span-5 md:order-2 order-1" globalBetAmount={globalBetAmount} />}

        </main>
      </section>
    </>
  );
};

export default GamePage;
