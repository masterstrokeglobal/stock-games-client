"use client";
import LeaderBoard from "@/components/features/game/leaderboard-lobby";
import Navbar from "@/components/features/game/navbar";
import PlacementBetsSingleGame from "@/components/features/game/placement-bet-single-game";
import { MobileGameHeader } from "@/components/features/game/roulette-header";
import SinglePlayerRouletteGame from "@/components/features/game/singleplayer-roulette-board";
import HorseRace from "@/components/features/horse-animation/horse";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame, useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import { useRoundRecordGameType } from "@/hooks/use-game-type";
import useWindowSize from "@/hooks/use-window-size";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useTranslations } from "next-intl";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};
const GamePage = () => {
    const [roundRecordGameType] = useRoundRecordGameType();
    const { roundRecord } = useCurrentGame(roundRecordGameType);
    const { isMobile } = useWindowSize();
    useHorseRaceSound(roundRecord);
    const isPlaceOver = useIsPlaceOver(roundRecord);

    return (
        <section className="bg-primary-game pt-20 md:h-screen ">
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
                    {roundRecord && <PlacementBetsSingleGame roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8  row-span-3 rounded-2xl ">
                    {roundRecord && <SinglePlayerRouletteGame roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl ">
                    {roundRecord && <LeaderBoard roundRecord={roundRecord} />}
                </div>
            </main>}
            {(isMobile && roundRecord) && <>
                <section className="text-white">
                    {roundRecord && <MobileHeader roundRecord={roundRecord} />}
                    {!isPlaceOver && <main className="bg-[#0A1634]">
                        <div className="px-2">
                            {roundRecord && <SinglePlayerRouletteGame roundRecord={roundRecord} />}
                            {roundRecord && <PlacementBetsSingleGame roundRecord={roundRecord} />}
                        </div>
                    </main>}
                    {(isPlaceOver && roundRecord) && <LeaderBoard roundRecord={roundRecord} />}
                    {isPlaceOver && roundRecord && <PlacementBetsSingleGame roundRecord={roundRecord} />}
                </section>
            </>}
        </section>
    );
};

export default GamePage;

const TimeLeft = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const gameState = useGameState(roundRecord);
    return gameState.placeTimeLeft.formatted;
}


const MobileHeader = ({ roundRecord, filteredMarket }: { roundRecord: RoundRecord, filteredMarket?: MarketItem[]; }) => {
    const isPlaceOver = useIsPlaceOver(roundRecord);
    const t = useTranslations("game");
    if (isPlaceOver) return <>
        <MobileGameHeader roundRecord={roundRecord} />
        <div className="m-2 rounded-xl overflow-hidden">
            {(roundRecord && filteredMarket) && <HorseRace roundRecord={roundRecord} filteredMarket={filteredMarket} />}
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