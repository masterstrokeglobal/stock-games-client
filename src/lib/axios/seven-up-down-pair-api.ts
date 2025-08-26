import api from "./instance";

const sevenUpDownPairAPI = {
    createSevenUpDownPair: async (sevenUpDownPairData: any) => {
        return api.post("/seven-up-down-pair", sevenUpDownPairData);
    },

    getSevenUpDownPairs: async (filter: SearchFilters) => {
        return api.get("/seven-up-down-pair", {
            params: filter
        });
    },

    getSevenUpDownPairById: async (id: string) => {
        return api.get(`/seven-up-down-pair/${id}`);
    },

    updateSevenUpDownPair: async (sevenUpDownPairData: any & { id: string }) => {
        return api.patch(`/seven-up-down-pair/${sevenUpDownPairData.id}`, sevenUpDownPairData);
    },
    deleteSevenUpDownPair: async (id: string) => {
        return api.delete(`/seven-up-down-pair/${id}`);
    }
}

export default sevenUpDownPairAPI;
