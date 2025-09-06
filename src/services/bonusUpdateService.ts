/**
 * BonusUpdateService - Real-time bonus and wallet balance updates
 * Handles polling for bonus progress, wallet balance, and UI updates
 */

interface BonusData {
    bonusBalance: number;
    activeBonuses: any[];
    completedBonuses: any[];
    progressData: any;
}

interface WalletData {
    mainBalance: number;
    bonusBalance: number;
    totalBalance: number;
}

type BonusUpdateCallback = (data: BonusData) => void;
type WalletUpdateCallback = (data: WalletData) => void;

class BonusUpdateService {
    private pollingInterval: NodeJS.Timeout | null = null;
    private isPolling: boolean = false;
    private currentUserId: string | null = null;
    private bonusUpdateCallbacks: BonusUpdateCallback[] = [];
    private walletUpdateCallbacks: WalletUpdateCallback[] = [];
    private isDocumentVisible: boolean = true;
    private pollInterval: number = 5000; // 5 seconds default

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
                    // Resume polling when tab becomes active
                    this.startPolling(this.currentUserId);
                } else {
                    // Pause polling when tab becomes inactive
                    this.stopPolling();
                }
            });
        }
    }

    /**
     * Start polling for bonus and wallet updates
     */
    startPolling(userId: string, intervalMs: number = 5000) {
        if (this.isPolling && this.currentUserId === userId) return;
        
        this.stopPolling(); // Stop any existing polling
        
        this.currentUserId = userId;
        this.pollInterval = intervalMs;
        this.isPolling = true;

        console.log(`Starting bonus polling for user ${userId} every ${intervalMs}ms`);
        
        // Immediate check
        this.checkBonusUpdates(userId);
        
        // Set up interval polling (only if document is visible)
        if (this.isDocumentVisible) {
            this.pollingInterval = setInterval(async () => {
                if (this.isDocumentVisible) {
                    await this.checkBonusUpdates(userId);
                }
            }, intervalMs);
        }
    }

    /**
     * Stop polling
     */
    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.isPolling = false;
        console.log('Stopped bonus polling');
    }

    /**
     * Check for bonus updates
     */
    async checkBonusUpdates(userId: string) {
        if (!userId) return;

        try {
            // Parallel API calls for better performance
            const [bonusResponse, walletResponse] = await Promise.all([
                fetch(`/api/bonus-system/user/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`/api/user/${userId}/wallet`, {
                    headers: {
                        'Authorization': `Bearer ${this.getAuthToken()}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            if (bonusResponse.ok) {
                const bonusData = await bonusResponse.json();
                this.notifyBonusUpdate(bonusData);
            }

            if (walletResponse.ok) {
                const walletData = await walletResponse.json();
                this.notifyWalletUpdate(walletData);
            }

        } catch (error) {
            console.error('Error checking bonus updates:', error);
        }
    }

    /**
     * Force immediate bonus check (useful after user actions)
     */
    async triggerImmediateUpdate(userId: string, delayMs: number = 1000) {
        setTimeout(() => {
            this.checkBonusUpdates(userId);
        }, delayMs);
    }

    /**
     * Subscribe to bonus updates
     */
    onBonusUpdate(callback: BonusUpdateCallback) {
        this.bonusUpdateCallbacks.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.bonusUpdateCallbacks.indexOf(callback);
            if (index > -1) {
                this.bonusUpdateCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Subscribe to wallet updates
     */
    onWalletUpdate(callback: WalletUpdateCallback) {
        this.walletUpdateCallbacks.push(callback);
        
        // Return unsubscribe function
        return () => {
            const index = this.walletUpdateCallbacks.indexOf(callback);
            if (index > -1) {
                this.walletUpdateCallbacks.splice(index, 1);
            }
        };
    }

    /**
     * Notify all bonus update subscribers
     */
    private notifyBonusUpdate(data: BonusData) {
        this.bonusUpdateCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in bonus update callback:', error);
            }
        });
    }

    /**
     * Notify all wallet update subscribers
     */
    private notifyWalletUpdate(data: WalletData) {
        this.walletUpdateCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in wallet update callback:', error);
            }
        });
    }

    /**
     * Get authentication token (implement based on your auth system)
     */
    private getAuthToken(): string {
        // Implement your token retrieval logic here
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken') || '';
        }
        return '';
    }

    /**
     * Adjust polling frequency based on user activity
     */
    setPollingFrequency(intervalMs: number) {
        if (this.isPolling && this.currentUserId) {
            this.stopPolling();
            this.startPolling(this.currentUserId, intervalMs);
        } else {
            this.pollInterval = intervalMs;
        }
    }

    /**
     * Get current polling status
     */
    getStatus() {
        return {
            isPolling: this.isPolling,
            currentUserId: this.currentUserId,
            pollInterval: this.pollInterval,
            isDocumentVisible: this.isDocumentVisible
        };
    }
}

// Export singleton instance
export const bonusUpdateService = new BonusUpdateService();
export type { BonusData, WalletData, BonusUpdateCallback, WalletUpdateCallback };
