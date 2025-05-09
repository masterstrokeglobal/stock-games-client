import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
                    query.queryKey[0] === "winningGameRecord" ||
                    query.queryKey[0] === "topPlacements" ||
                    query.queryKey[0] === "myPlacements" ||
                    query.queryKey[0] === "user" && query.queryKey[1] == 'wallet',
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating game record");
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
export const useGetTopPlacements = (roundId: string) => {
    const THREE_SECOND = 3000;
    return useQuery({
        queryKey: ["topPlacements", roundId],
        queryFn: () => gameRecordAPI.getTopPlacements(roundId),
        staleTime: THREE_SECOND,
    });
};

// Get My Placements Hook
export const useGetMyPlacements = (filter: any) => {
    return useQuery({
        queryKey: ["myPlacements", filter],
        queryFn: () => gameRecordAPI.getMyPlacements(filter),
    });
};

// Get Game Record History Hook infinite query page and limit 
export const useGameRecordHistoryInfinite = (params: any) => {
    return useInfiniteQuery({
        queryKey: ["gameRecordHistory", params],
        queryFn: ({ pageParam = params.page }) => {

            return gameRecordAPI.getGameRecordHistory({
                ...params,
                page: pageParam,
            });
        },
        getNextPageParam: (lastPage: any, _, allPageParams) => {
            if (!lastPage.data?.count) return undefined;
            return lastPage.data.count > params.limit * params.page ? allPageParams + 1 : undefined;
        },
        initialPageParam: params.page,
    });
};

// Get Game Record History Hook with page and limit

export const useGameRecordHistory = (params: any) => {
    return useQuery({
        queryKey: ["gameRecordHistory", params],
        queryFn: () => gameRecordAPI.getGameRecordHistory(params),
    });
};

// Undo Last Placement Hook

export const useUndoLastPlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.undoLastPlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "winningGameRecord" ||
                    query.queryKey[0] === "topPlacements" ||
                    query.queryKey[0] === "myPlacements" ||
                    query.queryKey[0] === "user" && query.queryKey[1] == 'wallet',
            });
            toast.success("Placement undone successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error undoing last placement");
        },
    });
};

// Clear Placement Hook

export const useClearPlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.clearPlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "winningGameRecord" ||
                        query.queryKey[0] === "topPlacements" ||
                        query.queryKey[0] === "myPlacements" ||
                        query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                }

            });
            toast.success("Placement cleared successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error clearing placement");
        },
    });
};

// Repeat Placement Hook

export const useRepeatPlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.repeatPlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "myPlacements",
            });
            toast.success("Placement repeated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error repeating placement");
        },
    });
};

