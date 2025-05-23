import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sevenUpDownAPI } from "@/lib/axios/7-up-down-API";
import SevenUpDownPlacement from "@/models/seven-up-down";
export const useCreateSevenUpDownPlacement = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: sevenUpDownAPI.createSevenUpDownPlacement,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "sevenUpDown";
                },
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error placing bet");
        },
    });
};

export const useGetMyCurrentRoundSevenUpDownPlacement = (roundId: number) => {
    return useQuery<SevenUpDownPlacement[]>({
        queryKey: ["sevenUpDown", "myPlacements", roundId],
        queryFn: async () => {
            const response = await sevenUpDownAPI.getMyCurrentRoundSevenUpDownPlacement(roundId);
            return response.data.map((placement: any) => new SevenUpDownPlacement(placement));
        },
    });
};

export const useGetCurrentRoundSevenUpDownPlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["sevenUpDown", "currentRoundPlacements", roundId],
        queryFn: () => sevenUpDownAPI.getCurrentRoundSevenUpDownPlacement(roundId),
    });
};

export const useGetSevenUpDownRoundResult = (roundId: number,enable:boolean) => {
    return useQuery({
        queryKey: ["sevenUpDown", "roundResult", roundId],
        queryFn: () => sevenUpDownAPI.getSevenUpDownRoundResult(roundId),
        enabled:enable
    });
};
