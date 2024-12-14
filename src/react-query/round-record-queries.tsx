import { roundRecordsAPI } from "@/lib/axios/round-record-API";
import { SchedulerType } from "@/models/market-item";
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
    type: SchedulerType
) => {
    return useQuery({
        queryKey: ["current-round-record", type],
        queryFn: () =>{ 
           return roundRecordsAPI.getAllRoundRecords({
            type: type,
            limit: 1,
            startTime: new Date(),
            page: 1,
        })},
        staleTime: 100 * 1000,
    });
};
/**
 * Hook to get a specific round record by ID.
 * @param roundRecordId - ID of the round record to fetch
 */
export const useGetRoundRecordById = (roundRecordId: number) => {
    return useQuery({
        queryKey: ["round-record", roundRecordId],
        queryFn: () => roundRecordsAPI.getRoundRecordById(roundRecordId),
        enabled: !!roundRecordId, // Prevents the query from running if the ID is falsy
    });
};

/**
 * Hook to get the current user's round result for a specific round.
 * @param roundRecordId - ID of the round record to fetch
 */

export const useGetMyRoundResult = (roundRecordId: number,show:boolean) => {
    return useQuery({
        queryKey: ["my-round-result", roundRecordId],
        queryFn: () => roundRecordsAPI.getMyResult(roundRecordId),
        enabled: show,
    });
}
