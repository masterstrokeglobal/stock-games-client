import { TransactionStatus } from "@/models/transaction";
import api from "./instance";

export const agentAPI = {
    // Create a new agent
    createAgent: async (agentData: any) => {
        return api.post("/agent", agentData);
    },

    // Get all agents with optional filters
    getAllAgents: async (filter?: SearchFilters) => {
        return api.get("/agent", {
            params: filter
        });
    },

    // Get agent by ID
    getAgentById: async (agentId: string) => {
        return api.get(`/agent/${agentId}`);
    },

    // Get referrals for a specific agent
    getMyReferrals: async (filter: any) => {
        return api.get(`/agent/my-referrals/${filter.agentId}`, {
            params: filter
        });
    },

    // Update agent information
    updateAgent: async (agentId: string, updateData: any) => {
        return api.patch(`/agent/${agentId}`, updateData);
    },
    // Update agent password
    updateAgentPassword: async (agentId: string, password: string) => {
        return api.patch(`/agent/password/${agentId}`, { password });
    },
    profitLoss: async (filter: {
        agentId?: string,
        startDate?: Date;
        endDate?: Date;
    }) => {
        return api.get(`/agent/profit-loss/${filter.agentId}`, {
            params: filter
        });
    },

    // get Agent Transactions 
    getTransactions: async (filter: any) => {
        return api.get("/agent/transactions", {
            params: filter
        });
    },
    // Update agent chips deposit
    updateAgentChipsDeposit: async (payload: { transactionId: string, status: TransactionStatus }) => {
        return api.patch(`/payment/agent-chips-deposit/${payload.transactionId}`, payload);
    },
    // Update agent chips withdrawal
    updateAgentChipsWithdrawal: async (payload: { transactionId: string, status: TransactionStatus }) => {
        return api.patch(`/payment/agent-chips-withdraw/${payload.transactionId}`, payload);
    },

    // update user  deposit request status
    updateUserDepositRequest: async (payload: { transactionId: string, status: TransactionStatus }) => {
        return api.patch(`/agent/deposit-request-status/${payload.transactionId}`, payload);
    },

    // update user  withdraw request status
    updateUserWihtdrawRequest: async (payload: { transactionId: string, status: TransactionStatus }) => {
        return api.patch(`/agent/withdraw-request-status/${payload.transactionId}`, payload);
    },


    // Create agent chips deposit request
    createAgentChipsDepositRequest: async (payload: any) => {
        return api.post("/payment/agent-deposit-request", payload);
    },

    // Create agent chips withdrawal request
    createAgentChipsWithdrawRequest: async (payload: any) => {
        return api.post("/payment/agent-withdraw-request", payload);
    },

    // Deposit agent chips
    depositAgentChips: async (payload: any) => {
        return api.post("/agent-wallet-deposit", payload);
    },
    // Get agent chips deposit requests
    getAgentChipsDepositRequests: async (filter: any) => {
        return api.get("/agent-deposit-request", {
            params: filter
        });
    },
    // get agent wallet details
    getAgentWallet: async (agentId: string) => {
        return api.get(`/agent/wallet/${agentId}`);
    },
};

