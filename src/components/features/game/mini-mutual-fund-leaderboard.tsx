import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { notFound } from "next/navigation";
import BetInputForm from "./mini-mutual-fund-place";
import LeaderboardTable from "./mini-mutual-fund-leaderboard-table";

const MiniMutualFundLeaderBoard = () => {
    const t = useTranslations("game");
    const { lobbyRound } = useGameStore();
    const roundRecord = lobbyRound?.roundRecord ?? null;

    if (!roundRecord) return notFound();

    const { stocks: leaderboardData } = useLeaderboard(roundRecord);
    console.log(leaderboardData);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
    const { isGameOver } = useGameState(roundRecord);

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord?.id);

    useEffect(() => {
        if (roundRecord) {
            const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;
            const timer = setTimeout(() => {
                refetch();
            }, resultFetchTime);
            return () => clearTimeout(timer);
        }
    }, [roundRecord, refetch]);

    const winnerNumber = useMemo(() => {
        if (!isSuccess || !roundRecord) return null;
        const winningId = data.data?.winningId;
        if (!winningId) return 0;
        const winningNumber = roundRecord.market.find((item) => item.id === winningId);
        return winningNumber ? winningNumber.horse : null;
    }, [data, isSuccess, roundRecord]);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            // Adjust for the height of the BetInputForm
            setScrollAreaHeight(sectionHeight - 320); // Adjust based on your BetInputForm height
        }
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const getChangeColor = (changePercent: string) => {
        const change = parseFloat(changePercent);
        if (change > 0) return "text-green-500";
        if (change < 0) return "text-red-500";
        return "text-gray-300";
    };

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