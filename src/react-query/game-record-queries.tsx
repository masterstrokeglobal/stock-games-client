import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { gameRecordAPI } from "@/lib/axios/game-record-API"; // Adjust the path as needed
import { StockSlotPlacement } from "@/models/stock-slot-placement";
import { StockSlotJackpot } from "@/models/stock-slot-jackpot";

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

// Stock Slot Game Record Hook

export const useGetStockSlotGameRecord = (roundId: number): UseQueryResult<StockSlotPlacement[]> => {
    return useQuery({
        queryKey: ["stockSlotGameRecord", roundId],
        queryFn: async () => {
            const { data } = await gameRecordAPI.getStockSlotGameRecord(roundId);
            return data.data.map((item: any) => new StockSlotPlacement(item));
        }
    });
};

export const useGetMyStockSlotGameRecord = (roundId?: number): UseQueryResult<StockSlotPlacement[]> => {
    return useQuery({
        queryKey: ["myStockSlotGameRecord", roundId],
        enabled: !!roundId,
        queryFn: roundId ? async () => {
            const { data } = await gameRecordAPI.getMyStockSlotGameRecord(roundId);
            return data.data.map((item: any) => new StockSlotPlacement(item));
        } : undefined
    });
};


// Create Stock Slot Game Record Hook

export const useCreateStockSlotGameRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.createStockSlotGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "stockSlotGameRecord" || query.queryKey[0] === "myStockSlotGameRecord" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet'

            });
            toast.success("Stock slot game record created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating stock slot game record");
        },
    });
};


// Get Stock Slot Round Result Hook

type StockSlotRoundResult = {
    amountWon: number;
    grossWinning: number;
    netProfitLoss: number;
    netWinning: number;
    platformFeeAmount: number;
    totalPlaced: number;
}
export const useGetStockSlotRoundResult = (roundId: number): UseQueryResult<StockSlotRoundResult> => {
    return useQuery({
        queryKey: ["stockSlotRoundResult", roundId],
        queryFn: async () => {
            const { data } = await gameRecordAPI.getStockSlotRoundResult(roundId.toString());
            return data.data as StockSlotRoundResult;
        }
    });
};


// Stock Slot Jackpot Game Record Hook

export const useGetStockSlotJackpotGameRecord = (roundId: number): UseQueryResult<StockSlotJackpot[]> => {
    return useQuery({
        queryKey: ["stockSlotJackpotGameRecord", roundId],
        queryFn: async () => {
            const { data } = await gameRecordAPI.getSlotJackpotGameRecord(roundId);
            return data.data.map((item: any) => new StockSlotJackpot(item));
        }
    });
};


export const useGetMyStockSlotJackpotGameRecord = (roundId?: number): UseQueryResult<StockSlotJackpot[]> => {
    return useQuery({
        queryKey: ["myStockSlotJackpotGameRecord", roundId],
        enabled: !!roundId,
        queryFn: roundId ? async () => {
            const { data } = await gameRecordAPI.getMySlotJackpotGameRecord(roundId);
            return data.data.map((item: any) => new StockSlotJackpot(item));
        } : undefined
    });
};


// Create Stock Slot Jackpot Game Record Hook

export const useCreateStockSlotJackpotGameRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.createStockJackpotGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "stockSlotJackpotGameRecord" || query.queryKey[0] === "myStockSlotJackpotGameRecord" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet'
            });
            toast.success("Stock slot jackpot game record created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating stock slot jackpot game record");
        },
    });
};







