import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import wheelOfFortuneAPI from "../lib/axios/wheel-of-fortune-API";
import { toast } from "sonner";
import { useIsExternalUser } from "@/context/auth-context";
import { externalUserAPI } from "@/lib/axios/external-user-API";
import { WheelOfFortunePlacement } from "@/models/wheel-of-fortune-placement";


export const useCreateWheelOfFortunePlacement = () => {
    const queryClient = useQueryClient();
    const isExternalUser = useIsExternalUser();
    return useMutation({
        mutationFn: isExternalUser ? externalUserAPI.createExternalBet : wheelOfFortuneAPI.createWheelOfFortunePlacement,
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
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["wheelOfFortune", roundId],
        queryFn: async () => {
            if (isExternalUser) {
                const response = await externalUserAPI.getExternalUsersPlacements(roundId);
                return response.data.data.map((placement: any) => new WheelOfFortunePlacement(placement));
            }
            return wheelOfFortuneAPI.getMyCurrentRoundWheelOfFortunePlacement(roundId);
        },
    });
}

export const useGetCurrentRoundWheelOfFortunePlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["wheelOfFortune", "current-round-placements", roundId],
        queryFn: () => wheelOfFortuneAPI.getCurrentRoundWheelOfFortunePlacement(roundId),
    });
}

export const useGetWheelOfFortuneRoundResult = (roundId: number, open: boolean) => {
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["wheelOfFortune", "round-result", roundId],
        queryFn: () => isExternalUser ? externalUserAPI.getExternalUserResult(roundId) : wheelOfFortuneAPI.getWheelOfFortuneRoundResult(roundId),
        enabled: open,
    });
}

