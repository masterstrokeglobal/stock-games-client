import Lobby, { LobbyGameType, LobbyType } from "@/models/lobby";
import { SchedulerType } from "@/models/market-item";
import api from "./instance";
export enum LobbyStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export interface CreateLobbyRequest {
    game_type: string;
    amount: number;
    type: LobbyType;
    marketType: SchedulerType;
    name: string;
}

export interface JoinLobbyRequest {
    code: string;
}

export interface GetLobbiesFilter {
    page?: number;
    limit?: number;
    type?: LobbyType;
    gameType?: LobbyGameType
}

// API Service
export const lobbyAPI = {
    // Create a new lobby
    createLobby: async (data: CreateLobbyRequest) => {
        const response = await api.post<Lobby>("/lobby", data);
        return response.data;
    },

    // Join an existing lobby
    joinLobby: async (data: JoinLobbyRequest) => {
        const response = await api.post<string>("/lobby/join-lobby", data);
        return response.data;
    },

    // Leave a lobby
    leaveLobby: async (lobbyId: number) => {
        const response = await api.patch<string>(`/lobby/leave-lobby/${lobbyId}`);
        return response.data;
    },

    unreadyLobby: async (lobbyId: number) => {
        const response = await api.patch<string>(`/lobby/unready/${lobbyId}`);
        return response.data;
    }
    ,

    // Start a round
    startRound: async (lobbyId: number) => {
        const response = await api.post(`/lobby/start-round/${lobbyId}`);
        return response.data;
    },
    readyToPlay: async (lobbyId: number) => {
        const response = await api.patch(`/lobby/ready/${lobbyId}`);
        return response.data;
    },

    // Get lobby round by lobby id
    getCurrentLobbyRound: async (lobbyId: number) => {
        const response = await api.get(`/lobby/current-round/${lobbyId}`);
        return response.data;
    },

    // Get all lobbies with filters
    getLobbies: async (filters: GetLobbiesFilter = {}) => {
        const response = await api.get<{
            lobbies: Lobby[];
            count: number;
        }>("/lobby", {
            params: filters
        });
        return response.data;
    },
    // Get my lobby
    myLobby: async () => {
        const response = await api.get("/lobby/my-lobby");
        return response.data;
    },
    // Get lobby by joining code
    getLobbyByCode: async (code: string) => {
        const response = await api.get(`/lobby/code/${code}`);
        return response.data;
    }
    ,
    // lobby chat 
    getLobbyChat: async (lobbyId: number) => {
        const response = await api.get(`/lobby/chat-history/${lobbyId}`);
        return response.data;
    },
};