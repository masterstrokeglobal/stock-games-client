import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RankedMarketItem } from '@/hooks/use-leadboard';
import { useLeaderboardAggregation } from "@/hooks/use-mini-mutual-fund-aggrigation";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { useGetMiniMutualFundCurrentRoundPlacements } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import React, { useMemo } from 'react';

interface LeaderboardTableProps {
    leaderboardData: RankedMarketItem[];
    roundType?: SchedulerType;
    isGameOver?: boolean;
    height?: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    leaderboardData,
    isGameOver = false,
    height = 400
}) => {
    const { lobbyRound } = useGameStore();
    const { data, isSuccess } = useGetMiniMutualFundCurrentRoundPlacements(lobbyRound!.id!);
    const placements = useMemo<MiniMutualFundPlacement[]>(() => {
        return isSuccess ? data.placements : [];
    }, [isSuccess, data]);

    const userPlacements = useLeaderboardAggregation(placements,leaderboardData);
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };


    return (
        <ScrollArea
            className="flex-grow text-white"
            style={{ height: `${height}px` }}
            type="auto"
        >
            <table className="min-w-full">
                <thead>
                    <tr className=" text-sm">
                        <th className="p-2 text-left w-12">Rank</th>
                        <th className="p-2 text-left">username</th>
                        <th className="p-2 text-left">Betted Amount</th>
                        <th className="p-2 text-right whitespace-nowrap">Potential Return</th>
                    </tr>
                </thead>
                <tbody>
                    {userPlacements.map((item, index) => (
                        <tr
                            key={index}
                            className={cn(
                                "border-b last:border-none rounded-lg border-[#DADCE00D] text-white overflow-hidden",
                                (index === 0 && !isGameOver) ? "bg-[#ffb71a]/30 text-base font-bold" : "text-sm"
                            )}
                        >
                          
                            <td className="p-2 text-left w-12">{index + 1}</td>
                            <td className="p-2 text-left">{item.username}</td>
                            <td className="p-2 text-left">{formatPrice(item.bettedAmount)}</td>
                            <td className="p-2 text-right whitespace-nowrap">
                                {formatPrice(item.potentialReturn)} ({item.changePercent}%)
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
};

export default LeaderboardTable;