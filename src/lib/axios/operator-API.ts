import Operator from "@/models/operator";
import api from "./instance";
import { TransactionStatus } from "@/models/transaction";
import { OperatorGroupedReportFilter } from "@/types/operator-report";

export type OperatorIndividualReportFilter = {
    childId: number;
    startDate: Date;
    endDate: Date;
}

export const operatorAPI = {
    createOperator: async (operatorData: any) => {
        return api.post("/operator", operatorData);
    },
    updateOperator: async (operatorData: Partial<Operator>) => {
        return api.patch(`/operator/${operatorData.id}`, operatorData);
    },
    getOperatorById: async (id: number) => {
        return api.get(`/operator/${id}`);
    },
    getAllOperators: async (filter?: any) => {
        return api.get("/operator", {
            params: filter
        });
    },
    getBelowOperators: async (filter?: { operatorId: number, page: number, limit: number }) => {
        return api.get(`/operator/hierarchy/${filter?.operatorId}`, {
            params: filter
        });
    },

    depositOperatorWallet: async (payload: any) => {
        return api.post("/operator/wallet-deposit", payload);
    },

    createUser: async (userData: any) => {
        return api.post("/operator/create-user", userData);
    },
    getCurrentOperator: async () => {
        return api.get("/operator/profile");
    },

    agentDepositToUser: async (payload: any) => {
        return api.post("/operator/agent-deposit-to-user", payload);
    },
    updateBettingStatus: async (payload: any) => {
        return api.patch(`/operator/update-betting-status/${payload.id}`, payload);
    },
    updateTransferStatus: async (payload: any) => {
        return api.patch(`/operator/update-transfer-status/${payload.id}`, payload);
    },
    getOperatorUsers: async (filter: { operatorId: number, page: number, limit: number, search?: string }) => {
        return api.get(`/operator/users/${filter.operatorId}`, {
            params: filter
        });
    },
    getOperatorTransactions: async (filter: { operatorId: number, page: number, limit: number }) => {
        return api.get(`/operator/transactions/${filter.operatorId}`, {
            params: filter
        });
    },

    // Get hierarchical user transactions from operators below (for Master to see Agent's user transactions)
    getHierarchicalTransactions: async (filter: { operatorId: number, page: number, limit: number, search?: string, type?: string, status?: string }) => {
        return api.get(`/operator/hierarchical-transactions/${filter.operatorId}`, {
            params: filter
        });
    },

    getCombinedOperatorReport: async (filter: { operatorId: number, startDate: Date, endDate: Date }) => {
        return api.get(`/operator/combined-report/${filter.operatorId}`, {
            params: filter
        });
    },

    getOpertorTransactions: async (operatorId: number) => {
        return api.get(`/operator/transactions/${operatorId}`);
    },
    settleTransaction: async (payload: { transactionId: number, status: TransactionStatus }) => {
        return api.patch(`/operator/settle-transaction/${payload.transactionId}`, payload);
    },

    getOperatorGroupedReport: async (filter?: OperatorGroupedReportFilter) => {
        return api.get("/admin/operator-grouped-report", {
            params: filter
        });
    },
    getOperatorIndividualReport: async (filter?: OperatorIndividualReportFilter) => {
        return api.get("/operator/individual-report", {
            params: filter
        });
    },

    // New Operator Wallet APIs
    getOperatorWalletTransactions: async (filter: { operatorId: number, page?: number, limit?: number }) => {
        return api.get(`/operator/wallet-transactions/${filter.operatorId}`, {
            params: filter
        });
    },

    getOperatorWalletBalance: async (operatorId: number) => {
        return api.get(`/operator/wallet-balance/${operatorId}`);
    },

    // Profit & Loss Sharing APIs
    getOperatorProfitLossStats: async (filter: { operatorId: number, startDate?: Date, endDate?: Date }) => {
        return api.get(`/operator/profit-loss-stats/${filter.operatorId}`, {
            params: {
                startDate: filter.startDate?.toISOString(),
                endDate: filter.endDate?.toISOString()
            }
        });
    },

    getCompanyProfitDistribution: async (filter: { startDate?: Date, endDate?: Date }) => {
        return api.get("/operator/company-profit-distribution", {
            params: {
                startDate: filter.startDate?.toISOString(),
                endDate: filter.endDate?.toISOString()
            }
        });
    },

    validateOperatorPercentage: async (payload: { operatorId: number, newPercentage: number }) => {
        return api.post(`/operator/validate-percentage/${payload.operatorId}`, {
            newPercentage: payload.newPercentage
        });
    },

    // Pool P/L APIs
    getUserPoolPL: async (filter: { userId: number, startDate?: Date, endDate?: Date }) => {
        return api.get(`/users/${filter.userId}/pool-pl`, {
            params: {
                startDate: filter.startDate?.toISOString(),
                endDate: filter.endDate?.toISOString(),
            }
        });
    },

    getOperatorHierarchyPoolPL: async (filter: { companyId: number, startDate?: Date, endDate?: Date, operatorId?: number, includeBreakdown?: boolean }) => {
        return api.get(`/operator/reports/pool-pl`, {
            params: {
                companyId: filter.companyId,
                operatorId: filter.operatorId,
                includeBreakdown: filter.includeBreakdown ?? false,
                startDate: filter.startDate?.toISOString(),
                endDate: filter.endDate?.toISOString(),
            }
        });
    },
};