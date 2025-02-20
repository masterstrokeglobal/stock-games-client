"use client";
import LeaderBoard from "@/components/features/game/leaderboard";
import LobbyGameResultDialog from "@/components/features/game/lobby-result-dialog";
import MultiplayerRouletteGame from "@/components/features/game/multiplayer-roulette-board";
import Navbar from "@/components/features/game/navbar";
import PlacementBetsLobby from "@/components/features/game/placement-bets-lobby";
import { MobileGameHeader } from "@/components/features/game/roulette-header";
import HorseRace from "@/components/features/horse-animation/horse";
import useLobbyWebSocket from "@/components/features/lobby/lobby-websocket";
import { useHorseRaceSound } from "@/context/audio-context";
import { useGameState, useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { LobbyGameType } from "@/models/lobby";
import LobbyPlacement from "@/models/lobby-placement";
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
    const isPlaceOver = useIsPlaceOver(lobbyRound?.roundRecord || null);

    const filteredMarket: MarketItem[] = useMemo(() => {
        if (isSuccess) {
            const lobbyPlacements: LobbyPlacement[] = data.data.placements;
            const marketItems: MarketItem[] = lobbyPlacements.map((placement) => placement.marketItem!);
            if (lobby?.gameType === LobbyGameType.GUESS_HIGHER) return marketItems;
            return [];
        }
        return [];
    }, [isSuccess, data, lobby?.gameType]);
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
                    {(lobbyRound && lobby) && <MultiplayerRouletteGame result={resultData} lobbyRound={lobbyRound} lobby={lobby} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl ">
                    {roundRecord && filteredMarket && <LeaderBoard roundRecord={roundRecord} filteredMarket={filteredMarket} result={resultData} />}

                </div>
            </main>}
            {(isMobile && lobbyRound && lobby) && <>
                <section className="text-white">
                    {lobbyRound.roundRecord && <MobileHeader roundRecord={lobbyRound.roundRecord} filteredMarket={filteredMarket} />}
                    {!isPlaceOver && <main className="bg-[#0A1634]">
                        <div className="px-2">
                            {lobbyRound.roundRecord && <MultiplayerRouletteGame lobbyRound={lobbyRound} lobby={lobby} />}
                            {lobbyRound && lobby &&  <PlacementBetsLobby lobbyRound={lobbyRound} lobby={lobby} sendMessage={sendMessage} />}
                        </div>
                    </main>}
                    {(isPlaceOver && lobbyRound.roundRecord) && <LeaderBoard roundRecord={lobbyRound.roundRecord} filteredMarket={filteredMarket} result={resultData} />}
                    {isPlaceOver && lobbyRound && lobby && <PlacementBetsLobby className="my-6" lobbyRound={lobbyRound} lobby={lobby} sendMessage={sendMessage} />}
                </section>
            </>}
            {lobbyRound?.id && lobby && resultData && <LobbyGameResultDialog lobby={lobby} key={String(showResults)} open={showResults} result={resultData} />}
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
            {(roundRecord && filteredMarket )&& <HorseRace roundRecord={roundRecord} filteredMarket={filteredMarket} />}
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