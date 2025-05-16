import { LedgerFormData } from "@/components/features/ledger/ledger-form";

import api from "./instance";

const ledgerAPI = {
    createLedgerEntry: async (data: LedgerFormData & { companyId: string }) => {
        return api.post("/ledger", data);
    },
    getAllLedgerEntries: async (params: SearchFilters) => {
        return api.get("/ledger", { params });
    },
    getLedgerById: async (id: string) => {
        return api.get(`/ledger/${id}`);
    },
    updateLedgerEntry: async (data: LedgerFormData & { id: string }) => {
        return api.patch(`/ledger/${data.id}`, data);
    },
    deleteLedgerEntry: async (id: string) => {
        return api.delete(`/ledger/${id}`);
    },
    getLedgerReport: async ({companyId, startDate, endDate}: {companyId: string, startDate: Date, endDate: Date }) => {
        return api.get(`/ledger/report/${companyId}`, {params: {startDate, endDate}});
    },
};

export default ledgerAPI;
