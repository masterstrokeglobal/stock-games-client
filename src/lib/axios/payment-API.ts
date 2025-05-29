import { TransactionStatus } from "@/models/transaction";
import api from "./instance";

export type GetCompanyProfitLossFilters = {
  search?: string;
  page: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
  companyIdFilter?: number;
}

export const paymentAPI = {
  // Get the user's wallet information
  getUserWallet: async () => {
    return api.get("/payment/wallet");
  },

  getCompanyProfitLoss: async (filters: GetCompanyProfitLossFilters) => {
    return api.get("/payment/daily-profit-loss", {
      params: filters,
    });
  },

  // Create a deposit request for the user's wallet
  createDepositRequest: async (data: any) => {
    return api.post("/payment/deposit", data);
  },

  createCompanyDepositRequest: async (data: any) => {
    return api.post(`/payment/company-chips-deposit/`, data);
  },

  createCompanyWithdrawalRequest: async (data: any) => {
    return api.post(`/payment/company-chips-withdraw`, data);
  },
  // Create a withdrawal request for the user's wallet
  createWithdrawalRequest: async (data: any) => {
    return api.post("/payment/withdraw", data);
  },

  depositCoinsToCompanyWallet: async (data: any) => {
    return api.post(`/admin/company-deposit/${data.companyWalletId}`, data);
  },

  companyWalletTransactions: async (filter: any) => {
    return api.get("/payment/company-wallet-transactions", {
      params: filter
    });
  },
  verifyCompanyDeposit: async (payload: { transactionId: string, status: TransactionStatus }) => {
    return api.patch(`/payment/company-chips-deposit/${payload.transactionId}`,payload);
  },


  // Get all transactions (only accessible by users with COMPANY_ADMIN role)
  getTransactions: async (filter: any) => {
    return api.get("/payment/transaction", {
      params: filter,
    });
  },

  getProfitLoss: async (companyId: string) => {
    return api.get(`/payment/company-profit-loss?companyId=${companyId || ""}`);
  },

  getUserProfitLoss: async (userId: string) => {
    return api.get(`/payment/individual-profit-loss?userId=${userId || ""}`);
  },

  getUserTransactions: async (filter: any) => {
    return api.get("/payment/user-transactions", {
      params: filter,
    });
  },

  // Get a specific transaction by ID (only accessible by users with COMPANY_ADMIN role)
  getTransactionById: async (transactionId: string) => {
    return api.get(`/payment/transaction/${transactionId}`);
  },

  // Update a transaction by ID (only accessible by users with COMPANY_ADMIN role)
  updateTransactionById: ({ data, transactionId }: { transactionId: string, data: any }) => {
    return api.patch(`/payment/${transactionId}`, data);
  },

  // Confirm a withdrawal by transaction ID (only accessible by users with COMPANY_ADMIN role)
  confirmWithdrawal: (transactionId: string) => {
    return api.patch(`/payment/confirm-withdrawal/${transactionId}`);
  },
};
