import api from "@/lib/axios/instance";

const slotGameAPI = {
    // slot jackpot
    getSlotJackpotGameRecord: async (roundId: number) => {
        return api.get(`/stock-jackpot-placement/current-round-placements/${roundId}`);
    },
    getMySlotJackpotGameRecord: async (roundId: number) => {
        return api.get(`/stock-jackpot-placement/my-current-placement/${roundId}`);
    },
    createStockJackpotGameRecord: async (data: { roundId: number,  amount: number }) => {
        return api.post(`/stock-jackpot-placement`, data);
    },
    getStockJackpotRoundResult: async (roundId: number) => {
        return api.get(`/stock-jackpot-placement/result/${roundId}`);
    }
}


export default slotGameAPI;