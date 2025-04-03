import api from "./instance";
import { AdvertismentFormSchema } from "@/components/features/advertisement/advertisment-form";

export const advertisementAPI = {
    createAdvertisement: async (payload: AdvertismentFormSchema) => {
        return api.post("/company-banner", payload);
    },

    getAdvertisement: async (filter?: SearchFilters) => {
        const sanitizedFilter: any = {};

        Object.entries(filter ?? {}).forEach(([key, value]) => {
            if (value) {
                sanitizedFilter[key] = value;
            }
        });
        return api.get("/company-banner", { params: sanitizedFilter });
    },

    updateStatus: async (id: string) => {
        return api.patch(`/company-banner/status/${id}`);
    },

    getAdvertisementById: async (id: string) => {
        return api.get(`/company-banner/${id}`);
    },

    updateAdvertisementById: async (payload: Partial<AdvertismentFormSchema & { id: string }>) => {
        const { id, ...data } = payload;
        return api.patch(`/company-banner/${id}`, data);
    },

    deleteAdvertisementById: async (id: string) => {
        return api.delete(`/company-banner/${id}`);
    },  
};