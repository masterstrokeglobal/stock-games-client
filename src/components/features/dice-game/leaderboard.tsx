"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef } from "react";


// Enhanced interface for ranked market items
type Props = {
    roundRecord: RoundRecord;
    className?: string;
}

const LeaderBoard = ({ roundRecord, className }: Props) => {
    const t = useTranslations("game");
    const { stocks: leaderboardData } = useLeaderboard(roundRecord);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const { isGameOver } = useGameState(roundRecord);
    const { isMobile } = useWindowSize();

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord.id);

    useEffect(() => {
        const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;

        const timer = setTimeout(() => {
            refetch();
        }, resultFetchTime);

        return () => clearTimeout(timer);
    }, [roundRecord, refetch]);

    const winnerNumbers: number[] = useMemo(() => {
        if (!isSuccess) return [];
        const winningId = data.data?.winningId;

        if (!winningId) return [];

        const winningNumbers = roundRecord.market.filter((item) => winningId.includes(item.id));
        if (!winningNumbers) return [];
        const winningNumbersArray = winningNumbers.map((item) => item.horse).filter((item) => item !== undefined) as number[];
        return winningNumbersArray;
    }, [data, isSuccess]);


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

    return (
        <section
            ref={sectionRef}
            className={cn("md:rounded-sm h-full !pb-0.5 overflow-hidden w-full", className)}
        >
            <div className="md:rounded-sm h-full">
                <header className="text-white bg-[#0C309E] dice-header text-center  py-3 px-4 font-bold">
                    Leaderboard
                </header>
                <ScrollArea
                    style={{ height: isMobile ? "300px" : "100%" }}
                    type="auto"
                >
                    <table className="min-w-full mb-12 relative  ">
                        <thead className=" sticky border-[#4467CC80]  bg-[#140538] border-b top-0 py-2">
                            <tr className="text-game-text text-sm ">
                                <th className="p-2 py-3 text-left w-12 text-white">
                                    {t("rank")}
                                </th>
                                <th className="p-2 py-3 text-left text-white">
                                    {t("name")}
                                </th>
                                <th className="p-2 py-3 text-right whitespace-nowrap text-white">
                                    {t("price")} ({roundRecord.type === SchedulerType.CRYPTO ? "USDC " : roundRecord.type === SchedulerType.USA_MARKET ? "$" : "Rs."})
                                </th>
                                <th className="p-2 py-3 text-right whitespace-nowrap text-white">
                                    {t("change")}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {winnerMarketItems.map((winnerMarketItem) => (
                                <tr className="border-b last:border-none rounded-lg text-game-secondary border-[#DADCE00D] overflow-hidden" key={winnerMarketItem.horse}>
                                    <td className="p-2 ">
                                        <img src="/crown.png" alt="Rank 1" className="w-8 h-8" />
                                    </td>
                                    <td className="p-2">
                                        {winnerMarketItem.name}
                                    </td>
                                    <td className="p-2  text-right ">
                                        {winnerMarketItem.price ? formatPrice(winnerMarketItem.price) : "-"}
                                    </td>
                                    <td className={cn(
                                        "p-2 text-right",
                                        getChangeColor(winnerMarketItem.change_percent)
                                    )}>
                                        {parseFloat(winnerMarketItem.change_percent) > 0 ? '+' : ''}
                                        {winnerMarketItem.change_percent ?? 0}%</td>
                                </tr>
                            ))}

                            {leaderboardData.filter((item) => !winnerNumbers.includes(item.horse!)).map((marketItem, index) => (
                                <tr
                                    key={index}

                                    className={cn("border-b last:border-none text-game-secondary rounded-lg border-[#DADCE00D] overflow-hidden", (index === 0 && winnerNumbers[0] == 0) ? "bg-[#ffb71a]/30 text-base font-bold" : "text-sm")}
                                >
                                    <td className="p-2">

                                        {(index === 0  && !isGameOver) ? (
                                            <img
                                                src="/rank-1.png"
                                                alt="Rank 1"
                                                className="w-8 h-8 mx-auto"
                                            />
                                        ) : winnerNumbers.includes(marketItem.horse!) ? (
                                            <img
                                                src="/rank-1.svg"
                                                alt="Rank 1"
                                                className="size-8 mx-auto"
                                            />
                                        ) : (
                                            <div className="text-game-secondary w-full text-center">
                                                {!isGameOver ? (index + 1) : "-"}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-2">
                                        {marketItem.name}
                                    </td>
                                    <td className="p-2  text-right whitespace-nowrap ">
                                        {marketItem.price ? formatPrice(marketItem.price) : "-"}
                                    </td>
                                    <td className={cn(
                                        "p-2  text-right",
                                        getChangeColor(marketItem.change_percent)
                                    )}>

                                        {!isGameOver ? (parseFloat(marketItem.change_percent) > 0 ? '↑ ' : '↓ ') : ''}
                                        {!isGameOver ? (marketItem.change_percent ?? 0) : '--'}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="h-8" />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    );
};

export default LeaderBoard;