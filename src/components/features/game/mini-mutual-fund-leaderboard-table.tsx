import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RankedMarketItem } from '@/hooks/use-leadboard';
import { useLeaderboardAggregation } from "@/hooks/use-mini-mutual-fund-aggrigation";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { useGetMiniMutualFundCurrentRoundPlacements } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import React, { useMemo } from 'react';
import { CAR_COLORS } from "../horse-animation/components/mmf-horse-animation";

interface LeaderboardTableProps {
    leaderboardData: RankedMarketItem[];
    roundType?: SchedulerType;
    isGameOver?: boolean;
    height?: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    leaderboardData,
    height = 400
}) => {
    const { lobbyRound } = useGameStore();
    const { data, isSuccess } = useGetMiniMutualFundCurrentRoundPlacements(lobbyRound!.id!);
    const placements = useMemo<MiniMutualFundPlacement[]>(() => {
        return isSuccess ? data.placements : [];
    }, [isSuccess, data]);

    const userPlacements = useLeaderboardAggregation(placements, leaderboardData);
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    const getColor = (profit: number) => {
        if (profit > 0) return 'text-green-500';
        if (profit < 0) return 'text-red-500';
        return 'text-white';
    };


    return (
        <ScrollArea
            className="flex-grow text-white  !h-fit"
            style={{ height: `${height}px` }}
            type="auto"
        >
            <table className="min-w-full">
                <thead>
                    <tr className=" text-sm">
                        <th className="p-2 text-left w-12">Rank</th>
                        <th className="p-2 text-left w-12">Car</th>
                        <th className="p-2 text-left">Username</th>
                        <th className="p-2 text-left whitespace-nowrap">Betted Amount</th>
                        <th className="p-2 text-left whitespace-nowrap">P/L</th>
                        <th className="p-2 text-right whitespace-nowrap">Potential Return</th>
                    </tr>
                </thead>
                <tbody>
                    {userPlacements.map((item, index) => (
                        <tr
                            key={index}
                            className={cn(
                                "border-b last:border-none rounded-lg border-[#DADCE00D] text-white overflow-hidden",
                            )}
                        >

                            <td className="p-2 text-left w-12">{index + 1}</td>
                            <td className="p-2 text-left">
                                <span className="w-5 h-5 rounded-full inline-block mr-2 border- border-white " style={{ background: CAR_COLORS[item.horse] }} />
                            </td>
                            <td className="p-2 text-left">{item.username}</td>
                            <td className="p-2 text-left">{formatPrice(item.bettedAmount)}</td>
                            <td className={cn("p-2 text-left whitespace-nowrap", getColor(item.potentialReturn - item.bettedAmount))}>
                                Rs. {formatPrice(item.potentialReturn - item.bettedAmount)}
                            </td>
                            <td className="p-2 text-right whitespace-nowrap">
                                {formatPrice(item.potentialReturn)} ({item.changePercent.toFixed(2)}%)
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