import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import wheelOfFortuneAPI from "../lib/axios/wheel-of-fortune-API";
import { toast } from "sonner";


export const useCreateWheelOfFortunePlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: wheelOfFortuneAPI.createWheelOfFortunePlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "wheelOfFortune" || query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
            toast.success("Bet Placed Successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error placing bet");
        },
    });
}


export const useGetMyCurrentRoundWheelOfFortunePlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["wheelOfFortune", roundId],
        queryFn: () => wheelOfFortuneAPI.getMyCurrentRoundWheelOfFortunePlacement(roundId),
    });
}

export const useGetCurrentRoundWheelOfFortunePlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["wheelOfFortune", "current-round-placements", roundId],
        queryFn: () => wheelOfFortuneAPI.getCurrentRoundWheelOfFortunePlacement(roundId),
    });
}

export const useGetWheelOfFortuneRoundResult = (roundId: number, open: boolean) => {
    return useQuery({
        queryKey: ["wheelOfFortune", "round-result", roundId],
        queryFn: () => wheelOfFortuneAPI.getWheelOfFortuneRoundResult(roundId),
        enabled: open,
    });
}

