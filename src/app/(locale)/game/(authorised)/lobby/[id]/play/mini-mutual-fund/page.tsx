"use client";
import { MobileHeader } from "@/components/features/game/common/mobile-components";
import LeaderBoard from "@/components/features/game/leaderboard";
import LobbyGameResultDialog from "@/components/features/game/lobby-result-dialog";
import MiniMutualFundBet from "@/components/features/game/mini-mutual-fund-bet";
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
import { useGameStore } from "@/store/game-store";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};

const GamePage = () => {
    const lobbyCode = useParams().id!.toString();
    const { isMobile } = useWindowSize();

    // Game store integration
    const {
        setLobby,
        setLobbyRound,
        setLobbyLoading,
        setRoundLoading,
        lobby: storeLobby,
        lobbyRound: storeLobbyRound
    } = useGameStore();

    const { data: lobby, isLoading: isLobbyLoading } = useGetLobbyByCode(lobbyCode);
    const { data: lobbyRound, isLoading: isRoundLoading } = useGetCurrentLobbyRound(lobby?.id);

    // Update store when data changes
    useEffect(() => {
        setLobby(lobby || null);
        setLobbyLoading(isLobbyLoading);
    }, [lobby, isLobbyLoading, setLobby, setLobbyLoading]);

    useEffect(() => {
        setLobbyRound(lobbyRound || null);
        setRoundLoading(isRoundLoading);
    }, [lobbyRound, isRoundLoading, setLobbyRound, setRoundLoading]);

    const { data, isSuccess } = useGetAllPlacementForLobbyRound(storeLobbyRound?.id?.toString());
    const isPlaceOver = useIsPlaceOver(storeLobbyRound?.roundRecord || null);

    const filteredMarket: MarketItem[] = useMemo(() => {
        if (isSuccess) {
            const lobbyPlacements: LobbyPlacement[] = data.data.placements;
            const marketItems: MarketItem[] = lobbyPlacements.map((placement) => placement.marketItem!);
            if (storeLobby?.gameType === LobbyGameType.GUESS_HIGHER) return marketItems;
            return [];
        }
        return [];
    }, [isSuccess, data, storeLobby?.gameType]);

    const { showResults, resultData, sendMessage } = useLobbyWebSocket({
        lobbyCode: lobbyCode,
        lobbyId: storeLobby?.id
    });

    const roundRecord = storeLobbyRound ? storeLobbyRound.roundRecord : null;
    useHorseRaceSound(roundRecord);

    if (isLobbyLoading && storeLobbyRound == undefined) return <div>Loading...</div>;

    return (
        <section className="bg-primary-game pt-20 md:h-screen">
            <Navbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 gap-4 h-full p-4">
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 row-span-2 rounded-2xl overflow-hidden">
                    {roundRecord && <HorseRace roundRecord={roundRecord} filteredMarket={filteredMarket} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-2 rounded-2xl">

                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 row-span-3 rounded-2xl">
                    {(storeLobbyRound && storeLobby) &&
                        <MiniMutualFundBet
                        />
                    }
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl">
                    {roundRecord && filteredMarket &&
                        <LeaderBoard
                            roundRecord={roundRecord}
                            filteredMarket={filteredMarket}
                            result={resultData}
                        />
                    }
                </div>
            </main>}

            {(isMobile && storeLobbyRound && storeLobby) &&
                <section className="text-white">
                    {storeLobbyRound.roundRecord &&
                        <MobileHeader
                            roundRecord={storeLobbyRound.roundRecord}
                            filteredMarket={filteredMarket}
                        />
                    }
                    {!isPlaceOver &&
                        <main className="bg-[#0A1634]">
                            <div className="px-2">
                                {storeLobbyRound.roundRecord &&
                                    <MiniMutualFundBet/>
                                }
                                {storeLobbyRound && storeLobby &&
                                    <PlacementBetsLobby
                                        lobbyRound={storeLobbyRound}
                                        lobby={storeLobby}
                                        sendMessage={sendMessage}
                                    />
                                }
                            </div>
                        </main>
                    }
                    {(isPlaceOver && storeLobbyRound.roundRecord) &&
                        <LeaderBoard
                            roundRecord={storeLobbyRound.roundRecord}
                            filteredMarket={filteredMarket}
                            result={resultData}
                        />
                    }
                    {isPlaceOver && storeLobbyRound && storeLobby &&
                        <PlacementBetsLobby
                            className="my-6"
                            lobbyRound={storeLobbyRound}
                            lobby={storeLobby}
                            sendMessage={sendMessage}
                        />
                    }
                </section>
            }

            {storeLobbyRound?.id && storeLobby && resultData &&
                <LobbyGameResultDialog
                    lobby={storeLobby}
                    key={String(showResults)}
                    open={showResults}
                    result={resultData}
                />
            }
        </section>
    );
};

export default GamePage;
