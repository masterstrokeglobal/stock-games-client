import api from "./instance";

const affiliateAPI = {
    createAffiliate: async (payload: any) => {
        return api.post("/affiliate", payload);
    },
    getAffiliateById: async (id: string) => {
        return api.get(`/affiliate/${id}`);
    },

    getAllAffiliate: async (filter: any) => {
        return api.get("/affiliate", { params: filter });
    },
    updateAffiliate: async (id: string, payload: any) => {
        return api.put(`/affiliate/${id}`, payload);
    },
    deleteAffiliate: async (id: string) => {
        return api.delete(`/affiliate/${id}`);
    },
    getAffiliateUsers: async (filter: any) => {
        return api.get(`/affiliate/users`, { params: filter });
    },
};

export default affiliateAPI;
