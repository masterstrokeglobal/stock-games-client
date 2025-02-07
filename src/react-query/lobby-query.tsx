import { GetLobbiesFilter, lobbyAPI } from "@/lib/axios/lobby-API";
import Lobby from "@/models/lobby";
import LobbyRound from "@/models/lobby-round";
import LobbyUser from "@/models/lobby-user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Get all lobbies with pagination and filters
export const useGetLobbies = (filters: GetLobbiesFilter) => {
    return useQuery({
        queryKey: ["lobbies", filters],
        queryFn: () => lobbyAPI.getLobbies(filters),
    });
};

// my lobbies 

export const useGetMyLobbies = () => {
    return useQuery({
        queryKey: ["lobbies", "my"],
        retry(failureCount) {
            return failureCount < 3;
        },
        queryFn: async () => {
            const response = await lobbyAPI.myLobby();
            const lobbyUser = new LobbyUser(response);
            return lobbyUser;
        }
    });
};

// Get lobby by code
export const useGetLobbyByCode = (code: string) => {
    return useQuery({
        queryKey: ["lobbies", "code", code],
        queryFn: async () => {
            const response = await lobbyAPI.getLobbyByCode(code);
            const lobby = new Lobby(response);
            return lobby;
        },
        enabled: !!code,
    });
};

// Create new lobby
export const useCreateLobby = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lobbyAPI.createLobby,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "lobbies",
            });
            toast.success("Lobby created successfully");
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ??
                "Error creating lobby. Please check amount is multiple of 100 and market is open."
            );
        },
    });
};

// Join lobby
export const useJoinLobby = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lobbyAPI.joinLobby,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "lobbies",
            });
            toast.success("Joined lobby successfully");
        },
        onError: (error: any) => {
            toast.error(
                error.response?.data?.message ??
                "Error joining lobby. The lobby might be closed or you may not have permission."
            );
        },
    });
};

// Leave lobby
export const useLeaveLobby = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lobbyAPI.leaveLobby,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "lobbies",
            });
            toast.success("Left lobby successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error leaving lobby");
        },
    });
};

// Start round
export const useStartRound = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lobbyAPI.startRound,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "lobbies",
            });
            toast.success("Round started successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error starting round");
        },
    });
};

// Ready to play
export const useReadyToPlay = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: lobbyAPI.readyToPlay,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "lobbies"|| query.queryKey[0] === "user" && query.queryKey[1] == 'wallet',
            });
            toast.success("Ready to play");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error ready to play");
        },
    });
};

// Get current lobby round
export const useGetCurrentLobbyRound = (lobbyId?: number) => {
    return useQuery({
        queryKey: ["lobbies", "round", lobbyId],
        queryFn: async () => {
            const response = await lobbyAPI.getCurrentLobbyRound(lobbyId!);
            const lobby = new LobbyRound(response);
            return lobby;
        },
        enabled: Boolean(lobbyId),
    });
};

// lobby chat history
export const useGetLobbyChat = (lobbyId: number) => {
return useQuery({
    queryKey: ["lobbies", "chat", lobbyId],
    queryFn: async () => {
        const response = await lobbyAPI.getLobbyChat(lobbyId);
        return response;
    },
    enabled: Boolean(lobbyId),
});
};