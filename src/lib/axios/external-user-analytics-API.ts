import api from "./instance";

export interface ExternalUserTransaction {
  id: number;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  externalUser: {
    id: number;
    name: string;
    externalId: string;
    company: string;
  };
}

export interface ExternalUserTransactionsResponse {
  transactions: ExternalUserTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const externalUserTransactionsAPI = {
  // Get external user transactions
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    companyId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get("/external-users/transactions", { params });
  },
};
