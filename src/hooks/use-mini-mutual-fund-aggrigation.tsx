import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { RankedMarketItem } from "./use-leadboard";
import { useMemo } from "react";
import MarketItem from "@/models/market-item";


interface UserLeaderboardStats {
    userId: number;
    username: string;
    bettedAmount: number;
    marketItem: MarketItem;
    potentialReturn: number;
    currentRank: number;
    changePercent: number;
}

export function useLeaderboardAggregation(
    placements: MiniMutualFundPlacement[],
    leaderboardData: RankedMarketItem[]
): UserLeaderboardStats[] {
    return useMemo(() => {
        // Group placements by user
        const userPlacements = placements.reduce((acc, placement) => {
            if (!placement.user || !placement.marketItem) return acc;

            const existingEntry = acc.find(entry => entry.userId === placement.user!.id);

            if (existingEntry) {
                existingEntry.bettedAmount += placement.amount || 0;
            } else {
                console.log(placement);
                acc.push({
                    userId: placement.user.id!,
                    username: placement.user.username || 'Unknown',
                    bettedAmount: placement.amount || 0,
                    marketItem: placement.marketItem,
                    potentialReturn: 0,
                    currentRank: -1,
                    changePercent: 0
                });
            }

            return acc;
        }, [] as UserLeaderboardStats[]);

        // Enrich with leaderboard data
        return userPlacements.map(userPlacement => {
            const leaderboardItem = leaderboardData.find(
                item => item.id === userPlacement.marketItem.id
            );

            if (leaderboardItem) {
                const changePercent = parseFloat(leaderboardItem.change_percent);
                // Calculate potential return based on bet amount and market performance
                const potentialReturn = userPlacement.bettedAmount *
                    (1 + (changePercent / 100));

                return {
                    ...userPlacement,
                    potentialReturn,
                    currentRank: leaderboardItem.rank,
                    changePercent
                };
            }

            return userPlacement;
        }).sort((a, b) => b.potentialReturn - a.potentialReturn);
    }, [placements, leaderboardData]);
}
