import api from "./instance";

const jackpotPairAPI = {
    createJackpotPair: async (jackpotPairData: any) => {
        return api.post("/jackpot-pair", jackpotPairData);
    },

    getJackpotPairs: async (filter: SearchFilters) => {
        return api.get("/jackpot-pair", {
            params: filter
        });
    },

    getJackpotPairById: async (id: string) => {
        return api.get(`/jackpot-pair/${id}`);
    },

    updateJackpotPair: async (jackpotPairData: any & { id: string }) => {
        return api.patch(`/jackpot-pair/${jackpotPairData.id}`, jackpotPairData);
    }
}

export default jackpotPairAPI;
