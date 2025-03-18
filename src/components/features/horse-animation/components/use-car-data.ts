import { useLeaderboard } from "@/hooks/use-leadboard";
import { useLeaderboardAggregation } from "@/hooks/use-mini-mutual-fund-aggrigation";
import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { useGetMiniMutualFundCurrentRoundPlacements } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import { useMemo } from "react";

/**
 * Custom hook to fetch and process car race data
 * @returns Processed user placements data for the race
 */
export const useCarData = () => {
  // Get game state
  const { lobbyRound } = useGameStore();
  const roundRecord = lobbyRound?.roundRecord;
  
  // Fetch leaderboard data
  const { stocks } = useLeaderboard(roundRecord!);
  
  // Fetch current round placements
  const { data, isSuccess } = useGetMiniMutualFundCurrentRoundPlacements(lobbyRound?.id);

  // Process placements data
  const placements = useMemo<MiniMutualFundPlacement[]>(() => {
    return isSuccess ? data?.placements || [] : [];
  }, [isSuccess, data]);

  // Aggregate user data
  const userPlacements = useLeaderboardAggregation(placements, stocks);
  
  return {
    userPlacements,
    isDataLoaded: isSuccess && !!placements.length,
    roundId: lobbyRound?.id
  };
};