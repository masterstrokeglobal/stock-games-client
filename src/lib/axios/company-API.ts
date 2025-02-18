import { CompanyFormValues } from "@/components/features/company/company-form";
import { SchedulerType } from "@/models/market-item";
import api from "./instance";


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
        const { id ,...rest} = payload;
        return api.patch(`/company/${id}`, rest);
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
    updateDepositBonusPercentage: async (data: { companyId: string, depositBonusPercentage: number, updateAllUsers: boolean }) => {
        return api.patch(`/company/update-deposit-bonus`, data);
    },
    updateAgentUserBonusPercentage: async (data: { agentId: string, depositBonusPercentage: number, }) => {
        return api.patch(`/company/update-agent-user-deposit-bonus/${data.agentId}`, data);
    },
    updateDepositBonusPercentageEnabled: async (data: { companyId: string, depositBonusPercentageEnabled: boolean }) => {
        return api.patch(`/company/update-deposit-bonus-percentage-enabled/${data.companyId}`, data);
    },
};
