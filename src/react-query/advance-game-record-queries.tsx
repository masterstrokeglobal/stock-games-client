import { advanceGameRecordAPI } from "@/lib/axios/advance-game-records";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateAdvanceGameRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: advanceGameRecordAPI.createAdvanceGameRecord,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) =>
                    query.queryKey[0] === "winningGameRecord" ||
                    query.queryKey[0] === "topPlacements" ||
                    query.queryKey[0] === "myPlacements" ||
                    query.queryKey[0] === "advancePlacements" ||
                    query.queryKey[0] === "user" && query.queryKey[1] == 'wallet',
            });
            toast.success("Bet placed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating game record");
        },
    });
};