import { SchedulerType } from "@/models/market-item";
import api from "./instance";
import { CompanyFormValues } from "@/components/features/company/company-form";


export const companyAPI = {
    createCompany: async (payload: CompanyFormValues) => {
        return api.post("/company", payload);
    },

    getAllCompanies: async (filter: SearchFilters) => {
        return api.get("/company", { params: filter });
    },

    getCompanyById: async (companyId: string) => {
        return api.get(`/company/${companyId}`);
    },

    updateCompanyById: async (payload: CompanyFormValues) => {
        return api.patch(`/company/${payload.id}`, payload);
    },

    deleteCompanyById: async (companyId: string) => {
        return api.delete(`/company/${companyId}`);
    },
    addPlacementNotAllowed: async (data: { placementNotAllowed: SchedulerType, companyId: string }) => {
        return api.post(`/company/add-placement-not-allowed/${data.companyId}`, data);
    },
    removePlacementNotAllowed: async (data: { placementNotAllowed: SchedulerType, companyId: string }) => {
        return api.post(`/company/remove-placement-not-allowed/${data.companyId}`, data);
    },
};
