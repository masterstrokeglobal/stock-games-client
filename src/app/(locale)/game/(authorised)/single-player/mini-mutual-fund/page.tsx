"use client";
import BackToLobbiesButton from "@/components/features/game/back-to-lobbies-button";
import { MobileHeader } from "@/components/features/game/common/mobile-components";
import CurrentBetsMiniMutualFunds from "@/components/features/game/current-bets-mini-mutual-funds";
import MiniMutualFundBet from "@/components/features/game/mini-mutual-fund-bet";
import MiniMutualFundLeaderBoard from "@/components/features/game/mini-mutual-fund-leaderboard";
import Navbar from "@/components/features/game/navbar";
import HorseRace from "@/components/features/horse-animation/mmf-horse";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame, useIsPlaceOver } from "@/hooks/use-current-game";
import { useRoundRecordGameType } from "@/hooks/use-game-type";
import useWindowSize from "@/hooks/use-window-size";
import { useSinglePlayerGameStore } from "@/store/single-player-game-store";
import { useEffect } from "react";

const borderStyle = {
    borderColor: "#3799ED",
    borderWidth: "1px",
    borderStyle: "solid",
};

const GamePage = () => {
    const { isMobile } = useWindowSize();

    const [roundRecordGameType] = useRoundRecordGameType();
    const { roundRecord: roundRecordData, isLoading: isRoundLoading } = useCurrentGame(roundRecordGameType);
    useHorseRaceSound(roundRecordData);
    const isPlaceOver = useIsPlaceOver(roundRecordData);

    // Game store integration
    const {
        setRoundRecord,
        roundRecord: storeRoundRecord
    } = useSinglePlayerGameStore();


    // Update store when data changes
    useEffect(() => {
        setRoundRecord(roundRecordData || null);
    }, [roundRecordData, setRoundRecord]);


    const roundRecord = storeRoundRecord ? storeRoundRecord : null;
    useHorseRaceSound(roundRecord);

    if (isRoundLoading) return <div>Loading...</div>;



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
                    {roundRecord &&
                        <MiniMutualFundBet />
                    }
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-5 col-span-4 row-span-3 rounded-2xl">
                    {roundRecord && <MiniMutualFundLeaderBoard />}
                </div>
            </main>}

            {(isMobile && roundRecord) &&
                <section className="text-white">
                    {roundRecord &&
                        <MobileHeader
                            roundRecord={roundRecord}
                        />
                    }

                    {roundRecord && <HorseRace roundRecord={roundRecord} />}

                    <BackToLobbiesButton />

                    {!isPlaceOver &&
                        <main className="bg-[#0A1634]">
                            <div className="px-2">
                                {roundRecord &&
                                    <MiniMutualFundBet />
                                }
                            </div>
                        </main>
                    }
                    {roundRecord &&
                        <MiniMutualFundLeaderBoard />
                    }
                    {isPlaceOver && roundRecord &&
                        <CurrentBetsMiniMutualFunds />
                    }
                </section>
            }
        </section>
    );
};

export default GamePage;
