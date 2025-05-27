import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import diceGameAPI from "@/lib/axios/dice-game-API";
import { DicePlacement } from "@/models/dice-placement";
import { toast } from "sonner";

export const useCreateDiceGamePlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: diceGameAPI.createDiceGamePlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "dice-game" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
            toast.success("Bet Placed Successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error placing bet");
        },
    });
};

export const useGetMyCurrentRoundDiceGamePlacement = (roundId: number) => {
    return useQuery<DicePlacement[]>({
        queryKey: ["dice-game", "my-current-round-placements", roundId],
        queryFn: async () => {
            const { data } = await diceGameAPI.getMyCurrentRoundDiceGamePlacement(roundId);
            return data.data.map((placement: any) => new DicePlacement(placement));
        },
        enabled: !!roundId
    });
};

export const useGetCurrentRoundDiceGamePlacement = (roundId: number) => {
    return useQuery<DicePlacement[]>({
        queryKey: ["dice-game", "current-round-placements", roundId],
        queryFn: async () => {
            const { data } = await diceGameAPI.getCurrentRoundDiceGamePlacement(roundId);
            return data.data.map((placement: any) => new DicePlacement(placement));
        },
        enabled: !!roundId
    });
};

export const useGetDiceGameRoundResult = (roundId: number, open: boolean) => {
    return useQuery({
        queryKey: ["dice-game-round-result", roundId],
        queryFn: async () => {
            const { data } = await diceGameAPI.getDiceGameRoundResult(roundId);
            return data ? new DicePlacement(data) : null;
        },
        enabled: !!roundId && open
    });
};