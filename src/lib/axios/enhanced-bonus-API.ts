import api from "./instance";
import { BonusAssignment, WagerProgress, BonusBreakdown, ProviderType } from "@/models/enhanced-bonus";

export interface CreateBonusCampaignRequest {
    bonusName: string;
    description: string;
    bonusType: string;
    triggerEvent: string;
    bonusValue: number;
    wagerRequirementType: string;
    wagerRequirementValue: number;
    spendingRequirement?: number;
    applicableProviders?: ProviderType[];
    // Simplified payment system per updated documentation
    applicablePaymentCategories?: string[]; // ["CRYPTOCURRENCY", "BANK_TRANSFER", "INTERNAL_TRANSFER"]
    applicablePaymentMethods?: string[];    // Optional, for legacy support
    directMainCredit?: boolean;             // NEW: Direct to main balance (no wager)
    minDeposit?: number;
    maxBonusAmount?: number;
    validityDays?: number;
    currentUsageCount: number;
    isActive: boolean;
    companyId?: number;
    // Optional scheduling/status fields
    termsAndConditions?: string;
    startDate?: string;
    endDate?: string;
    status?: 'active' | 'inactive' | 'paused' | 'draft';
}

export interface UpdateProviderRestrictionsRequest {
    applicableProviders: ProviderType[];
}

const enhancedBonusAPI = {
    // Admin Bonus Management
    createBonusCampaign: async (bonusData: CreateBonusCampaignRequest) => {
        const response = await api.post(`/admin/bonus-campaigns`, bonusData);
        return response.data;
    },

    getAllBonusCampaigns: async (filters?: any) => {
        const response = await api.get(`/admin/bonus-campaigns`, { params: filters });
        return response.data;
    },

    updateBonusCampaign: async (bonusId: string, bonusData: Partial<CreateBonusCampaignRequest>) => {
        const response = await api.patch(`/admin/bonus-campaigns/${bonusId}`, bonusData);
        return response.data;
    },

    updateCampaignStatus: async (bonusId: string, status: 'active' | 'inactive' | 'paused' | 'draft') => {
        const response = await api.patch(`/admin/bonus-campaigns/${bonusId}/status`, { status });
        return response.data;
    },

    updateProviderRestrictions: async (bonusId: string, data: UpdateProviderRestrictionsRequest) => {
        const response = await api.patch(`/admin/bonus-campaigns/${bonusId}/providers`, data);
        return response.data;
    },

    deleteBonusCampaign: async (bonusId: string) => {
        const response = await api.delete(`/admin/bonus-campaigns/${bonusId}`);
        return response.data;
    },

    getAvailableProviders: async () => {
        const response = await api.get(`/admin/providers`);
        return response.data;
    },

    // User Bonus Operations
    getUserBonuses: async (userId: string): Promise<{ data: BonusAssignment[] }> => {
        const response = await api.get(`/bonus/user/${userId}/status`);
        return response.data;
    },

    getUserWagerProgress: async (userId: string): Promise<{ data: WagerProgress }> => {
        const response = await api.get(`/bonus-system/user/${userId}/wager-progress`);
        return response.data;
    },

    getUserBonusSummary: async (userId: string) => {
        const response = await api.get(`/bonus-system/user/${userId}`);
        return response.data;
    },

    getBonusBreakdown: async (assignmentId: string): Promise<{ data: BonusBreakdown }> => {
        const response = await api.get(`/bonus/assignment/${assignmentId}/wager-breakdown`);
        return response.data;
    },

    // Provider Wager Tracking
    updateProviderWager: async (wagerData: {
        userId: string;
        providerId: ProviderType;
        wagerAmount: number;
        gameId: string;
    }) => {
        const response = await api.post(`/bonus/wager/provider-update`, wagerData);
        return response.data;
    },

    // Betting Integration
    recordStockBet: async (betData: {
        userId: string;
        roundId: string;
        symbol: string;
        direction: 'UP' | 'DOWN';
        amount: number;
    }) => {
        const response = await api.post(`/stock-slot-placement`, {
            roundId: betData.roundId,
            marketItem: betData.symbol,
            placement: betData.direction,
            amount: betData.amount
        });
        return response.data;
    },

    recordQTechBet: async (betData: {
        userId: string;
        gameId: string;
        betAmount: number;
        gameType: string;
    }) => {
        const response = await api.post(`/qtech/bet-callback`, betData);
        return response.data;
    },

    // Bonus Assignment and Completion
    assignBonus: async (userId: string, bonusCampaignId: string, depositAmount?: number) => {
        const response = await api.post(`/bonus/assign`, {
            userId,
            bonusCampaignId,
            depositAmount
        });
        return response.data;
    },

    claimCompletedBonus: async (assignmentId: string) => {
        const response = await api.post(`/bonus/claim/${assignmentId}`);
        return response.data;
    },

    // Analytics and Reports
    getBonusAnalytics: async (filters?: {
        startDate?: string;
        endDate?: string;
        bonusCampaignId?: string;
        providerId?: ProviderType;
    }) => {
        const response = await api.get(`/admin/bonus/system-analytics`, { params: filters });
        return response.data;
    },

    getCampaignAnalytics: async (campaignId: string) => {
        const response = await api.get(`/admin/bonus-campaigns/${campaignId}/analytics`);
        return response.data;
    },

    getUserProviderAnalytics: async (userId: string) => {
        const response = await api.get(`/admin/bonus/user/${userId}/provider-analytics`);
        return response.data;
    },

    getUserBonusHistory: async (userId: string, page: number = 1, limit: number = 10) => {
        const response = await api.get(`/bonus/user/${userId}/history`, {
            params: { page, limit }
        });
        return response.data;
    },

    // Enhanced payment method analytics
    getPaymentMethodAnalytics: async (period: number = 30) => {
        const response = await api.get(`/admin/bonus-analytics/payment-methods`, { params: { period } });
        return response.data;
    },

    // Enhanced user bonus status (payment-method aware + direct credit)
    getEnhancedUserBonusStatus: async () => {
        const response = await api.get(`/user/bonus-status`);
        return response.data?.data ?? response.data;
    },

    // Payment method eligibility check
    getBonusEligibility: async (depositAmount: number, paymentMethod: string) => {
        const response = await api.get(`/user/bonus-eligibility`, {
            params: { depositAmount, paymentMethod }
        });
        return response.data?.data ?? response.data;
    },

    // QTech Integration
    qtechBalanceCheck: async (playerId: string) => {
        const response = await api.post(`/qtech/balance-check`, { player_id: playerId });
        return response.data;
    },

    // Health Check
    healthCheck: async () => {
        const response = await api.get(`/health`);
        return response.data;
    }
};

export default enhancedBonusAPI;
