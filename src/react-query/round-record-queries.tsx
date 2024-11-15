import { roundRecordsAPI } from "@/lib/axios/round-record-API";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to get all round records with optional filters.
 */
export const useGetAllRoundRecords = (filter:any) => {
    return useQuery({
        queryKey: ["round-records" , filter],
        queryFn: () => roundRecordsAPI.getAllRoundRecords(filter),

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
