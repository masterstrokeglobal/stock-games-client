import api from "./instance";

export const casinoAPI = {
    getCasinoGames: async (params: any) => {
        return api.get("/game", { params });
    },
    login: async (id: string) => {
        return api.get(`/game/join-game/${id}`);
    },
    getGameById: async (id: string) => {
        return api.get(`/game/${id}`);
    },
    updateGame: async (id: string, data: any) => {
        return api.put(`/game/${id}`, data);
    }
};

