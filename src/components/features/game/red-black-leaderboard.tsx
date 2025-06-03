"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import LeaderboardHeader from "./leaderboard-header";
import useWindowSize from "@/hooks/use-window-size";


// Enhanced interface for ranked market items
type Props = {
    roundRecord: RoundRecord;
    className?: string;
}

const RedBlackLeaderBoard = ({ roundRecord, className }: Props) => {
    const t = useTranslations("game");
    const { stocks: leaderboardData } = useLeaderboard(roundRecord);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
    const { isGameOver } = useGameState(roundRecord);
    const { isMobile } = useWindowSize();

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord.id);

    useEffect(() => {
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;

        const timer = setTimeout(() => {
            console.log('refetching');
            refetch();
        }, resultFetchTime);

        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winnerNumber = useMemo(() => {
        if (!isSuccess) return null;
        const winningId = data.data?.winningId;

        if (!winningId) return 0;

        const winningNumber = roundRecord.market.find((item) => item.id === winningId);
        if (!winningNumber) return null;
        return winningNumber.horse;
    }, [data, isSuccess]);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight);
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
        return "text-game-text";
    };

    const winnerMarketItem = leaderboardData.find((item) => item.horse === winnerNumber);

    return (
        <section
            ref={sectionRef}
            className={cn("md:rounded-2xl h-full overflow-hidden w-full", className)}
        >
            <LeaderboardHeader />
            <ScrollArea
                className="h-full"
                style={{ height: isMobile ? "fit-content" : `${scrollAreaHeight}px` }}
                type="auto"
            >
                <table className="min-w-full mb-12  ">
                    <thead className="bg-opacity-50">
                        <tr className="text-game-text text-sm">
                            <th className="p-2 text-left w-12 text-white">
                                {t("rank")}
                            </th>
                            <th className="p-2 text-left text-white">
                                {t("bull")}
                            </th>
                            <th className="p-2 text-left text-white">
                                {t("name")}
                            </th>
                            <th className="p-2 text-right text-white">
                                {t("price")}
                            </th>
                            <th className="p-2 text-right whitespace-nowrap text-white">
                                {t("change")}
                            </th>

                        </tr>
                    </thead>
                    <tbody className="">
                        {winnerMarketItem && (
                            <tr className="border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden text-white">
                                <td className="p-2 ">
                                    <img src="/rank-1.svg" alt="Rank 1" className="w-8 h-8" />
                                </td>
                                <td className="p-2">
                                    {winnerMarketItem.horse}
                                </td>
                                <td className="p-2">
                                    {winnerMarketItem.name}
                                </td>
                                <td className="p-2  text-right">
                                    {roundRecord.type === SchedulerType.CRYPTO ? "USDC " : "Rs."}
                                    {winnerMarketItem.price ? formatPrice(winnerMarketItem.price) : "-"}
                                </td>
                                <td className={cn(
                                    "p-2 text-right",
                                    getChangeColor(winnerMarketItem.change_percent)
                                )}>
                                    {parseFloat(winnerMarketItem.change_percent) > 0 ? '+' : ''}
                                    {winnerMarketItem.change_percent ?? 0}%</td>
                            </tr>
                        )}

                        {leaderboardData.filter((item) => item.horse !== winnerNumber).map((marketItem, index) => (
                            <tr
                                key={index}

                                className={cn("border-b last:border-none rounded-lg border-[#DADCE00D] text-white overflow-hidden", (index === 0 && winnerNumber == 0) ? "bg-[#ffb71a]/30 text-base font-bold" : "text-sm")}
                            >
                                <td className="p-2">

                                    {(index === 0 && winnerNumber == 0 && !isGameOver) ? (
                                        <img
                                            src="/rank-1.svg"
                                            alt="Rank 1"
                                            className="w-8 h-8"
                                        />
                                    ) : winnerNumber == marketItem.horse ? (
                                        <img
                                            src="/rank-1.svg"
                                            alt="Rank 1"
                                            className="size-8"
                                        />
                                    ) : (
                                        <span className="text-white">
                                            {(winnerNumber == 0 && !isGameOver) ? (index + 1) : "-"}
                                        </span>
                                    )}
                                </td>
                                <td className="p-2">
                                    {marketItem.horse == 17 ? 0 : marketItem.horse}
                                </td>
                                <td className="p-2">
                                    {marketItem.name}
                                </td>
                                <td className="p-2  text-right whitespace-nowrap text-white">
                                    {roundRecord.type === SchedulerType.CRYPTO ? "USDC " : "Rs."}
                                    {marketItem.price ? formatPrice(marketItem.price) : "-"}
                                </td>
                                <td className={cn(
                                    "p-2  text-right",
                                    getChangeColor(marketItem.change_percent)
                                )}>

                                    {!isGameOver ? (parseFloat(marketItem.change_percent) > 0 ? '+' : '') : ''}
                                    {!isGameOver ? (marketItem.change_percent ?? 0) : '--'}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="h-8" />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
};

export default RedBlackLeaderBoard;