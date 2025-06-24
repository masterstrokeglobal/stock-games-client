import { roundRecordsAPI } from "@/lib/axios/round-record-API";
import { SchedulerType } from "@/models/market-item";
import { RoundRecordGameType } from "@/models/round-record";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get all round records with optional filters.
 */
export const useGetAllRoundRecords = (filter: any) => {
    return useQuery({
        queryKey: ["round-records", filter],
        queryFn: () => roundRecordsAPI.getAllRoundRecords(filter),

    });
};

export const useGetCurrentRoundRecord = (
    type: SchedulerType,
    roundRecordGameType: RoundRecordGameType
) => {
    return useQuery({
        queryKey: ["current-round-record", type, roundRecordGameType],
        staleTime: 1000 * 60 * 60 * 24,
        queryFn: () => {
            return roundRecordsAPI.getAllRoundRecords({
                type: type,
                roundRecordGameType: roundRecordGameType,
                limit: 1,
                startTime: new Date(),
                page: 1,
            })
        },
    });
};
/**
 * Hook to get a specific round record by ID.
 * @param roundRecordId - ID of the round record to fetch
 */
export const useGetRoundRecordById = (roundRecordId?: number) => {
    return useQuery({
        queryKey: ["round-record", roundRecordId],
        queryFn: roundRecordId ? () => roundRecordsAPI.getRoundRecordById(roundRecordId) : undefined,
        enabled: !!roundRecordId, // Prevents the query from running if the ID is falsy
    });
};

/**
 * Hook to get the current user's round result for a specific round.
 * @param roundRecordId - ID of the round record to fetch
 */
export const useGetMyRoundResult = (roundRecordId: number, show: boolean) => {
    return useQuery({
        queryKey: ["my-round-result", roundRecordId],
        queryFn: () => roundRecordsAPI.getMyResult(roundRecordId),
        enabled: show,
        retry: (failureCount) => {
            // Retry 5 times with an interval of 1 second
            return failureCount < 5;
        },
        retryDelay: () => {
            // 1000 ms (1 second) delay between retries
            return 1000;
        }
    });
};


export const useGetWinningReport = (filter: any) => {
    return useQuery({
        queryKey: ["winning-report", filter],
        queryFn: () => roundRecordsAPI.getWinningReport(filter),
    });
};

export const useGetWinningReportExcel = (filter: any) => {
    return useQuery({
        queryKey: ["winning-report-excel", filter],
        queryFn: () => roundRecordsAPI.getWinningReportExcel(filter),
    });
};

export const useRoundBets = (roundRecordId: string) => {
    return useQuery({
        queryKey: ["round-bets", roundRecordId],
        queryFn: () => roundRecordsAPI.getRoundBets(roundRecordId),
    });
}

export const useLastRoundWinner = (type: SchedulerType) => {

    const ONE_MINUTE = 1000 * 60 * 1;
    return useQuery({
        queryKey: ["last-round-winner", type],
        queryFn: () => roundRecordsAPI.getLastRoundWinner(type),
        staleTime: ONE_MINUTE,
        refetchInterval: ONE_MINUTE,
    });
}


export const useGetWheelOfFortuneHistory = ({ page, limit, type }: { page: number, limit: number, type: SchedulerType }) => {
    return useQuery({
        queryKey: ["wheel-of-fortune-history", page, limit, type],
        queryFn: async () => {
            const response = await roundRecordsAPI.getWheelOfFortuneHistory({ page, limit, type });
            return response.data;
        },
    });
}   