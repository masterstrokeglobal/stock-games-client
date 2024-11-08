import api from "./instance";

export const gameRecordAPI = {
    getAllGameRecords: async (filter: SearchFilters) => {
        return api.get("/game-record", { params: filter });
    },

    getGameRecordById: async (gameRecordId: string) => {
        return api.get(`/game-record/${gameRecordId}`);
    },
};
