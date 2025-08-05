import { gameRecordAPI } from "@/lib/axios/game-record-API"; // Adjust the path as needed
import { useIsExternalUser } from "@/context/auth-context";
import { RoundRecord } from "@/models/round-record";
import { StockJackpotPlacementType } from "@/models/stock-slot-jackpot";
import { StockJackpotPlacement } from "@/models/stock-slot-placement";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { externalUserAPI } from "@/lib/axios/external-user-API";

// Create Game Record Hook with Predicate-based Invalidation
export const useCreateGameRecord = () => {
    const queryClient = useQueryClient();
    const isExternalUser = useIsExternalUser();
    return useMutation({
        mutationFn: isExternalUser ? externalUserAPI.createExternalBet : gameRecordAPI.createGameRecord,
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

export const useCreatePlacementBet = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gameRecordAPI.createPlacementBet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "allPlacement" ||
                    query.queryKey[0] === "currentPlacement" ||
                    query.queryKey[0] === "winningGameRecord" ||
                    query.queryKey[0] === "user" && query.queryKey[1] == 'wallet',
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating game record");
        },
    });
};

export const useCreateMiniMutualFundPlacementBet = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gameRecordAPI.createMiniMutualFundPlacementBet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[1] === "mini-mutual-fund-placements" ||
                    query.queryKey[0] === "user" && query.queryKey[1] == 'wallet',

            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating game record");
        },
    });
};

// Get user placement for lobby round Hook
export const useGetCurrentPlacementForLobbyRound = (id: string) => {
    return useQuery({
        queryKey: ["currentPlacement", id],
        queryFn: () => gameRecordAPI.getCurrentPlacementForLobbyRound(id),
    });
};

// Get All Placement for Lobby Round Hook
export const useGetAllPlacementForLobbyRound = (id?: string) => {
    return useQuery({
        queryKey: ["allPlacement", id],
        queryFn: id ? () => gameRecordAPI.getAllPlacementForLobbyRound(id) : undefined,
        enabled: !!id,
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
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["myPlacements", filter],
        queryFn: () => isExternalUser ? gameRecordAPI.getExternalUsersPlacements(filter.roundId) : gameRecordAPI.getMyPlacements(filter),
    });
};

export const useGetAdvancePlacements = (filter: any) => {
    return useQuery({
        queryKey: ["advancePlacements", filter],
        queryFn: () => gameRecordAPI.getAdvancePlacements(filter),
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

//single player roulette betting

export const useCreateSinglePlayerRouletteBet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.createSinglePlayerRouletteBet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "singlePlayerMyCurrentPlacement" ||
                    query.queryKey[0] === "singlePlayerRoundPlacements",
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating game record");
            // Clear Placement Hook

        }
    })
}
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

// single player roulette betting placement

export const useGetMyCurrentPlacement = (roundId: string) => {
    return useQuery({
        queryKey: ["singlePlayerMyCurrentPlacement", roundId],
        queryFn: () => gameRecordAPI.getMyCurrentPlacement(roundId),
    });
};


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


export const useGetStockSlotGameRecord = (roundId: number): UseQueryResult<StockJackpotPlacement[]> => {
    return useQuery({
        queryKey: ["stockSlotGameRecord", roundId],
        queryFn: async () => {
            const { data } = await gameRecordAPI.getStockSlotGameRecord(roundId);
            return data.data.map((item: any) => new StockJackpotPlacement(item));
        }
    });
};


export const useGetMyStockJackpotGameRecord = (roundId?: number): UseQueryResult<StockJackpotPlacement[]> => {
    return useQuery({
        queryKey: ["myStockSlotGameRecord", roundId],
        enabled: !!roundId,
        queryFn: roundId ? async () => {
            const { data } = await gameRecordAPI.getMyStockSlotGameRecord(roundId);
            return data.data.map((item: any) => new StockJackpotPlacement(item));
        } : undefined
    });
};


// Get Current Round Placements Hook
export const useGetCurrentRoundPlacements = (roundId?: string) => {
    return useQuery({
        queryKey: ["singlePlayerRoundPlacements", roundId],
        queryFn: () => roundId ? gameRecordAPI.getCurrentRoundPlacements(roundId) : undefined,
    });
};


export const useCreateStockJackpotGameRecord = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: gameRecordAPI.createStockSlotGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "stockSlotGameRecord" || query.queryKey[0] === "myStockSlotGameRecord" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet'
            });
            toast.success("Bet placed Successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating stock slot game record");
        },
    });
};


type JackpotPlacementResult = {
    id: number;
    roundId: number;
    amount: number;
    winningId: any[];
    placement: StockJackpotPlacementType
    result: StockJackpotPlacementType | null;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
};

export type StockJackpotRoundResult = {
    placements: JackpotPlacementResult[];
    round: RoundRecord;
};

export const useGetStockJackpotRoundResult = (
    roundId: number,
    open: boolean
): UseQueryResult<StockJackpotRoundResult> => {
    return useQuery({
        queryKey: ["stockSlotRoundResult", roundId],
        queryFn: async () => {
            const { data } = await gameRecordAPI.getStockJackpotRoundResult(roundId.toString());
            return {
                placements: data.data.placements as JackpotPlacementResult[],
                round: new RoundRecord(data.data.round)
            };
        },
        enabled: open
    });
};
