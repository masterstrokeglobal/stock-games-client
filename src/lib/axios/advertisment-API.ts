import api from "./instance";
import { AdvertismentFormSchema } from "@/components/features/advertisment/advertisment-form";

export const advertisementAPI = {
    createAdvertisement: async (payload: AdvertismentFormSchema) => {
        return api.post("/advertisements", payload);
    },

    getAdvertisements: async (filter?: SearchFilters) => {
        const sanitizedFilter: any = {};

        Object.entries(filter ?? {}).forEach(([key, value]) => {
            if (value) {
                sanitizedFilter[key] = value;
            }
        });
        return api.get("/advertisements", { params: sanitizedFilter });
    },

    updateStatus: async (id: string) => {
        return api.patch(`/advertisements/status/${id}`);
    },

    getAdvertisementById: async (id: string) => {
        return api.get(`/advertisements/${id}`);
    },

    updateAdvertisementById: async (payload: Partial<AdvertismentFormSchema & { id: string }>) => {
        const { id, ...data } = payload;
        return api.patch(`/advertisements/${id}`, data);
    },
};