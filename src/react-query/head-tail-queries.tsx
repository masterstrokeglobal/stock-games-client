import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { headTailAPI } from "../lib/axios/head-tail-API";
import { useIsExternalUser } from "@/context/auth-context";
import { externalUserAPI } from "@/lib/axios/external-user-API";

export const useGetHeadTailRoundResult = (roundId: number, open: boolean) => {
    return useQuery({
        queryKey: ["head-tail-round-result", roundId],
        queryFn: () => headTailAPI.getHeadTailRoundResult(roundId),
        enabled: open,
    });
};

export const useGetCurrentRoundHeadTailPlacement = (roundId: number) => {
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["head-tail-placement", "current-round", roundId],
        queryFn: () => isExternalUser ? externalUserAPI.getExternalUsersPlacements(roundId) : headTailAPI.getCurrentRoundHeadTailPlacement(roundId),
    });
};

export const useGetMyCurrentRoundHeadTailPlacement = (roundId: number) => {
    const isExternalUser = useIsExternalUser();
    return useQuery({
        queryKey: ["head-tail-placement", "my-placement", roundId],
        queryFn: () => isExternalUser ? headTailAPI.getExternalUsersPlacements(roundId) : headTailAPI.getMyCurrentRoundHeadTailPlacement(roundId),
    });
};

export const useCreateHeadTailPlacement = () => {
    const isExternalUser = useIsExternalUser();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: isExternalUser ? externalUserAPI.createExternalBet : headTailAPI.createHeadTailPlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "head-tail-round-result" || query.queryKey[0] === "head-tail-placement" || query.queryKey[0] === "head-tail-my-placement" ||  query.queryKey[0] === "user" && query.queryKey[1] == 'wallet';
                },
            });
        },
    });
};

