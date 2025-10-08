import api from "./instance";

export interface BetHistoryFilters {
    userId?: number;
    companyId?: number;
    gameType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface BetStatisticsFilters {
    userId?: number;
    companyId?: number;
    startDate?: string;
    endDate?: string;
}

export const betHistoryAPI = {
    getBetHistory: async (filters: BetHistoryFilters) => {
        return api.get("/admin/bet-history", {
            params: filters
        });
    },

    getBetStatistics: async (filters: BetStatisticsFilters) => {
        return api.get("/admin/bet-statistics", {
            params: filters
        });
    },
};


