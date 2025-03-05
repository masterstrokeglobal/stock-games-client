import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { useGameStore } from "@/store/game-store";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import LeaderboardTable from "./mini-mutual-fund-leaderboard-table";
import BetInputForm from "./mini-mutual-fund-place";

const MiniMutualFundLeaderBoard = () => {
    const t = useTranslations("game");
    const { lobbyRound } = useGameStore();
    const roundRecord = lobbyRound?.roundRecord ?? null;


    const { stocks: leaderboardData } = useLeaderboard(roundRecord!);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
    const { isGameOver } = useGameState(roundRecord);


    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            // Adjust for the height of the BetInputForm
            setScrollAreaHeight(sectionHeight - 320); // Adjust based on your BetInputForm height
        }
    }, []);


    if (!roundRecord) return null;

    return (
        <section
            ref={sectionRef}
            className="flex flex-col p-4 md:rounded-2xl h-full w-full bg-[#122146]"
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                {t("leaderboard")}
            </h2>

            <LeaderboardTable leaderboardData={leaderboardData} isGameOver={isGameOver} height={scrollAreaHeight} />
            {/* Fixed Betting Form at Bottom */}
            <div className="mt-4">
                <BetInputForm />
            </div>
        </section>
    );
};

export default MiniMutualFundLeaderBoard;