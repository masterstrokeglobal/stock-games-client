import api from "./instance";

const slotPairAPI = {
    createSlotPair: async (slotPairData: any) => {
        return api.post("/stock-slot-placement/slot-pair", slotPairData);
    },

    getSlotPairs: async (filter: SearchFilters) => {
        return api.get("/stock-slot-placement/slot-pair", {
            params: filter
        });
    },

    getSlotPairById: async (id: string) => {
        return api.get(`/stock-slot-placement/slot-pair/${id}`);
    },

    updateSlotPair: async (slotPairData: any & { id: string }) => {
        return api.put(`/stock-slot-placement/slot-pair/${slotPairData.id}`, slotPairData);
    },
    deleteSlotPair: async (id: string) => {
        return api.delete(`/stock-slot-placement/slot-pair/${id}`);
    }
}

export default slotPairAPI;
