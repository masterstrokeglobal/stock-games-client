import { useQuery } from "@tanstack/react-query";
import { betHistoryAPI, BetHistoryFilters, BetStatisticsFilters } from "@/lib/axios/bet-history-API";

export const useGetBetHistory = (filters: BetHistoryFilters) => {
    return useQuery({
        queryKey: ["bet-history", filters],
        queryFn: () => betHistoryAPI.getBetHistory(filters),
    });
};

export const useGetBetStatistics = (filters: BetStatisticsFilters) => {
    return useQuery({
        queryKey: ["bet-statistics", filters],
        queryFn: () => betHistoryAPI.getBetStatistics(filters),
    });
};

