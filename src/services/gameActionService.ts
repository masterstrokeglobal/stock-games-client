/**
 * GameActionService - Handles user actions and triggers bonus updates
 * Integrates with BonusUpdateService for immediate updates after user actions
 */

import { bonusUpdateService } from './bonusUpdateService';

interface DepositRequest {
    userId: string;
    amount: number;
    paymentMethod?: string;
}

interface BetRequest {
    userId: string;
    betAmount: number;
    providerId: number;
    gameType: string;
    roundId?: string;
}

interface WagerProgress {
    bonusId: string;
    currentWager: number;
    requiredWager: number;
    progress: number;
}

class GameActionService {
    private pendingActions: Set<string> = new Set();

    /**
     * Handle deposit action and trigger bonus updates
     */
    async onDeposit(depositData: DepositRequest): Promise<any> {
        const actionId = `deposit_${depositData.userId}_${Date.now()}`;
        
        if (this.pendingActions.has(actionId)) {
            console.warn('Duplicate deposit action detected, skipping');
            return;
        }

        this.pendingActions.add(actionId);

        try {
            console.log('Processing deposit:', depositData);

            // Make deposit API call
            const response = await fetch('/api/user/deposit', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(depositData)
            });

            if (!response.ok) {
                throw new Error(`Deposit failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Deposit successful:', result);

            // Trigger immediate bonus check for deposit-related bonuses
            await this.triggerBonusCheck(depositData.userId, 'DEPOSIT', 1500);

            return result;

        } catch (error) {
            console.error('Deposit failed:', error);
            throw error;
        } finally {
            this.pendingActions.delete(actionId);
        }
    }

    /**
     * Handle bet/wager action and trigger bonus updates
     */
    async onBet(betData: BetRequest): Promise<any> {
        const actionId = `bet_${betData.userId}_${Date.now()}`;
        
        if (this.pendingActions.has(actionId)) {
            console.warn('Duplicate bet action detected, skipping');
            return;
        }

        this.pendingActions.add(actionId);

        try {
            console.log('Processing bet:', betData);

            // Make bet API call (works for both Stock Games and QTech)
            const response = await fetch('/api/game/bet', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(betData)
            });

            if (!response.ok) {
                throw new Error(`Bet failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Bet successful:', result);

            // Trigger immediate bonus check for wager-related bonuses
            await this.triggerBonusCheck(betData.userId, 'WAGER', 1000);

            return result;

        } catch (error) {
            console.error('Bet failed:', error);
            throw error;
        } finally {
            this.pendingActions.delete(actionId);
        }
    }

    /**
     * Handle game completion and check for completion bonuses
     */
    async onGameComplete(userId: string, gameData: any): Promise<void> {
        try {
            console.log('Game completed:', gameData);

            // Check for game completion bonuses
            await this.triggerBonusCheck(userId, 'GAME_COMPLETION', 1000);

        } catch (error) {
            console.error('Error handling game completion:', error);
        }
    }

    /**
     * Handle user login and check for login bonuses
     */
    async onUserLogin(userId: string): Promise<void> {
        try {
            console.log('User logged in:', userId);

            // Start bonus polling for active user
            bonusUpdateService.startPolling(userId, 5000);

            // Check for login bonuses
            await this.triggerBonusCheck(userId, 'LOGIN', 2000);

        } catch (error) {
            console.error('Error handling user login:', error);
        }
    }

    /**
     * Handle user logout and stop polling
     */
    async onUserLogout(): Promise<void> {
        try {
            console.log('User logged out');

            // Stop bonus polling
            bonusUpdateService.stopPolling();

        } catch (error) {
            console.error('Error handling user logout:', error);
        }
    }

    /**
     * Check wager progress for specific provider
     */
    async checkWagerProgress(userId: string, providerId: number): Promise<WagerProgress[]> {
        try {
            const response = await fetch(`/api/bonus-system/user/${userId}/provider-wager?providerId=${providerId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to check wager progress: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error checking wager progress:', error);
            return [];
        }
    }

    /**
     * Fix balance sync issues if detected
     */
    async fixBalanceSync(userId: string): Promise<any> {
        try {
            console.log('Fixing balance sync for user:', userId);

            const response = await fetch(`/api/bonus-system/user/${userId}/fix-balance`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fix balance sync: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Balance sync fixed:', result);

            // Trigger immediate update after balance fix
            await bonusUpdateService.triggerImmediateUpdate(userId, 500);

            return result;

        } catch (error) {
            console.error('Error fixing balance sync:', error);
            throw error;
        }
    }

    /**
     * Trigger bonus check with delay
     */
    private async triggerBonusCheck(userId: string, actionType: string, delayMs: number = 1000): Promise<void> {
        console.log(`Triggering bonus check for ${actionType} in ${delayMs}ms`);
        
        // Use the bonus update service for immediate check
        await bonusUpdateService.triggerImmediateUpdate(userId, delayMs);
    }

    /**
     * Get authentication token
     */
    private getAuthToken(): string {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken') || '';
        }
        return '';
    }

    /**
     * Get current pending actions count
     */
    getPendingActionsCount(): number {
        return this.pendingActions.size;
    }

    /**
     * Clear all pending actions (useful for cleanup)
     */
    clearPendingActions(): void {
        this.pendingActions.clear();
    }
}

// Export singleton instance
export const gameActionService = new GameActionService();
export type { DepositRequest, BetRequest, WagerProgress };
