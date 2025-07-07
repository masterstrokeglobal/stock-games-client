import { casinoAPI } from "@/lib/axios/casino-API";
import CasinoGames from "@/models/casino-games";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCasinoGames = (filter: any) => {
    return useQuery({
        queryKey: ["casino-games", filter],
        queryFn: async () => {
            const response = await casinoAPI.getCasinoGames(filter);
            const { games, count } = response.data;
            const responseData: { games: CasinoGames[], count: number } = {
                games: games.map((game: any) => new CasinoGames(game)),
                count
            }
            return responseData;
        }
    });
};


export const useInfiniteGetCasinoGames = (filter: any) => {
    const limit = filter.limit || 100;
    return useInfiniteQuery({
        queryKey: ["casino-games", filter],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await casinoAPI.getCasinoGames({ ...filter, page: pageParam });
            return response.data;
        },
        getNextPageParam: (lastPage: any, pages: any) => {
            return lastPage.count > pages.length * limit ? pages.length + 1 : undefined;      
        },
        initialPageParam: 1, 
        getPreviousPageParam: (firstPage: any, allPages: any) => {
            return firstPage.count > allPages.length * limit ? allPages.length - 1 : undefined;
        }
    });
};

export const useGameLogin = (id: string) => {
    return useQuery({
        queryKey: ["casino-game", id],
        queryFn: async () => {
            const response = await casinoAPI.login(id);
            return response.data;
        }
    });
};

export const useGetGameById = (id: string) => {
    return useQuery({
        queryKey: ["casino-game", id],
        queryFn: async () => {
            const response = await casinoAPI.getGameById(id);
            return new CasinoGames(response.data);
        }
    });
};

export const useUpdateGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<CasinoGames>) => {
            const response = await casinoAPI.updateGame(data.id?.toString() || "", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Game updated successfully");
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey?.[0] === "casino-games" });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};


