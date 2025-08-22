/**
 * Integration Examples for Real-time Wallet Updates
 * Copy these patterns into your existing components
 */

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useWalletDisplay, useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import RealTimeWallet from '@/components/wallet/RealTimeWallet';

// Example 1: Simple wallet display in any component
const SimpleWalletDisplay = ({ userId }: { userId: string }) => {
    const { mainBalance, bonusBalance, totalBalance } = useWalletDisplay(userId);
    
    return (
        <div className="flex gap-4">
            <div>Main: ₹{mainBalance.toLocaleString()}</div>
            <div>Bonus: ₹{bonusBalance.toLocaleString()}</div>
            <div>Total: ₹{totalBalance.toLocaleString()}</div>
        </div>
    );
};

// Example 2: Deposit form with auto-update
const DepositForm = ({ userId }: { userId: string }) => {
    const { onDeposit, isLoading } = useRealTimeWallet({ userId });
    const [amount, setAmount] = useState(1000);
    
    const handleDeposit = async () => {
        try {
            // Your existing deposit API call
            const response = await fetch('/api/user/deposit', {
                method: 'POST',
                body: JSON.stringify({ userId, amount })
            });
            
            if (response.ok) {
                // After successful deposit, trigger wallet update
                await onDeposit(amount);
                toast.success('Deposit successful!');
            }
        } catch (error: any) {
            console.error('Error depositing:', error);
            toast.error('Deposit failed');
        }
    };
    
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleDeposit(); }}>
            <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))} 
            />
            <button type="submit" disabled={isLoading}>
                Deposit ₹{amount}
            </button>
        </form>
    );
};

// Example 3: Game betting with real-time updates
const GameBetting = ({ userId }: { userId: string }) => {
    const { onBet, mainBalance } = useRealTimeWallet({ userId, enablePolling: true });
    const [betAmount, setBetAmount] = useState(100);
    
    const placeBet = async (providerId: number) => {
        try {
            // Your existing bet API call
            const response = await fetch('/api/game/bet', {
                method: 'POST',
                body: JSON.stringify({ userId, betAmount, providerId })
            });
            
            if (response.ok) {
                // After successful bet, trigger wallet update
                await onBet(betAmount, providerId);
                toast.success('Bet placed!');
            }
        } catch (error: any) {
            console.error('Error placing bet:', error);
            toast.error('Bet failed');
        }
    };
    
    return (
        <div>
            <div>Available: ₹{mainBalance.toLocaleString()}</div>
            <input 
                type="number" 
                value={betAmount} 
                onChange={(e) => setBetAmount(Number(e.target.value))}
                max={mainBalance}
            />
            <button onClick={() => placeBet(1)}>Bet on Stock Games</button>
            <button onClick={() => placeBet(2)}>Bet on QTech Games</button>
        </div>
    );
};

// Example 4: Bonus claiming with wallet update
const BonusClaim = ({ userId, bonusId }: { userId: string; bonusId: string }) => {
    const { onTransaction } = useRealTimeWallet({ userId });
    
    const claimBonus = async () => {
        try {
            // Your existing claim API call
            const response = await fetch(`/api/bonus/claim/${bonusId}`, {
                method: 'POST'
            });
            
            if (response.ok) {
                // After successful claim, trigger wallet update
                await onTransaction('BONUS_CLAIM');
                toast.success('Bonus claimed!');
            }
        } catch (error) {
            console.error('Error claiming bonus:', error);
            toast.error('Claim failed');
        }
    };
    
    return <button onClick={claimBonus}>Claim Bonus</button>;
};

// Example 5: Layout component with persistent wallet display
const DashboardLayout = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm p-4">
                <div className="flex justify-between items-center">
                    <h1>Stock Derby</h1>
                    {/* Real-time wallet in header */}
                    <RealTimeWallet userId={userId} enablePolling={true} showActions={false} />
                </div>
            </header>
            <main className="p-6">
                {children}
            </main>
        </div>
    );
};

export {
    SimpleWalletDisplay,
    DepositForm,
    GameBetting,
    BonusClaim,
    DashboardLayout
};
