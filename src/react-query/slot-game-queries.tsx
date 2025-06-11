import slotGameAPI from "@/lib/axios/slot-game-API";
import { StockGamePlacement } from "@/models/slot-game-placement";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useStockGamePlacements = (roundId: number) => {
    return useQuery({
        queryKey: ["slot-jackpot", roundId],
        queryFn: async () => {
            const response = await slotGameAPI.getSlotJackpotGameRecord(roundId);
            return response.data;
        }
    });
};

export const useGetMySlotGamePlacement = (roundId: number) => {
    return useQuery <{data:StockGamePlacement[], count:number}>({
        queryKey: ["my-slot-jackpot", roundId],
        queryFn: async () => {
            const response = await slotGameAPI.getMySlotJackpotGameRecord(roundId);
            return {
                data: response.data.data.map((item: any) => new StockGamePlacement(item)),
                count: response.data.count
            }
        }
    });
};

export const useCreateStockGamePlacement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: slotGameAPI.createStockJackpotGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "slot-jackpot" ||
                        query.queryKey[0] === "my-slot-jackpot";
                }
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error placing bet");
        }
    });
};

export const useStockGameRoundResult = (roundId: number) => {
    return useQuery({
        queryKey: ["slot-jackpot-result", roundId],
        queryFn: async () => {
            const response = await slotGameAPI.getStockJackpotRoundResult(roundId);
            return response.data;
        }
    });
};
