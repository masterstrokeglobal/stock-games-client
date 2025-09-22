import api from "./instance";

export interface CompanyProfitLoss {
  companyId: number;
  companyName: string;
  totalBets: number;
  totalWinnings: number;
  netProfitLoss: number;
  betCount: number;
  winCount: number;
  winRate: number;
}

export interface CompanyProfitLossResponse {
  success: boolean;
  data: CompanyProfitLoss;
}

export interface AllCompaniesProfitLossResponse {
  success: boolean;
  data: CompanyProfitLoss[];
}

export const companyProfitLossAPI = {
  // Get profit/loss for all companies
  getAllCompaniesProfitLoss: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get("/external-users/profit-loss", { params });
  },

  // Get profit/loss for a specific company
  getCompanyProfitLoss: async (companyId: number, params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get("/external-users/profit-loss", { 
      params: { 
        companyId, 
        ...params 
      } 
    });
  },

  // Get profit/loss summary
  getProfitLossSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get("/external-users/profit-loss/summary", { params });
  },

  // Get profit/loss dashboard data
  getProfitLossDashboard: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get("/external-users/profit-loss/dashboard", { params });
  },

  // Get profit/loss for a specific user
  getUserProfitLoss: async (userId: number, params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return api.get(`/external-users/profit-loss/${userId}`, { params });
  },
};
