import Operator from "@/models/operator";
import api from "./instance";

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
    getBelowOperators: async (filter?: {operatorId: number, page: number, limit: number}) => {
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
        return api.get("/admin/profile");
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
    getOperatorUsers: async (filter: { operatorId: number, page: number, limit: number }) => {
        return api.get(`/operator/users/${filter.operatorId}`, {
            params: filter
        });
    },
    getOpertorTransactions: async (operatorId: number) => {
        return api.get(`/operator/transactions/${operatorId}`);
    },
    settleTransaction: async (transactionId: number) => {
        return api.patch(`/operator/settle-transaction/${transactionId}`);
    }
};