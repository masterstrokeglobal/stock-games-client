import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { cn } from "@/lib/utils";
import MarketItem, { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { LobbyResult } from "./lobby-result-dialog";



type Props = {
    roundRecord: RoundRecord;
    filteredMarket?: MarketItem[];
    result?: LobbyResult;
}

const LeaderBoard = ({ roundRecord, filteredMarket, result }: Props) => {
    const t = useTranslations("game");
    const { stocks: unfilteredleaderboardData } = useLeaderboard(roundRecord);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);
    const { isGameOver } = useGameState(roundRecord);

    const leaderboardData = useMemo(() => {
        if (result) {
            const leadboardResult = result.priceDifferences.map((item, index) => ({
                horse: index + 1,
                name: item.code,
                price: item.currentPrice,
                change_percent: ((item.difference / item.initialPrice) * 100).toFixed(2),
                initialPrice: item.initialPrice
            }));

            if (filteredMarket && filteredMarket.length > 0) {
                return leadboardResult.filter((item) =>
                    filteredMarket.find((filteredItem) => filteredItem.code == item.name)
                );
            }
        }

        if (filteredMarket && filteredMarket.length > 0) {
            return unfilteredleaderboardData.filter((item) =>
                filteredMarket.find((filteredItem) => filteredItem.id === item.id)
            );
        }
        return unfilteredleaderboardData;
    }, [filteredMarket, unfilteredleaderboardData, result]);

    const { refetch, data, isSuccess } = useGetRoundRecordById(roundRecord.id);

    useEffect(() => {
        if (!result) {
            const resultFetchTime = new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;
            const timer = setTimeout(() => {
                refetch();
            }, resultFetchTime);
            return () => clearTimeout(timer);
        }
    }, [roundRecord, refetch, result]);

    const winnerNumber = useMemo(() => {
        if (result) return null;
        if (!isSuccess) return null;
        const winningId = data.data?.winningId;
        if (!winningId) return 0;
        const winningNumber = roundRecord.market.find((item) => item.id === winningId);
        return winningNumber ? winningNumber.horse : null;
    }, [data, isSuccess, result, roundRecord.market]);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40);
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

    return (
        <section
            ref={sectionRef}
            className="p-4 md:rounded-2xl h-full w-full bg-[#122146]"
        >
            <h2 className="text-xl font-semibold mb-4 text-gray-200">
                {t("leaderboard")}
            </h2>
            <ScrollArea
                className="max-h-96 h-full"
                style={{ height: `${scrollAreaHeight - 20}px` }}
                type="auto"
            >
                <table className="min-w-full">
                    <thead>
                        <tr className="text-[#8990A2] text-sm">
                            <th className="p-2 text-left w-12">
                                {t("rank")}
                            </th>
                            {!result && (
                                <th className="p-2 text-left">
                                    {t("horse")}
                                </th>
                            )}
                            <th className="p-2 text-left">
                                {result ? "Code" : t("name")}
                            </th>
                            <th className="p-2 text-right">
                                {result ? "Current Price" : t("price")}
                            </th>
                            {result && (
                                <th className="p-2 text-right">
                                    Initial Price
                                </th>
                            )}
                            <th className="p-2 text-right whitespace-nowrap">
                                {t("change")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((item, index) => (
                            <tr
                                key={index}
                                className={cn(
                                    "border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden",
                                    (index === 0 && winnerNumber === 0 && !isGameOver) ? "bg-[#ffb71a]/30 text-base font-bold" : "text-sm"
                                )}
                            >
                                <td className="p-2 text-gray-300">
                                    {result ? (
                                        <span className="text-[#8990A2]">{index + 1}</span>
                                    ) : (
                                        (index === 0 && winnerNumber === 0 && !isGameOver) ? (
                                            <img src="/rank-1.svg" alt="Rank 1" className="w-8 h-8" />
                                        ) : winnerNumber === item.horse ? (
                                            <img src="/rank-1.svg" alt="Rank 1" className="size-8" />
                                        ) : (
                                            <span className="text-[#8990A2]">
                                                {(winnerNumber === 0 && !isGameOver) ? (index + 1) : "-"}
                                            </span>
                                        )
                                    )}
                                </td>
                                {!result && (
                                    <td className="p-2 text-gray-300">
                                        {item.horse === 17 ? 0 : item.horse}
                                    </td>
                                )}
                                <td className="p-2 text-gray-300">
                                    {item.name}
                                </td>
                                <td className="p-2 text-right text-gray-300">
                                    {!result && (roundRecord.type === SchedulerType.CRYPTO ? "USDC " : "Rs.")}
                                    {item.price ? formatPrice(item.price) : "-"}
                                </td>
                                {result && (
                                    <td className="p-2 text-right text-gray-300">
                                        {formatPrice(item.initialPrice ?? 0)}
                                    </td>
                                )}
                                <td className={cn(
                                    "p-2 text-right",
                                    !isGameOver || result ? getChangeColor(item.change_percent) : "text-gray-300"
                                )}>
                                    {(!isGameOver || result) ? (
                                        <>
                                            {parseFloat(item.change_percent) > 0 ? '+' : ''}
                                            {item.change_percent ?? 0}%
                                        </>
                                    ) : '--'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </section>
    );
};

export default LeaderBoard;