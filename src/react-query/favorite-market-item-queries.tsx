import favoriteMarketItemAPI from "@/lib/axios/favorite-market-item-API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useToggleToFavorites = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: favoriteMarketItemAPI.addToFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("my-favorites") });
        },
    });
};

export const useGetMyFavorites = () => {
    return useQuery({
        queryKey: ["my-favorites"],
        queryFn: favoriteMarketItemAPI.getMyFavorites,
    });
};

