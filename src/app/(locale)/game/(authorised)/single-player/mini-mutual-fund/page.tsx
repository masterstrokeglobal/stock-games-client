"use client";
import Navbar from "@/components/features/game/navbar";
import StockSelectionGridSinglePlayer from "@/components/features/game/single-player/mmf/mini-mutual-fund-bet-single-player";
import StockProgressChart from "@/components/features/game/single-player/mmf/mmf-stock-chart";
import { useHorseRaceSound } from "@/context/audio-context";
import { useCurrentGame, useIsPlaceOver } from "@/hooks/use-current-game";
import { useRoundRecordGameType } from "@/hooks/use-game-type";
import useWindowSize from "@/hooks/use-window-size";
import { useSinglePlayerGameStore } from "@/store/single-player-game-store";
import { useEffect } from "react";

const borderStyle = {
    borderColor: "#22c55e", // Changed to green
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

    if (isRoundLoading || !storeRoundRecord) return <div className="text-red-500">Loading...</div>;

    return (
        <section className="bg-primary-game pt-20 md:h-screen">
            <Navbar />
            {!isMobile && <main className="grid grid-cols-12 grid-rows-5 gap-4 h-full p-4">
                <div
                    style={borderStyle}
                    className="xl:col-span-12 col-span-4 row-span-2 rounded-2xl bg-green-900">
                    <StockProgressChart />
                </div>
                <div
                    style={borderStyle}
                    className="xl:col-span-12 col-span-12 overflow-hidden row-span-3 rounded-2xl bg-green-900">
                    {roundRecord &&
                        <StockSelectionGridSinglePlayer />
                    }
                </div>
            </main>}

        </section>
    );
};

export default GamePage;
