import { TierFormSchema } from "@/components/features/tier/tier-form";
import api from "./instance";

const tierAPI = {
    createTier: async (tierData: TierFormSchema) => {
        return api.post("/tier-list", tierData);
    },

    getTiers: async (filter?: SearchFilters) => {
        return api.get("/tier-list", {
            params: filter
        });
    },
    getTierById: async (id: string) => {
        return api.get(`/tier-list/${id}`);
    },

    updateTier: async (tierData: TierFormSchema & { id: string }) => {
        return api.patch(`/tier-list/${tierData.id}`, tierData);
    },

    deleteTier: async (id: string) => {
        return api.delete(`/tier-list/${id}`);
    }
}


export default tierAPI;
