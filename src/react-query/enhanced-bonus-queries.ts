import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import enhancedBonusAPI, { CreateBonusCampaignRequest, UpdateProviderRestrictionsRequest } from '@/lib/axios/enhanced-bonus-API';
import { ProviderType } from '@/models/enhanced-bonus';
import { toast } from 'sonner';

// Admin Bonus Management Queries
export const useCreateBonusCampaign = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (bonusData: CreateBonusCampaignRequest) => 
            enhancedBonusAPI.createBonusCampaign(bonusData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bonus-campaigns'] });
            toast.success('Bonus campaign created successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to create bonus campaign');
        }
    });
};

export const useGetAllBonusCampaigns = (filters?: any) => {
    return useQuery({
        queryKey: ['bonus-campaigns', filters],
        queryFn: () => enhancedBonusAPI.getAllBonusCampaigns(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateBonusCampaign = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ bonusId, bonusData }: { bonusId: string; bonusData: Partial<CreateBonusCampaignRequest> }) =>
            enhancedBonusAPI.updateBonusCampaign(bonusId, bonusData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bonus-campaigns'] });
            toast.success('Bonus campaign updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update bonus campaign');
        }
    });
};

export const useUpdateProviderRestrictions = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ bonusId, data }: { bonusId: string; data: UpdateProviderRestrictionsRequest }) =>
            enhancedBonusAPI.updateProviderRestrictions(bonusId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bonus-campaigns'] });
            toast.success('Provider restrictions updated successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update provider restrictions');
        }
    });
};

export const useGetAvailableProviders = () => {
    return useQuery({
        queryKey: ['bonus-providers'],
        queryFn: () => enhancedBonusAPI.getAvailableProviders(),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

// User Bonus Queries
export const useGetUserBonuses = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user-bonuses', userId],
        queryFn: () => enhancedBonusAPI.getUserBonuses(userId),
        enabled: enabled && !!userId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

export const useGetUserWagerProgress = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user-wager-progress', userId],
        queryFn: () => enhancedBonusAPI.getUserWagerProgress(userId),
        enabled: enabled && !!userId,
        refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
        staleTime: 15 * 1000, // 15 seconds
    });
};

export const useGetUserBonusSummary = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['user-bonus-summary', userId],
        queryFn: () => enhancedBonusAPI.getUserBonusSummary(userId),
        enabled: enabled && !!userId,
        refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
        staleTime: 15 * 1000, // 15 seconds
    });
};

// Enhanced user bonus status (no userId required per API shape)
export const useEnhancedUserBonusStatus = () => {
    return useQuery({
        queryKey: ['enhanced-user-bonus-status'],
        queryFn: () => enhancedBonusAPI.getEnhancedUserBonusStatus(),
        refetchInterval: 30 * 1000,
        staleTime: 15 * 1000,
    });
};

export const useGetBonusBreakdown = (assignmentId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['bonus-breakdown', assignmentId],
        queryFn: () => enhancedBonusAPI.getBonusBreakdown(assignmentId),
        enabled: enabled && !!assignmentId,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

// Betting Integration Mutations
export const useRecordStockBet = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (betData: {
            userId: string;
            roundId: string;
            symbol: string;
            direction: 'UP' | 'DOWN';
            amount: number;
        }) => enhancedBonusAPI.recordStockBet(betData),
        onSuccess: (data, variables) => {
            // Invalidate wager progress to show updated bonus progress
            queryClient.invalidateQueries({ queryKey: ['user-wager-progress', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['user-bonuses', variables.userId] });
            toast.success('Stock bet placed successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to place stock bet');
        }
    });
};

export const useRecordQTechBet = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (betData: {
            userId: string;
            gameId: string;
            betAmount: number;
            gameType: string;
        }) => enhancedBonusAPI.recordQTechBet(betData),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-wager-progress', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['user-bonuses', variables.userId] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to record casino bet');
        }
    });
};

// Bonus Assignment and Completion
export const useAssignBonus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ userId, bonusCampaignId, depositAmount }: {
            userId: string;
            bonusCampaignId: string;
            depositAmount?: number;
        }) => enhancedBonusAPI.assignBonus(userId, bonusCampaignId, depositAmount),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-bonuses', variables.userId] });
            queryClient.invalidateQueries({ queryKey: ['user-wager-progress', variables.userId] });
            toast.success('Bonus assigned successfully');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to assign bonus');
        }
    });
};

export const useClaimCompletedBonus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (assignmentId: string) => enhancedBonusAPI.claimCompletedBonus(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-bonuses'] });
            queryClient.invalidateQueries({ queryKey: ['user-wager-progress'] });
            toast.success('Bonus claimed successfully! Funds added to your balance.');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to claim bonus');
        }
    });
};

// Analytics and Reports
export const useGetBonusAnalytics = (filters?: {
    startDate?: string;
    endDate?: string;
    bonusCampaignId?: string;
    providerId?: ProviderType;
}) => {
    return useQuery({
        queryKey: ['bonus-analytics', filters],
        queryFn: () => enhancedBonusAPI.getBonusAnalytics(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Payment method analytics
export const usePaymentMethodAnalytics = (period: number = 30) => {
    return useQuery({
        queryKey: ['bonus-payment-method-analytics', period],
        queryFn: () => enhancedBonusAPI.getPaymentMethodAnalytics(period),
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetUserBonusHistory = (userId: string, page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: ['user-bonus-history', userId, page, limit],
        queryFn: () => enhancedBonusAPI.getUserBonusHistory(userId, page, limit),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Campaign Management Mutations
export const useUpdateCampaignStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ bonusId, status }: { bonusId: string; status: 'active' | 'inactive' | 'paused' | 'draft' }) =>
            enhancedBonusAPI.updateCampaignStatus(bonusId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bonus-campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['bonus-analytics'] });
        },
    });
};

export const useDeleteBonusCampaign = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (bonusId: string) => enhancedBonusAPI.deleteBonusCampaign(bonusId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bonus-campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['bonus-analytics'] });
        },
    });
};
