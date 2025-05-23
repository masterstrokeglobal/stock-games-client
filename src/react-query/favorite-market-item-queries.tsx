import favoriteMarketItemAPI from "@/lib/axios/favorite-market-item-API";
import MarketItem from "@/models/market-item";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useToggleToFavorites = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: favoriteMarketItemAPI.addToFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey.includes("my-favorites") || query.queryKey.includes("watchlist") });
        },
    });
};

export const useGetMyFavorites = () => {
    return useQuery<number[]>({
        queryKey: ["my-favorites"],
        queryFn: async () => {
            const response = await favoriteMarketItemAPI.getMyFavorites();
            return response.data.result.map((favorite: any) => favorite.marketItem.id);
        },
    });
};

export const useGetWatchlist = () => {
    return useQuery<MarketItem[]>({
        queryKey: ["watchlist"],
        queryFn: async () => {
            const response = await favoriteMarketItemAPI.getMyFavorites();
            return response.data.result.map((favorite: any) => new MarketItem(favorite.marketItem));
        },
    });
};

