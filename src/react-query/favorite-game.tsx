import favoriteGameAPI from "@/lib/axios/favorite-game-API";
import { cn } from "@/lib/utils";
import { FavoriteGame } from "@/models/favorite-game";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Heart, HeartOff, XCircle } from "lucide-react";
import { toast } from "sonner";

export const useGetAllFavoriteGames = () => {
    return useQuery<FavoriteGame[]>({
        queryKey: ["favorite-games"],
        queryFn: async () => {
            const { data } = await favoriteGameAPI.getAllFavoriteGames();
            return data.data.map((favorite: any) => new FavoriteGame(favorite));
        },
    });
};

export const useAddFavoriteGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: favoriteGameAPI.addFavoriteGame,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["favorite-games"]
            });
            
            const gameName = variables.gameType || `Game ${variables.gameId}`;
            toast.custom((t) => (
                <FavoriteSuccessToast 
                    onClose={() => toast.dismiss(t)} 
                    gameName={gameName}
                    action="added"
                />
            ), {
                position: 'bottom-right'
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error?.response?.data?.message;
            toast.custom((t) => (
                <FavoriteErrorToast message={errorMessage} onClose={() => toast.dismiss(t)} />
            ), {
                position: 'bottom-right'
            });
        },
    });
};

export const useRemoveFavoriteGame = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: favoriteGameAPI.removeFavoriteGame,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["favorite-games"]
            });
            
            const gameName = variables.gameType || `Game ${variables.gameId}`;
            toast.custom((t) => (
                <FavoriteSuccessToast 
                    onClose={() => toast.dismiss(t)} 
                    gameName={gameName}
                    action="removed"
                />
            ), {
                position: 'bottom-right'
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error?.response?.data?.message;
            toast.custom((t) => (
                <FavoriteErrorToast message={errorMessage} onClose={() => toast.dismiss(t)} />
            ), {
                position: 'bottom-right'
            });
        },
    });
};

export const useRemoveFavoriteGameById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: favoriteGameAPI.removeFavoriteGameById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorite-games"]
            });
            
            toast.custom((t) => (
                <FavoriteSuccessToast 
                    onClose={() => toast.dismiss(t)} 
                    gameName="Game"
                    action="removed"
                />
            ), {
                position: 'bottom-right'
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            const errorMessage = error?.response?.data?.message;
            toast.custom((t) => (
                <FavoriteErrorToast message={errorMessage} onClose={() => toast.dismiss(t)} />
            ), {
                position: 'bottom-right'
            });
        },
    });
};

export const FavoriteSuccessToast = ({ 
    className, 
    onClose, 
    action 
}: PropsWithClassName<{
    onClose: () => void,
    gameName: string,
    action: "added" | "removed"
}>) => {
    return (
        <div className={cn("flex items-center p-4 bg-gradient-to-t from-pink-500 via-purple-400 to-indigo-400 text-white rounded-lg shadow-lg min-w-[320px] relative", className)}>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <button
                        onClick={onClose}
                        className="w-6 h-6 mb-4 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <XCircle />
                    </button>
                    <h3 
                        style={{ textShadow: '1px 1px 0px #4467CC, -1px -1px 0px #4467CC, 1px -1px 0px #4467CC, -1px 1px 0px #4467CC' }} 
                        className="text-lg font-bold text-white"
                    >
                        {action === "added" ? "Added to Favorites!" : "Removed from Favorites!"}
                    </h3>
                </div>
                <div className="flex-shrink-0">
                    {action === "added" ? (
                        <Heart className="h-16 w-16 text-red-300" fill="currentColor" />
                    ) : (
                        <HeartOff className="h-16 w-16 text-gray-300" />
                    )}
                </div>
            </div>
        </div>
    );
};

export const FavoriteErrorToast = ({ 
    className, 
    message = "Please try again", 
    onClose 
}: PropsWithClassName<{
    onClose: () => void,
    message?: string
}>) => {
    return (
        <div
            style={{ background: 'linear-gradient(171.89deg, #FF9285 5.45%, #D9330D 49.61%, #B9090C 93.76%)' }}
            className={cn("flex items-center p-4 text-white rounded-lg shadow-lg min-w-[320px] relative", className)}
        >
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <button
                        onClick={onClose}
                        className="w-6 h-6 mb-4 rounded-full flex items-center justify-center transition-colors"
                    >
                        <XCircle />
                    </button>
                    <h3 className="text-lg font-bold text-white">{message}</h3>
                </div>
                <div className="flex-shrink-0">
                    <XCircle className="h-16 w-16 text-red-300" />
                </div>
            </div>
        </div>
    );
};