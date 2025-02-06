"use client";
import CurrentBets from "@/components/features/game/current-bets";
import LeaderBoard from "@/components/features/game/leaderboard";
import MultiplayerRouletteGame from "@/components/features/game/multiplayer-roulette-board";
import Navbar from "@/components/features/game/navbar";
import PlacementBetsLobby from "@/components/features/game/placement-bets-lobby";
import RouletteGame from "@/components/features/game/roulette-game";
import { MobileGameHeader } from "@/components/features/game/roulette-header";
import HorseRace from "@/components/features/horse-animation/horse";
import useLobbyWebSocket from "@/components/features/lobby/lobby-websocket";
import { useHorseRaceSound } from "@/context/audio-context";
import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { RoundRecord } from "@/models/round-record";
import { useGetCurrentLobbyRound, useGetLobbyByCode } from "@/react-query/lobby-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};
const GamePage = () => {
    const lobbyCode = useParams().id!.toString();

    const { data: lobby, isLoading } = useGetLobbyByCode(lobbyCode);
    const { data: lobbyRound } = useGetCurrentLobbyRound(lobby?.id);
    const { isMobile } = useWindowSize();
    useLobbyWebSocket(lobby?.id, lobby?.joiningCode);

    let roundRecord = lobbyRound ? lobbyRound.roundRecord : null;
    useHorseRaceSound(roundRecord);
    if (isLoading && lobbyRound == undefined) return <div>Loading...</div>


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
                    {lobbyRound && <PlacementBetsLobby lobbyRound={lobbyRound} />}

                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8  row-span-3 rounded-2xl ">
                    {(lobbyRound && lobby) && <MultiplayerRouletteGame lobbyRound={lobbyRound} lobby={lobby} />}
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