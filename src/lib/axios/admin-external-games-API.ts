import api from "./instance";

export const adminExternalGamesAPI = {
    get: async (params?: { companyId?: string }) => {
        return api.get(`/admin/external-games`, { params });
    },
    updateAllowed: async (payload: { allowedGames: string[] | ["all"] }) => {
        return api.put(`/admin/external-games/allowed`, payload);
    },
    updateThumbnails: async (companyId: string, payload: { gameThumbnails: Record<string, string> }) => {
        return api.put(`/admin/external-games/thumbnails`, payload, { params: { companyId } });
    },
};


