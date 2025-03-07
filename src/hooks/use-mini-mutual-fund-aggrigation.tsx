import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { useMemo } from "react";
import { RankedMarketItem } from "./use-leadboard";

interface UserLeaderboardStats {
    userId: number;
    username: string;
    bettedAmount: number;
    potentialReturn: number;
    horse: number;
    currentRank: number;
    changePercent: number;
}

export function useLeaderboardAggregation(
    placements: MiniMutualFundPlacement[],
    leaderboardData: RankedMarketItem[]
): UserLeaderboardStats[] {

    const userIdHorseMap = useMemo(() => {
        const userIds = placements.map(p => p.user?.id).filter(Boolean).sort() as number[];
        const userIdsSet = new Set(userIds);
        const distinctUserIds = Array.from(userIdsSet);
        const map: Record<number, number> = {};
        for (let i = 0; i < distinctUserIds.length; i++) {
            map[distinctUserIds[i]] = i + 1
        }
        return map;
    }, [placements]);
    return useMemo(() => {
        // First, create a map of market item IDs to their current leaderboard data
        const marketItemsMap = leaderboardData.reduce((map, item) => {
            map[item.id!] = {
                changePercent: parseFloat(item.change_percent) || 0
            };
            return map;
        }, {} as Record<number, { changePercent: number }>);

        const userStatsMap: Record<number, UserLeaderboardStats> = {};

        placements.forEach(placement => {
            if (!placement.user || !placement.marketItem) return;

            const userId = placement.user.id!;
            const marketItemId = placement.marketItem.id!;
            const amount = placement.amount || 0;

            const marketData = marketItemsMap[marketItemId] || { changePercent: 0 };

            if (!userStatsMap[userId]) {
                userStatsMap[userId] = {
                    userId: userId,
                    username: placement.user.username || 'Unknown',
                    bettedAmount: 0,
                    horse: userIdHorseMap[userId] || -1,
                    potentialReturn: 0,
                    currentRank: 0, // Will be set after sorting
                    changePercent: 0
                };
            }

            // Add to user's total betted amount
            userStatsMap[userId!].bettedAmount += amount;

            // Calculate this placement's potential return and add to user's total
            const placementReturn = amount * (1 + (marketData.changePercent / 100));
            userStatsMap[userId].potentialReturn += placementReturn;
        });

        Object.values(userStatsMap).forEach(user => {
            if (user.bettedAmount > 0) {
                // This gives us the effective change percent across all investments
                user.changePercent = ((user.potentialReturn / user.bettedAmount) - 1) * 100;
            }
        });

        const sortedUsers = Object.values(userStatsMap)
            .sort((a, b) => b.potentialReturn - a.potentialReturn);

        sortedUsers.forEach((user, index) => {
            user.currentRank = index + 1;
        });

        return sortedUsers;
    }, [placements, leaderboardData]);
}