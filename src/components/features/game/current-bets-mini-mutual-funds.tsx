"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { cn } from "@/lib/utils";
import { useGetMiniMutualFundCurrentUserPlacements } from "@/react-query/lobby-query";
import { useStockBettingStore } from "@/store/betting-store";
import { useGameStore } from "@/store/game-store";

import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    className?: string;
};

const CurrentBetsMiniMutualFunds = ({ className }: Props) => {
    const t = useTranslations("mutualFunds");
    const { lobbyRound } = useGameStore();
    const { selectedStock, betAmount, isLoading } = useStockBettingStore();
    const isPlaceOver = useIsPlaceOver(lobbyRound?.roundRecord ?? null);


    const { data, isSuccess } = useGetMiniMutualFundCurrentUserPlacements(lobbyRound?.roundRecord?.id);

    const mutualFundsData = useMemo(() => {
        if (isSuccess) {
            return data.data;
        }
        return [];
    }, [isSuccess, data]);

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [scrollAreaHeight, setScrollAreaHeight] = useState<number>(0);

    useEffect(() => {
        if (sectionRef.current) {
            const sectionHeight = sectionRef.current.offsetHeight;
            setScrollAreaHeight(sectionHeight - 40);
        }
    }, []);

    return (
        <section
            ref={sectionRef}
            className={cn("p-3 rounded-xl h-full w-full bg-[#122146]", className)}
        >
            <h2 className="text-lg font-semibold mb-2 text-gray-200">
                {t("my-mutual-funds")}
            </h2>
            <ScrollArea className="max-h-64 w-full" style={{ height: `${scrollAreaHeight - 20}px` }} type="auto">
                {mutualFundsData.length > 0 ? (
                    <table className="min-w-full">
                        <thead>
                            <tr className="flex">
                                <th className="p-2 text-xs text-left text-gray-300 rounded-tl-lg flex-1">
                                    {t("fund-name")}
                                </th>
                                <th className="p-2 text-xs text-right text-gray-300 flex-1">
                                    {t("nav")}
                                </th>
                                <th className="p-2 text-xs text-right text-gray-300 rounded-tr-lg flex-1">
                                    {t("returns")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {mutualFundsData.map((fund: any, index: number) => (
                                <tr
                                    key={index}
                                    className="flex border-b last:border-none rounded-lg border-[#DADCE00D] overflow-hidden"
                                    style={{ display: 'flex', flexDirection: 'row' }}
                                >
                                    <td className="p-2 text-xs text-gray-300 rounded-l-lg flex-1 truncate">
                                        {fund.name}
                                    </td>
                                    <td className="p-2 text-xs text-right text-gray-300 flex-1">
                                        {fund.nav}
                                    </td>
                                    <td className={`p-2 text-xs text-right rounded-r-lg flex-1 ${parseFloat(fund.returns) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {parseFloat(fund.returns) >= 0 ? '+' : ''}{fund.returns}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center text-gray-300 py-4">
                        {isPlaceOver ? t("betting-closed") : t("no-funds-available")}
                    </div>
                )}
            </ScrollArea>
        </section>
    );
};

export default CurrentBetsMiniMutualFunds;