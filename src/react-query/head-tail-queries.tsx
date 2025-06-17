import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { headTailAPI } from "../lib/axios/head-tail-API";
import { toast } from "sonner";

export const useGetHeadTailRoundResult = (roundId: number, open: boolean) => {
    return useQuery({
        queryKey: ["head-tail-round-result", roundId],
        queryFn: () => headTailAPI.getHeadTailRoundResult(roundId),
        enabled: open,
    });
};

export const useGetCurrentRoundHeadTailPlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["head-tail-placement", "current-round", roundId],
        queryFn: () => headTailAPI.getCurrentRoundHeadTailPlacement(roundId),
    });
};

export const useGetMyCurrentRoundHeadTailPlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["head-tail-placement", "my-placement", roundId],
        queryFn: () => headTailAPI.getMyCurrentRoundHeadTailPlacement(roundId),
    });
};

export const useCreateHeadTailPlacement = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: headTailAPI.createHeadTailPlacement,
        onSuccess: () => {
            toast.success("Bet Placed Successfully");
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "head-tail-round-result" || query.queryKey[0] === "head-tail-placement" || query.queryKey[0] === "head-tail-my-placement" ||  query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
        },
    });
};

