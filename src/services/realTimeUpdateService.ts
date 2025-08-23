/**
 * Real-time Wallet & Bonus Update Service
 * Simplified approach: Check wallet balance after transactions
 * Auto-sync ensures balance is always accurate
 */

interface WalletData {
    mainBalance: number;
    bonusBalance: number;
    totalBalance: number;
}

interface UIUpdateData {
    mainBalance: number;
    bonusBalance: number;
}

type WalletUpdateCallback = (data: UIUpdateData) => void;

class RealTimeUpdateService {
    private pollingInterval: NodeJS.Timeout | null = null;
    private isPolling: boolean = false;
    private currentUserId: string | null = null;
    private updateCallbacks: WalletUpdateCallback[] = [];
    private isDocumentVisible: boolean = true;
    private pollInterval: number = 10000; // 10 seconds for regular polling

    constructor() {
        this.setupVisibilityListener();
    }

    /**
     * Setup document visibility listener to pause polling when tab is inactive
     */
    private setupVisibilityListener() {
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                this.isDocumentVisible = !document.hidden;
                
                if (this.isDocumentVisible && this.currentUserId) {
                    this.startPolling(this.currentUserId);
                } else {
                    this.pausePolling();
                }
            });
        }
    }

    /**
     * Start regular wallet polling
     */
    startPolling(userId: string, intervalMs: number = 10000) {
        if (this.isPolling && this.currentUserId === userId) return;
        
        this.stopPolling();
        
        this.currentUserId = userId;
        this.pollInterval = intervalMs;
        this.isPolling = true;

        console.log(`Starting wallet polling for user ${userId} every ${intervalMs}ms`);
        
        // Immediate check
        this.checkWalletBalance(userId);
        
        // Set up interval polling (only if document is visible)
        if (this.isDocumentVisible) {
            this.pollingInterval = setInterval(() => {
                if (this.isDocumentVisible) {
                    this.checkWalletBalance(userId);
                }
            }, intervalMs);
        }
    }

    /**
     * Pause polling (keep state for resume)
     */
    private pausePolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    /**
     * Stop polling completely
     */
    stopPolling() {
        this.pausePolling();
        this.isPolling = false;
        this.currentUserId = null;
        console.log('Stopped wallet polling');
    }

    /**
     * Check wallet balance - always accurate due to auto-sync
     */
    async checkWalletBalance(userId: string) {
        if (!userId) return;

        try {
            const response = await fetch(`/api/user/${userId}/wallet`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const walletData: WalletData = await response.json();
                
                // The balance will ALWAYS be accurate because auto-sync runs after every wallet update
                this.updateUI({
                    mainBalance: walletData.mainBalance,
                    bonusBalance: walletData.bonusBalance
                });
            }

        } catch (error) {
            console.error('Error checking wallet balance:', error);
        }
    }

    /**
     * Check balance immediately after any bet/transaction
     */
    async checkAfterTransaction(userId: string, delayMs: number = 1000) {
        console.log(`Checking wallet balance after transaction in ${delayMs}ms`);
        
        setTimeout(async () => {
            await this.checkWalletBalance(userId);
        }, delayMs);
    }

    /**
     * Subscribe to wallet updates
     */
    onWalletUpdate(callback: WalletUpdateCallback) {
        this.updateCallbacks.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.updateCallbacks.indexOf(callback);
            if (index > -1) {
                this.updateCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Update UI with latest wallet data
     */
    private updateUI(data: UIUpdateData) {
        this.updateCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in wallet update callback:', error);
            }
        });
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
     * Handle user login - start polling
     */
    onUserLogin(userId: string) {
        console.log('User logged in, starting wallet polling');
        this.startPolling(userId);
    }

    /**
     * Handle user logout - stop polling
     */
    onUserLogout() {
        console.log('User logged out, stopping wallet polling');
        this.stopPolling();
    }

    /**
     * Handle deposit transaction
     */
    async onDeposit(userId: string, amount: number) {
        console.log(`Deposit of ${amount} completed for user ${userId}`);
        // After any transaction, just check the wallet balance
        await this.checkAfterTransaction(userId, 1500);
    }

    /**
     * Handle bet transaction
     */
    async onBet(userId: string, betAmount: number, providerId: number) {
        console.log(`Bet of ${betAmount} placed for user ${userId} on provider ${providerId}`);
        // After any bet/transaction, just check the wallet balance
        await this.checkAfterTransaction(userId, 1000);
    }

    /**
     * Handle any wallet-affecting transaction
     */
    async onTransaction(userId: string, transactionType: string, amount?: number) {
        console.log(`Transaction ${transactionType} completed for user ${userId} , amount: ${amount}`);
        // The balance will ALWAYS be accurate because auto-sync runs after every wallet update
        await this.checkAfterTransaction(userId, 1000);
    }

    /**
     * Get current service status
     */
    getStatus() {
        return {
            isPolling: this.isPolling,
            currentUserId: this.currentUserId,
            pollInterval: this.pollInterval,
            isDocumentVisible: this.isDocumentVisible,
            subscriberCount: this.updateCallbacks.length
        };
    }
}

// Export singleton instance
export const realTimeUpdateService = new RealTimeUpdateService();
export type { WalletData, UIUpdateData, WalletUpdateCallback };
