import api from "./instance";
import { RoundRecordGameType } from "@/models/round-record";

const favoriteGameAPI = {
    getAllFavoriteGames: async () => {
        return api.get("/favorite-game");
    },
    addFavoriteGame: async (favoriteData: {
        gameId?: number;
        gameType?: RoundRecordGameType;
    }) => {
        return api.post("/favorite-game", favoriteData);
    },
    removeFavoriteGame: async (favoriteData: {
        gameId?: number;
        gameType?: RoundRecordGameType;
    }) => {
        return api.delete("/favorite-game", { data: favoriteData });
    },
    removeFavoriteGameById: async (favoriteId: number) => {
        return api.delete(`/favorite-game/${favoriteId}`);
    }
};

export default favoriteGameAPI;