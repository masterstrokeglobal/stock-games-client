import api from "./instance";
import { MarketItemFormValues } from "@/components/features/market-items/market-item-form";

export const marketItemAPI = {
    createMarketItem: async (payload: MarketItemFormValues) => {
        return api.post("/market-items", payload);
    },

    getMarketItems: async (filter?: SearchFilters) => {
        const sanitizedFilter: any = {};

        Object.entries(filter ?? {}).forEach(([key, value]) => {
            if (value) {
                sanitizedFilter[key] = value;
            }
        });
        return api.get("/market-items", { params: sanitizedFilter });
    },
    updatePlacementAllowed: async (id: string) => {
        return api.patch(`/market-items/placement-allowed/${id}`);
    },
    getMarketItemById: async (id: string) => {
        return api.get(`/market-items/${id}`);
    },
    updateMarketItemById: async (payload: Partial<MarketItemFormValues>) => {
        const { id, ...data } = payload;
        return api.patch(`/market-items/${id}`, data);
    },
};
