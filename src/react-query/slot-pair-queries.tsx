import slotPairAPI from "@/lib/axios/slot-pair-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetSlotPairs = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["slotPairs", filter],
        queryFn: async () => {
            const response = await slotPairAPI.getSlotPairs(filter);
            return response.data;
        }
    });
};

export const useGetSlotPairById = (id: string) => {
    return useQuery({
        queryKey: ["slotPair", id],
        queryFn: async () => {
            const response = await slotPairAPI.getSlotPairById(id);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateSlotPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: slotPairAPI.createSlotPair,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "slotPairs"
            });
            toast.success("Slot pair created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating slot pair");
        }
    });
};

export const useUpdateSlotPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: slotPairAPI.updateSlotPair,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "slotPairs"
            });
            toast.success("Slot pair updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating slot pair");
        }
    });
};
