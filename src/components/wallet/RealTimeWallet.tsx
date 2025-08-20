/**
 * Real-time Wallet Balance Component
 * Demonstrates integration with the real-time update service
 */

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { RefreshCw, Wallet, Gift, DollarSign } from 'lucide-react';

interface RealTimeWalletProps {
    userId: string | null;
    enablePolling?: boolean;
    showActions?: boolean;
}

const RealTimeWallet: React.FC<RealTimeWalletProps> = ({ 
    userId, 
    enablePolling = true,
    showActions = true 
}) => {
    const {
        mainBalance,
        bonusBalance,
        totalBalance,
        isLoading,
        lastUpdated,
        refreshWallet,
        onDeposit,
        onBet,
        serviceStatus
    } = useRealTimeWallet({ userId, enablePolling });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatLastUpdated = (date: Date | null) => {
        if (!date) return 'Never';
        return date.toLocaleTimeString();
    };

    if (!userId) {
        return (
            <Card>
                <CardContent className="p-6 text-center text-gray-500">
                    Please log in to view wallet balance
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Balance
                    {serviceStatus.isPolling && (
                        <Badge variant="outline" className="text-xs">
                            Live
                        </Badge>
                    )}
                </CardTitle>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshWallet}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            
            <CardContent className="space-y-4">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Main Balance */}
                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <DollarSign className="h-4 w-4" />
                            Main Balance
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(mainBalance)}
                        </div>
                    </div>

                    {/* Bonus Balance */}
                    <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Gift className="h-4 w-4" />
                            Bonus Balance
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                            {formatCurrency(bonusBalance)}
                        </div>
                    </div>

                    {/* Total Balance */}
                    <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="text-sm text-gray-600 mb-1">
                            Total Balance
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                            {formatCurrency(totalBalance)}
                        </div>
                    </div>
                </div>

                {/* Last Updated Info */}
                <div className="text-xs text-gray-500 text-center">
                    Last updated: {formatLastUpdated(lastUpdated)}
                    {serviceStatus.isPolling && (
                        <span className="ml-2">
                            • Auto-refresh every {serviceStatus.pollInterval / 1000}s
                        </span>
                    )}
                </div>

                {/* Demo Action Buttons */}
                {showActions && (
                    <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Demo Actions:</div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => onDeposit(1000)}
                            >
                                Demo Deposit ₹1000
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => onBet(100, 1)}
                            >
                                Demo Bet ₹100
                            </Button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            These buttons simulate transactions and trigger balance updates
                        </div>
                    </div>
                )}

                {/* Service Status (for debugging) */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="border-t pt-4">
                        <div className="text-xs font-medium mb-1">Service Status:</div>
                        <div className="text-xs text-gray-600 space-y-1">
                            <div>Polling: {serviceStatus.isPolling ? 'Active' : 'Inactive'}</div>
                            <div>User ID: {serviceStatus.currentUserId || 'None'}</div>
                            <div>Visible: {serviceStatus.isDocumentVisible ? 'Yes' : 'No'}</div>
                            <div>Subscribers: {serviceStatus.subscriberCount}</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RealTimeWallet;
