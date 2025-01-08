import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { marketItemAPI } from "@/lib/axios/market-item-API"; // Adjust the path as needed

export const useCreateMarketItem = () => {
    return useMutation({
        mutationFn: marketItemAPI.createMarketItem,
        onSuccess: () => {
            toast.success("Market item created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating market item");
        },
    });
};

export const useGetMarketItems = (filter?: SearchFilters) => {

    return useQuery({
        queryKey: ["marketItems", filter],
        queryFn: () => marketItemAPI.getMarketItems(filter),
    });
};

export const useUpdateMarketItemById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: marketItemAPI.updateMarketItemById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "marketItems";
                }
            });
            toast.success("Market item updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating market item");
        },
    });
};

export const useGetMarketItemById = (id: string) => {
    return useQuery({
        queryKey: ["marketItems", id],
        queryFn: () => marketItemAPI.getMarketItemById(id),
    });
}
