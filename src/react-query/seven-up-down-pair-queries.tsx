import sevenUpDownPairAPI from "@/lib/axios/seven-up-down-pair-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetSevenUpDownPairs = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["sevenUpDownPairs", filter],
        queryFn: async () => {
            const response = await sevenUpDownPairAPI.getSevenUpDownPairs(filter);
            return response.data;
        }
    });
};

export const useGetSevenUpDownPairById = (id: string) => {
    return useQuery({
        queryKey: ["sevenUpDownPair", id],
        queryFn: async () => {
            const response = await sevenUpDownPairAPI.getSevenUpDownPairById(id);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateSevenUpDownPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sevenUpDownPairAPI.createSevenUpDownPair,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "sevenUpDownPairs"
            });
            toast.success("Seven up down pair created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating seven up down pair");
        }
    });
};

export const useUpdateSevenUpDownPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sevenUpDownPairAPI.updateSevenUpDownPair,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "sevenUpDownPairs"
            });
            toast.success("Seven up down pair updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating seven up down pair");
        }
    });
};
