"use client";
import BackToLobbiesButton from "@/components/features/game/back-to-lobbies-button";
import { MobileHeader } from "@/components/features/game/common/mobile-components";
import CurrentBetsMiniMutualFunds from "@/components/features/game/current-bets-mini-mutual-funds";
import LobbyGameResultDialog from "@/components/features/game/mmf-result-dialog";
import MiniMutualFundBet from "@/components/features/game/mini-mutual-fund-bet";
import MiniMutualFundLeaderBoard from "@/components/features/game/mini-mutual-fund-leaderboard";
import Navbar from "@/components/features/game/navbar";
import HorseRace from "@/components/features/horse-animation/mmf-horse";
import useLobbyWebSocket from "@/components/features/lobby/lobby-websocket";
import { useHorseRaceSound } from "@/context/audio-context";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import useWindowSize from "@/hooks/use-window-size";
import { useGetCurrentLobbyRound, useGetLobbyByCode } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

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

    const isPlaceOver = useIsPlaceOver(storeLobbyRound?.roundRecord || null);


    const { showResults, resultData } = useLobbyWebSocket({
        lobbyCode: lobbyCode,
        lobbyId: storeLobby?.id,
        gameType: storeLobby?.gameType
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
                    {roundRecord && <HorseRace roundRecord={roundRecord} />}
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-2 rounded-2xl">
                    <CurrentBetsMiniMutualFunds />
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-7 col-span-8 row-span-3 rounded-2xl">
                    {(storeLobbyRound && storeLobby) &&
                        <MiniMutualFundBet />
                    }
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl">
                    {roundRecord && <MiniMutualFundLeaderBoard />}
                </div>
            </main>}

            {(isMobile && storeLobbyRound && storeLobby) &&
                <section className="text-white">
                    {storeLobbyRound.roundRecord &&
                        <MobileHeader
                            roundRecord={storeLobbyRound.roundRecord}
                        />
                    }

                    {storeLobbyRound.roundRecord && <HorseRace roundRecord={storeLobbyRound.roundRecord} />}

                    <BackToLobbiesButton />

                    {!isPlaceOver &&
                        <main className="bg-[#0A1634]">
                            <div className="px-2">
                                {storeLobbyRound.roundRecord &&
                                    <MiniMutualFundBet />
                                }
                            </div>
                        </main>
                    }
                    {(storeLobbyRound.roundRecord) &&
                        <MiniMutualFundLeaderBoard />
                    }
                    {isPlaceOver && storeLobbyRound && storeLobby &&
                        <CurrentBetsMiniMutualFunds />
                    }
                </section>
            }
            {storeLobbyRound?.id && storeLobby && resultData &&
                <LobbyGameResultDialog
                    lobby={storeLobby}
                    key={String(showResults)}
                    open={showResults}
                    result={resultData as any}
                />
            }
        </section>
    );
};

export default GamePage;
