import { CoinTossPairFormValues } from "@/components/features/coin-head-tail/coin-toss-pair-form";
import api from "./instance";

const coinTossPairAPI = {
    createCoinTossPair: async (data: CoinTossPairFormValues) => {
        return api.post("/coin-toss-pair", data);
    },

    getCoinTossPairs: async (filter: SearchFilters) => {
        return api.get("/coin-toss-pair", { params: filter });
    },

    getCoinTossPairById: async (id: string) => {
        return api.get(`/coin-toss-pair/${id}`);
    },
    updateCoinTossPair: async (coinTossPair: Partial<CoinTossPairFormValues> & { id: string }) => {
        return api.patch(`/coin-toss-pair/${coinTossPair.id}`, coinTossPair);
    },
    deleteCoinTossPair: async (id: string) => {
        return api.delete(`/coin-toss-pair/${id}`);
    }
};

export default coinTossPairAPI;
