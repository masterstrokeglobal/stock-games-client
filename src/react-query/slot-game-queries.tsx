import slotGameAPI from "@/lib/axios/slot-game-API";
import { StockGamePlacement } from "@/models/slot-game-placement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useIsExternalUser } from "@/context/auth-context";
import { externalUserAPI } from "@/lib/axios/external-user-API";


export const useStockGamePlacements = (roundId: number) => {
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["slot-jackpot", roundId],
        queryFn: async () => {
            if (isExternalUser) {
                const response = await externalUserAPI.getExternalUsersPlacements(roundId);
                return response.data;
            }
            const response = await slotGameAPI.getSlotJackpotGameRecord(roundId);
            return response.data;
        }
    });
};

export const useGetMySlotGamePlacement = (roundId?: number) => {
    const isExternalUser = useIsExternalUser();
    return useQuery <{data:StockGamePlacement[], count:number}>({
        queryKey: ["my-slot-jackpot", roundId],
        queryFn: async () => {
            if (!roundId) return { data: [], count: 0 };
            if (isExternalUser) {
                const response = await externalUserAPI.getExternalUsersPlacements(roundId);
                const placements: StockGamePlacement[] = response.data.data.map((placement: any) => new StockGamePlacement(placement));
                return {
                    data: placements,
                    count: response.data.count || placements.length
                };
            }
            const response = await slotGameAPI.getMySlotJackpotGameRecord(roundId);
            return {
                data: response.data.data.map((item: any) => new StockGamePlacement(item)),
                count: response.data.count
            }
        },
        enabled: !!roundId
    });
};

export const useCreateStockGamePlacement = () => {
    const queryClient = useQueryClient();
    const isExternalUser = useIsExternalUser();

    return useMutation({
        mutationFn: isExternalUser ? externalUserAPI.createExternalBet : slotGameAPI.createStockJackpotGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "slot-jackpot" ||
                        query.queryKey[0] === "my-slot-jackpot" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                }
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error placing bet");
        }
    });
};

type StockSlotResult = {
    netProfitLoss: number;
    netWinning: number;
    platformFeeAmount: number;
    amountWon: number;
    grossWinning: number;
    totalPlaced: number;
};

export const useStockGameRoundResult = (roundId: number,open=false) => {
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["slot-jackpot-result", roundId],
        queryFn: async () => {
            if (isExternalUser) {
                const response = await externalUserAPI.getExternalUserResult(roundId);
                return response.data.data as StockSlotResult;
            }
            const response = await slotGameAPI.getStockJackpotRoundResult(roundId);
            return response.data.data as StockSlotResult;
        },
        enabled: open
    });
};
