/**
 * React Hook for Real-time Wallet Updates
 * Integrates with realTimeUpdateService for easy component usage
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { realTimeUpdateService, UIUpdateData } from '@/services/realTimeUpdateService';

interface UseRealTimeWalletOptions {
    userId: string | null;
    enablePolling?: boolean;
    pollInterval?: number;
}

interface WalletState {
    mainBalance: number;
    bonusBalance: number;
    isLoading: boolean;
    lastUpdated: Date | null;
}

export const useRealTimeWallet = (options: UseRealTimeWalletOptions) => {
    const { userId, enablePolling = true, pollInterval = 10000 } = options;
    
    const [walletState, setWalletState] = useState<WalletState>({
        mainBalance: 0,
        bonusBalance: 0,
        isLoading: true,
        lastUpdated: null
    });

    const unsubscribeRef = useRef<(() => void) | null>(null);

    // Handle wallet updates from the service
    const handleWalletUpdate = useCallback((data: UIUpdateData) => {
        setWalletState(prev => ({
            ...prev,
            mainBalance: data.mainBalance,
            bonusBalance: data.bonusBalance,
            isLoading: false,
            lastUpdated: new Date()
        }));
    }, []);

    // Initialize service when userId changes
    useEffect(() => {
        if (!userId) {
            realTimeUpdateService.stopPolling();
            setWalletState(prev => ({ ...prev, isLoading: false }));
            return;
        }

        // Subscribe to wallet updates
        unsubscribeRef.current = realTimeUpdateService.onWalletUpdate(handleWalletUpdate);

        // Start polling if enabled
        if (enablePolling) {
            realTimeUpdateService.startPolling(userId, pollInterval);
        }

        // Cleanup on unmount or userId change
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [userId, enablePolling, pollInterval, handleWalletUpdate]);

    // Manual refresh function
    const refreshWallet = useCallback(async () => {
        if (userId) {
            setWalletState(prev => ({ ...prev, isLoading: true }));
            await realTimeUpdateService.checkWalletBalance(userId);
        }
    }, [userId]);

    // Transaction handlers
    const onDeposit = useCallback(async (amount: number) => {
        if (userId) {
            await realTimeUpdateService.onDeposit(userId, amount);
        }
    }, [userId]);

    const onBet = useCallback(async (betAmount: number, providerId: number) => {
        if (userId) {
            await realTimeUpdateService.onBet(userId, betAmount, providerId);
        }
    }, [userId]);

    const onTransaction = useCallback(async (transactionType: string, amount?: number) => {
        if (userId) {
            await realTimeUpdateService.onTransaction(userId, transactionType, amount);
        }
    }, [userId]);

    return {
        // Wallet state
        mainBalance: walletState.mainBalance,
        bonusBalance: walletState.bonusBalance,
        totalBalance: walletState.mainBalance + walletState.bonusBalance,
        isLoading: walletState.isLoading,
        lastUpdated: walletState.lastUpdated,
        
        // Actions
        refreshWallet,
        onDeposit,
        onBet,
        onTransaction,
        
        // Service status
        serviceStatus: realTimeUpdateService.getStatus()
    };
};

/**
 * Hook for simple wallet display (no polling, just updates after transactions)
 */
export const useWalletDisplay = (userId: string | null) => {
    return useRealTimeWallet({
        userId,
        enablePolling: false // Only update after transactions
    });
};

/**
 * Hook for active wallet monitoring (with polling)
 */
export const useActiveWallet = (userId: string | null, pollInterval: number = 10000) => {
    return useRealTimeWallet({
        userId,
        enablePolling: true,
        pollInterval
    });
};
