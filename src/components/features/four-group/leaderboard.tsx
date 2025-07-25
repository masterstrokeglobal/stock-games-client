"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";

type Props = {
    roundRecord: RoundRecord;
    className?: string;
    order?: "asc" | "desc";
}

const LeaderBoard = ({ roundRecord, className, order = "desc"    }: Props) => {
    const t = useTranslations("game");
    const { stocks: leaderboardData } = useLeaderboard(roundRecord);
    const { isGameOver } = useGameState(roundRecord);
    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord.id);

    useEffect(() => {
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;
        const timer = setTimeout(() => refetch(), resultFetchTime);
        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winnerNumbers: number[] = useMemo(() => {
        if (!isSuccess) return [];
        const winningId = data.data?.winningId;
        if (!winningId) return [];
        const winningNumbers = roundRecord.market.filter((item) => winningId.includes(item.id));
        if (!winningNumbers) return [];
        return winningNumbers.map((item) => item.horse).filter((item) => item !== undefined) as number[];
    }, [data, isSuccess, roundRecord.market]);

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
        return "text-game-secondary";
    };

    const winnerMarketItems = leaderboardData.filter((item) => winnerNumbers.includes(item.horse!));
    const sortedLeaderboardData = useMemo(() => {
        return [...leaderboardData].sort((a, b) => order === "asc" ? Number(a.change_percent ?? 0   ) - Number(b.change_percent ?? 0) : Number(b.change_percent ?? 0) - Number(a.change_percent ?? 0));
    }, [leaderboardData, order]);

    return (
        <div className={cn("w-full bg-black/50 backdrop-blur-md  overflow-hidden", className)}>
            <div className="p-2 text-white text-sm font-bold border-b border-white/10">
                Leaderboard
            </div>
            <ScrollArea className="h-[calc(100%-40px)]">
                <table className="w-full">
                    <thead className="bg-black/30">
                        <tr className="text-white text-xs">
                            <th className="p-1 text-left w-8">{t("rank")}</th>
                            <th className="p-1 text-left">{t("cards")}</th>
                            <th className="p-1 text-right">{t("price")}</th>
                            <th className="p-1 text-right">{t("change")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {winnerMarketItems.map((winnerMarketItem) => (
                            <tr key={winnerMarketItem.horse} className="border-b border-white/10 text-white/80 text-xs whitespace-nowrap">
                                <td className="p-1">
                                    <img src="/crown.png" alt="Rank 1" className="w-6 h-6" />
                                </td>
                                <td className="p-1">{winnerMarketItem.name}</td>
                                <td className="p-1 text-right">
                                    {roundRecord.type === SchedulerType.CRYPTO ? "USDC " : 
                                     roundRecord.type === SchedulerType.USA_MARKET ? "$" : "Rs."}
                                    {winnerMarketItem.price ? formatPrice(winnerMarketItem.price) : "-"}
                                </td>
                                <td className={cn("p-1 text-right", getChangeColor(winnerMarketItem.change_percent))}>
                                    {parseFloat(winnerMarketItem.change_percent) > 0 ? '+' : ''}
                                    {winnerMarketItem.change_percent ?? 0}%
                                </td>
                            </tr>
                        ))}

                        {sortedLeaderboardData.filter((item) => !winnerNumbers.includes(item.horse!)).map((marketItem, index) => (
                            <tr key={index} className="border-b border-white/10 text-white/80 text-xs whitespace-nowrap">
                                <td className="p-1">    
                                    {(index === 0 && !isGameOver) ? (
                                        <img src="/rank-1.png" alt="Rank 1" className="w-6 h-6 mx-auto" />
                                    ) : winnerNumbers.includes(marketItem.horse!) ? (
                                        <img src="/rank-1.svg" alt="Rank 1" className="size-6 mx-auto" />
                                    ) : (
                                        <div className="text-center">
                                            {!isGameOver ? index + 1  : "-"}
                                        </div>
                                    )}
                                </td>
                                <td className="p-1">{marketItem.name}</td>
                                <td className="p-1 text-right">
                                    {roundRecord.type === SchedulerType.CRYPTO ? "USDC " : 
                                     roundRecord.type === SchedulerType.USA_MARKET ? "$" : "Rs."}
                                    {marketItem.price ? formatPrice(marketItem.price) : "-"}
                                </td>
                                <td className={cn("p-1 text-right", getChangeColor(marketItem.change_percent))}>
                                    {!isGameOver ? (parseFloat(marketItem.change_percent) > 0 ? '↑ ' : '↓ ') : ''}
                                    {!isGameOver ? (marketItem.change_percent ?? 0) : '--'}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </div>
    );
};

export default LeaderBoard;