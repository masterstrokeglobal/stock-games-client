"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
// import useWindowSize from "@/hooks/use-window-size";
import { cn, RED_NUMBERS } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";

type Props = {
    roundRecord: RoundRecord;
    className?: string;
}

const RedBlackLeaderBoard = ({ roundRecord, className }: Props) => {
    const t = useTranslations("game");
    const { stocks: leaderboardData } = useLeaderboard(roundRecord);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const { isGameOver } = useGameState(roundRecord);
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


    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const getChangeColor = (changePercent: string) => {
        const change = parseFloat(changePercent);
        if (change > 0) return "text-emerald-400 font-semibold";
        if (change < 0) return "text-rose-500 font-semibold";
        return "text-slate-200";
    };

    const winnerMarketItem = leaderboardData.find((item) => item.horse === winnerNumber);

    return (
        <section
            ref={sectionRef}
            className={cn(
                "h-full overflow-hidden w-full",
                "bg-gradient-to-br from-slate-900/95 via-black/95 to-red-950/95",
                "border border-red-800/30 shadow-2xl shadow-red-900/20",
                "backdrop-blur-xl",
                className
            )}
        >
            <div className="w-full bg-gradient-to-r from-red-700 to-transparent py-3 px-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold text-black">
                    Leaderboard                </h2>
            </div>           <ScrollArea
                className="h-full"
                // style={{ height: isMobile ? "fit-content" : `${scrollAreaHeight}px` }}
                type="auto"
            >
                <table className="min-w-full mb-12">
                    <thead className="bg-gradient-to-r from-red-950/80 via-black/80 to-red-950/80">
                        <tr className="text-sm">
                            <th className="p-3 text-left w-12 text-red-100 font-semibold">
                                {t("rank")}
                            </th>
                            <th className="p-3 text-left text-red-100 font-semibold">
                                {t("color")}
                            </th>
                            <th className="p-3 text-left text-red-100 font-semibold">
                                {t("name")}
                            </th>
                            <th className="p-3 text-right text-red-100 font-semibold">
                                {t("price")}
                            </th>
                            <th className="p-3 text-right whitespace-nowrap text-red-100 font-semibold">
                                {t("change")}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-red-950/30">
                        {winnerMarketItem && (
                            <tr className="bg-gradient-to-r from-red-600/20 via-red-900/20 to-black/30 backdrop-blur-sm text-white">
                                <td className="p-3">
                                    <img src="/rank-1.svg" alt="Rank 1" className="w-8 h-8 drop-shadow-glow" />
                                </td>
                                <td className="p-3 font-semibold">{ RED_NUMBERS.includes(winnerMarketItem.horse ??0) ?<div className="bg-red-500/20 rounded-full w-4 h-4"></div> : <div className="bg-black/20 rounded-full w-4 h-4"></div>}</td>
                                <td className="p-3 font-semibold">{winnerMarketItem.name}</td>
                                <td className="p-3 text-right font-semibold">
                                    {roundRecord.type === SchedulerType.CRYPTO ? "USDC " : "Rs."}
                                    {winnerMarketItem.price ? formatPrice(winnerMarketItem.price) : "-"}
                                </td>
                                <td className={cn("p-3 text-right font-semibold", getChangeColor(winnerMarketItem.change_percent))}>
                                    {parseFloat(winnerMarketItem.change_percent) > 0 ? '+' : ''}
                                    {winnerMarketItem.change_percent ?? 0}%
                                </td>
                            </tr>
                        )}

                        {leaderboardData.filter((item) => item.horse !== winnerNumber).map((marketItem, index) => (
                            <tr
                                key={index}
                                className={cn(
                                    "transition-all duration-200 hover:bg-red-500/10",
                                    (index === 0 && winnerNumber == 0) ?
                                        "bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-black/20 text-base font-bold" :
                                        "text-sm bg-gradient-to-r from-transparent to-transparent hover:from-red-950/30"
                                )}
                            >
                                <td className="p-3">
                                    {(index === 0 && winnerNumber == 0 && !isGameOver) ? (
                                        <img src="/rank-1.svg" alt="Rank 1" className="w-8 h-8 drop-shadow-glow" />
                                    ) : winnerNumber == marketItem.horse ? (
                                        <img src="/rank-1.svg" alt="Rank 1" className="size-8 drop-shadow-glow" />
                                    ) : (
                                        <span className="text-slate-300">
                                            {(winnerNumber == 0 && !isGameOver) ? (index + 1) : "-"}
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 text-slate-300">
                                    {RED_NUMBERS.includes(marketItem.horse ?? 0) ? <div className="bg-red-500 border border-white/80 rounded-full w-4 h-4"></div> : <div className="bg-black border border-white/80 rounded-full w-4 h-4"></div>}
                                </td>
                                <td className="p-3 text-slate-300">
                                    {marketItem.name}
                                </td>
                                <td className="p-3 text-right whitespace-nowrap text-slate-300">
                                    {roundRecord.type === SchedulerType.CRYPTO ? "USDC " : "Rs."}
                                    {marketItem.price ? formatPrice(marketItem.price) : "-"}
                                </td>
                                <td className={cn("p-3 text-right", getChangeColor(marketItem.change_percent))}>
                                    {!isGameOver ? (parseFloat(marketItem.change_percent) > 0 ? '+' : '') : ''}
                                    {!isGameOver ? (marketItem.change_percent ?? 0) : '--'}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="h-8" />
                <ScrollBar orientation="horizontal" className="bg-red-700/20" />
            </ScrollArea>
        </section>
    );
};

export default RedBlackLeaderBoard;