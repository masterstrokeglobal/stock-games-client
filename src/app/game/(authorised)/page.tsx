"use client";
import CurrentBets from "@/components/features/game/current-bets";
import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import GameResultDialog from "@/components/features/game/result-dialog";
import RouletteGame from "@/components/features/game/roulette-game";
import HorseRace from "@/components/features/horse-animation/horse";
import { useCurrentGame, useGameState, useShowResults } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { RoundRecord } from "@/models/round-record";
import Image from "next/image";
import { useState } from "react";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};
const GamePage = () => {
    const { roundRecord } = useCurrentGame();

    const {previousRoundId,showResults,currentRoundId} = useShowResults(roundRecord);
    const { isMobile } = useWindowSize();
    console.log(previousRoundId,currentRoundId);
    return (
        <section className="bg-primary-game pt-20 h-screen">
            <Navbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 gap-4 h-full p-4">
                <div
                    style={borderStyle}
                    className="col-span-7 row-span-2 rounded-2xl  overflow-hidden">
                    {roundRecord && <HorseRace roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}

                    className="col-span-5 row-span-2 rounded-2xl ">
                    {roundRecord && <LeaderBoard roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="col-span-7 row-span-3 rounded-2xl ">
                    {roundRecord && <RouletteGame roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="col-span-5 row-span-3 rounded-2xl ">

                    <CurrentBets roundId={roundRecord?.id.toString()!} />
                </div>
            </main>}

            {isMobile && <section className="text-white">
                <header className="bg-[#1E2E57] mx-auto flex justify-center flex-col text-center min-h-[20vh]" >
                    <h1>Round Starts in</h1>
                    <p className="jersey text-8xl leading-[5rem]">
                        <TimeLeft roundRecord={roundRecord!} />
                    </p>
                </header>
                <main className="bg-[#0A1634]">
                    {roundRecord && <RouletteGame roundRecord={roundRecord} />}
                    <div className="px-2">
                        <CurrentBets roundId={roundRecord?.id.toString()!} />
                    </div>
                </main>
            </section>}

            <GameResultDialog open={showResults} roundRecordId={previousRoundId!} />
        </section>
    );
};

export default GamePage;

const TimeLeft = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const gameState = useGameState(roundRecord);
    return gameState.placeTimeLeft.formatted;
}

