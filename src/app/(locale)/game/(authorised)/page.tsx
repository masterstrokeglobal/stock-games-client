"use client";
import CurrentBets from "@/components/features/game/current-bets";
import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import RouletteGame from "@/components/features/game/roulette-game";
import { MobileGameHeader } from "@/components/features/game/roulette-header";
import HorseRace from "@/components/features/horse-animation/horse";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame, useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { RoundRecord } from "@/models/round-record";
import { useTranslations } from "next-intl";

const borderStyle = {
    borderColor: "var(--primary-game)",
    borderWidth: "1px",
    borderStyle: "solid",
};
const GamePage = () => {
    const { roundRecord } = useCurrentGame();
    const { isMobile } = useWindowSize();
    useHorseRaceSound(roundRecord);


    return (

        <section className="bg-background-game pt-20 md:h-screen ">
            <Navbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 gap-4 h-full p-4">
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 row-span-2 rounded-2xl  overflow-hidden">
                    {roundRecord && <HorseRace roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}

                    className="xl:col-span-5 col-span-4 row-span-2 rounded-2xl ">
                    {roundRecord && <CurrentBets round={roundRecord} />}

                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8  row-span-3 rounded-2xl overflow-y-auto">
                    {roundRecord && <RouletteGame roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl ">
                    {roundRecord && <LeaderBoard roundRecord={roundRecord} />}

                </div>
            </main>}

            {isMobile && roundRecord && <MobileGame roundRecord={roundRecord} />}
        </section>
    );
};

export default GamePage;

const TimeLeft = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const gameState = useGameState(roundRecord);
    return gameState.placeTimeLeft.formatted;
}


const MobileGame = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const isPlaceOver = useIsPlaceOver(roundRecord);

    return <section className="text-white">
        <MobileHeader roundRecord={roundRecord} />
        {!isPlaceOver && <main className="bg-[#0A1634]">
            <div className="px-2">
                {roundRecord && <RouletteGame roundRecord={roundRecord} />}
                {roundRecord && <CurrentBets round={roundRecord} />}
            </div>
        </main>}
        {isPlaceOver && <LeaderBoard roundRecord={roundRecord} />}
        {isPlaceOver && <RouletteGame roundRecord={roundRecord} />}
    </section>
}


const MobileHeader = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const isPlaceOver = useIsPlaceOver(roundRecord);
    const t = useTranslations("game");
    if (isPlaceOver) return <>
        <MobileGameHeader roundRecord={roundRecord} />
        <div className="m-2 rounded-xl overflow-hidden">
            <HorseRace roundRecord={roundRecord} />
        </div>
    </>


    return <header className="bg-[#1E2E57] mx-auto flex justify-center flex-col text-center min-h-[20vh]" >
        <h1>
            {t("round-starts-in")}
        </h1>
        <p className="jersey text-8xl leading-[5rem]">
            <TimeLeft roundRecord={roundRecord!} />
        </p>
    </header>
}