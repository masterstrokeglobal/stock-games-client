"use client";
import LeaderBoard from "@/components/features/game/leaderboard";
import MultiplayerRouletteGame from "@/components/features/game/multiplayer-roulette-board";
import LobbyGameResultDialog from "@/components/features/game/multiple-result-dialog";
import Navbar from "@/components/features/game/navbar";
import PlacementBetsLobby from "@/components/features/game/placement-bets-lobby";
import { MobileGameHeader } from "@/components/features/game/roulette-header";
import HorseRace from "@/components/features/horse-animation/horse";
import useLobbyWebSocket from "@/components/features/lobby/lobby-websocket";
import { useHorseRaceSound } from "@/context/audio-context";
import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import Lobby, { LobbyGameType } from "@/models/lobby";
import LobbyPlacement from "@/models/lobby-placement";
import LobbyRound from "@/models/lobby-round";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetAllPlacementForLobbyRound } from "@/react-query/game-record-queries";
import { useGetCurrentLobbyRound, useGetLobbyByCode } from "@/react-query/lobby-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";

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
    const { data, isSuccess } = useGetAllPlacementForLobbyRound(lobbyRound?.id?.toString());

    const filteredMarket: MarketItem[] = useMemo(() => {
        if (isSuccess) {
            const lobbyPlacements: LobbyPlacement[] = data.data.placements;
            const marketItems: MarketItem[] = lobbyPlacements.map((placement) => placement.marketItem!);
            if (lobby?.gameType === LobbyGameType.GUESS_HIGHER) return marketItems;
            return [];
        }
        return [];
    }, [isSuccess, data]);
    const { showResults, resultData, sendMessage } = useLobbyWebSocket({ lobbyCode: lobbyCode, lobbyId: lobby?.id });

    const roundRecord = lobbyRound ? lobbyRound.roundRecord : null;
    useHorseRaceSound(roundRecord);
    if (isLoading && lobbyRound == undefined) return <div>Loading...</div>



    return (
        <section className="bg-primary-game pt-20 md:h-screen ">
            <Navbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 gap-4 h-full p-4">
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 row-span-2 rounded-2xl  overflow-hidden">
                    {roundRecord && <HorseRace roundRecord={roundRecord} filteredMarket={filteredMarket} />}
                </div>
                <div
                    style={borderStyle}

                    className="xl:col-span-5 col-span-4 row-span-2 rounded-2xl ">
                    {lobbyRound && lobby && <PlacementBetsLobby lobbyRound={lobbyRound} lobby={lobby} sendMessage={sendMessage} />}

                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8  row-span-3 rounded-2xl ">
                    {(lobbyRound && lobby) && <MultiplayerRouletteGame lobbyRound={lobbyRound} lobby={lobby} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl ">
                    {roundRecord && <LeaderBoard roundRecord={roundRecord} filteredMarket={filteredMarket} />}

                </div>
            </main>}
            {lobbyRound?.id && lobby && <LobbyGameResultDialog lobby={lobby} key={String(showResults)} open={showResults} result={resultData} />}


            {(isMobile && lobbyRound && lobby) && <MobileGame lobby={lobby} lobbyRound={lobbyRound} sendMessage={sendMessage} />}
        </section>
    );
};

export default GamePage;

const TimeLeft = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    const gameState = useGameState(roundRecord);
    return gameState.placeTimeLeft.formatted;
}


const MobileGame = ({ lobby, lobbyRound, sendMessage }: { lobbyRound: LobbyRound, lobby: Lobby, sendMessage: (message: string) => void }) => {
    const isPlaceOver = useIsPlaceOver(lobbyRound.roundRecord);

    return <section className="text-white">
        {lobbyRound.roundRecord && <MobileHeader roundRecord={lobbyRound.roundRecord} />}
        {!isPlaceOver && <main className="bg-[#0A1634]">
            <div className="px-2">
                {lobbyRound.roundRecord && <MultiplayerRouletteGame lobbyRound={lobbyRound} lobby={lobby} />}
                {lobbyRound && lobby && <PlacementBetsLobby lobbyRound={lobbyRound} lobby={lobby} sendMessage={sendMessage} />}
            </div>
        </main>}
        {(isPlaceOver && lobbyRound.roundRecord) && <LeaderBoard roundRecord={lobbyRound.roundRecord} />}
        {lobbyRound.roundRecord && <MultiplayerRouletteGame lobbyRound={lobbyRound} lobby={lobby} />}
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