import Company from "@/models/company";
import api from "./instance";

export const companyAPI = {
    createCompany: async (payload: any) => {
        return api.post("/company", payload);
    },

    getAllCompanies: async () => {
        return api.get("/company");
    },

    getCompanyById: async (companyId: string) => {
        return api.get(`/company/${companyId}`);
    },

    updateCompanyById: async (payload: Company) => {
        return api.patch(`/company/${payload.id}`, payload);
    },

    deleteCompanyById: async (companyId: string) => {
        return api.delete(`/company/${companyId}`);
    },
};
