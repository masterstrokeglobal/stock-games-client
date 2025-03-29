"use client";
import CurrentBets from "@/components/features/game/current-bets";
import LastWinners from "@/components/features/game/last-winners";
import LeaderBoard from "@/components/features/game/leaderboard";
import Navbar from "@/components/features/game/navbar";
import RouletteGame from "@/components/features/game/roulette-game";
import { MobileGameHeader } from "@/components/features/game/roulette-header";
import UserWins from "@/components/features/game/user-wins-toggle";
import HorseRace from "@/components/features/horse-animation/horse";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame, useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
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
        <section className={cn("bg-background-game pt-14 md:min-h-screen ", isMobile && "bg-background-secondary")}>
            <Navbar />
            <UserWins />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 max-h-[690px] gap-x-2 gap-y-2 h-full px-4 pb-4">
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 row-span-2 rounded-2xl  overflow-hidden">
                    {roundRecord && <HorseRace roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-2 rounded-2xl ">
                    {roundRecord && <LeaderBoard roundRecord={roundRecord} />}

                </div>
              
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 bg-las row-span-3 bg-background-secondary rounded-2xl overflow-y-auto">
                    {roundRecord && <RouletteGame roundRecord={roundRecord} />}
                </div>
                <div style={borderStyle}
                    className="xl:col-span-3 col-span-4 row-span-3 rounded-2xl ">
                    {roundRecord && <CurrentBets round={roundRecord} />}
                </div>
                <div style={borderStyle}
                    className="xl:col-span-2 col-span-4 overflow-hidden row-span-3 rounded-2xl ">
                    {roundRecord && <LastWinners />}
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

    return <section className="text-game-text">
        <MobileHeader roundRecord={roundRecord} />
        {!isPlaceOver && <main className="bg-[#0A1634]">
            <div className="md:px-2">
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


    return <header className="bg-background-game mx-auto flex justify-center flex-col text-center min-h-[20vh]" >
        <h1>
            {t("round-starts-in")}
        </h1>
        <p className="jersey text-8xl leading-[5rem]">
            <TimeLeft roundRecord={roundRecord!} />
        </p>
    </header>
}