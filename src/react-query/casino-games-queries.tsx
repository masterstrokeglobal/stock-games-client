import { casinoAPI } from "@/lib/axios/casino-API";
import CasinoGames from "@/models/casino-games";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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


