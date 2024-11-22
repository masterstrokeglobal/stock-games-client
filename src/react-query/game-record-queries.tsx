import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gameRecordAPI } from "@/lib/axios/game-record-API"; // Adjust the path as needed

// Create Game Record Hook with Predicate-based Invalidation
export const useCreateGameRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gameRecordAPI.createGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    // Invalidate queries related to game records
                    query.queryKey[0] === "winningGameRecord" ||
                    query.queryKey[0] === "topPlacements" ||
                    query.queryKey[0] === "myPlacements",
            });
            toast.success("Game record created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error creating game record");
        },
    });
};
// Get Winning Game Record Hook
export const useGetWinningGameRecord = () => {
    return useQuery({
        queryKey: ["winningGameRecord"],
        queryFn: gameRecordAPI.getWinningGameRecord,
    });
};

// Get Top Placements Hook
export const useGetTopPlacements = (roundId:string) => {
    return useQuery({
        queryKey: ["topPlacements",roundId],
        queryFn:  () => gameRecordAPI.getTopPlacements(roundId),
        staleTime: 1000 * 3, // 3 seconds
    });
};

// Get My Placements Hook
export const useGetMyPlacements = (filter: any) => {
    return useQuery({
        queryKey: ["myPlacements",filter],
        queryFn: () => gameRecordAPI.getMyPlacements(filter),
    });
};
