import { CompanyApiDetailsFormValues } from "@/components/features/company/company-api-detail-form";
import api from "./instance";

export const companyApiDetailsAPI = {
    // Fetch all company api details with optional filters
    getCompanyApiDetails: async (companyId: string) => {
        return api.get(`/company-api-details/${companyId}`);
    },

    createCompanyApiDetails: async (data: CompanyApiDetailsFormValues & { companyId: string }) => {
        return api.post(`/company-api-details`, {
            ...data,
            allowedGames: data.allowedGames.map((game) => game.value),
            companyId: data.companyId,
        });
    },

    // Fetch a single company api details by ID
    getCompanyApiDetailsById: async (id: string) => {
        return api.get(`/company-api-details/${id}`);
    },

    // Update a company api details status by ID
    updateCompanyApiDetailsById: async (payload: CompanyApiDetailsFormValues & { id: number | undefined }) => {
        const { id, ...data } = payload;
        return api.patch(`/company-api-details/${id}`, {
            ...data,
            allowedGames: data.allowedGames.map((game) => game.value),
        });
    },

    // Delete a company api details by ID
    deleteCompanyApiDetailsById: async (id: number) => {
        return api.delete(`/company-api-details/${id}`);
    },

    // Superadmin: update allowed games for a company
    updateAllowedGames: async (companyId: string, payload: { allowedGames: string[] | ["all"] }) => {
        return api.put(`/superadmin/company-api-details/${companyId}/allowed-games`, payload);
    },

    // Superadmin: update game thumbnails map for a company
    updateGameThumbnails: async (companyId: string, payload: { gameThumbnails: Record<string, string> }) => {
        return api.put(`/superadmin/company-api-details/${companyId}/game-thumbnails`, payload);
    },
};