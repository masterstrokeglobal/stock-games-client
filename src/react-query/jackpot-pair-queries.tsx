import jackpotPairAPI from "@/lib/axios/jackpot-pair-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetJackpotPairs = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["jackpotPairs", filter],
        queryFn: async () => {
            const response = await jackpotPairAPI.getJackpotPairs(filter);
            return response.data;
        }
    });
};

export const useGetJackpotPairById = (id: string) => {
    return useQuery({
        queryKey: ["jackpotPair", id],
        queryFn: async () => {
            const response = await jackpotPairAPI.getJackpotPairById(id);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateJackpotPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: jackpotPairAPI.createJackpotPair,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "jackpotPairs"
            });
            toast.success("Jackpot pair created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating jackpot pair");
        }
    });
};

export const useUpdateJackpotPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: jackpotPairAPI.updateJackpotPair,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "jackpotPairs"
            });
            toast.success("Jackpot pair updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating jackpot pair");
        }
    });
};
