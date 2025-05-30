import { CoinTossPair } from "@/models/coin-toss-pair";
import api from "./instance";
import { CoinTossPairFormValues } from "@/components/features/coin-head-tail/coin-toss-pair-form";

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
    }
};

export default coinTossPairAPI;
