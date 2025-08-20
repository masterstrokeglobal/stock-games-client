"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Target, Zap } from 'lucide-react';
import { useAuthStore } from '@/context/auth-context';
import { useRecordStockBet, useGetUserWagerProgress } from '@/react-query/enhanced-bonus-queries';
import { ProviderType, BonusStatus } from '@/models/enhanced-bonus';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface StockBetData {
    roundId: string;
    symbol: string;
    direction: 'UP' | 'DOWN';
    amount: number;
}

interface StockBettingIntegrationProps {
    currentRound?: {
        id: string;
        startTime: Date;
        endTime: Date;
        isActive: boolean;
    };
    availableSymbols?: string[];
    onBetPlaced?: (betData: StockBetData) => void;
    className?: string;
}

const StockBettingIntegration: React.FC<StockBettingIntegrationProps> = ({
    currentRound,
    availableSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
    onBetPlaced,
    className
}) => {
    const { userDetails } = useAuthStore();
    const [selectedSymbol, setSelectedSymbol] = useState(availableSymbols[0]);
    const [betAmount, setBetAmount] = useState(10);
    const [showBonusProgress, setShowBonusProgress] = useState(false);
    
    const recordStockBetMutation = useRecordStockBet();
    const { data: wagerProgress, refetch: refetchProgress } = useGetUserWagerProgress(
        userDetails?.id?.toString() || '',
        !!userDetails?.id
    );

    // Check for active stock bonuses
    const stockBonuses = wagerProgress?.data?.assignments?.filter(
        assignment => assignment.status === BonusStatus.ACTIVE &&
        (!assignment.bonusCampaign.applicableProviders || 
         assignment.bonusCampaign.applicableProviders.includes(ProviderType.STOCK))
    ) || [];

    const hasActiveStockBonuses = stockBonuses.length > 0;

    useEffect(() => {
        if (hasActiveStockBonuses) {
            setShowBonusProgress(true);
        }
    }, [hasActiveStockBonuses]);

    const handleStockBet = async (direction: 'UP' | 'DOWN') => {
        if (!userDetails?.id || !currentRound?.id) {
            toast.error('Please log in and wait for an active trading round');
            return;
        }

        const betData: StockBetData = {
            roundId: currentRound.id,
            symbol: selectedSymbol,
            direction,
            amount: betAmount
        };

        try {
            // Record the stock bet
            await recordStockBetMutation.mutateAsync({
                userId: userDetails.id.toString(),
                roundId: betData.roundId,
                symbol: betData.symbol,
                direction: betData.direction,
                amount: betData.amount
            });

            // Show bonus progress update if applicable
            if (hasActiveStockBonuses) {
                const totalBonusValue = stockBonuses.reduce(
                    (sum, bonus) => sum + bonus.potBalance, 0
                );
                
                toast.success(
                    `Stock bet placed! Contributing to ${stockBonuses.length} active bonus${stockBonuses.length > 1 ? 'es' : ''} (${totalBonusValue.toFixed(2)} total value)`,
                    { duration: 5000 }
                );
                
                // Refresh bonus progress
                setTimeout(() => refetchProgress(), 1000);
            }

            // Call parent callback
            onBetPlaced?.(betData);

        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to place stock bet');
        }
    };

    const getBonusProgressBar = (assignment: any) => {
        const totalWagered = assignment.requiredWager - assignment.remainingWager;
        const progress = (totalWagered / assignment.requiredWager) * 100;
        return Math.min(progress, 100);
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Stock Trading Interface */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Stock Trading
                        {hasActiveStockBonuses && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                                {stockBonuses.length} Bonus{stockBonuses.length > 1 ? 'es' : ''} Active
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Symbol Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Stock Symbol</label>
                        <div className="flex flex-wrap gap-2">
                            {availableSymbols.map((symbol) => (
                                <Button
                                    key={symbol}
                                    variant={selectedSymbol === symbol ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedSymbol(symbol)}
                                >
                                    {symbol}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Bet Amount */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bet Amount ($)</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={betAmount}
                                onChange={(e) => setBetAmount(Number(e.target.value))}
                                min="1"
                                max="1000"
                                className="flex-1 px-3 py-2 border rounded-md"
                                placeholder="Enter amount"
                            />
                            <div className="flex gap-1">
                                {[10, 25, 50, 100].map((amount) => (
                                    <Button
                                        key={amount}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBetAmount(amount)}
                                    >
                                        ${amount}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trading Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            size="lg"
                            onClick={() => handleStockBet('UP')}
                            disabled={!currentRound?.isActive || recordStockBetMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Bet UP
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => handleStockBet('DOWN')}
                            disabled={!currentRound?.isActive || recordStockBetMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <TrendingDown className="w-5 h-5 mr-2" />
                            Bet DOWN
                        </Button>
                    </div>

                    {/* Current Round Info */}
                    {currentRound && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                                <span>Round ID: {currentRound.id}</span>
                                <Badge variant={currentRound.isActive ? "success" : "secondary"}>
                                    {currentRound.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {recordStockBetMutation.isPending && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span>Placing bet...</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bonus Progress for Stock Trading */}
            {showBonusProgress && stockBonuses.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-yellow-800 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Stock Trading Bonus Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {stockBonuses.map((assignment) => {
                            const progress = getBonusProgressBar(assignment);
                            const stockProgress = assignment.providerProgress?.[ProviderType.STOCK.toString()] || 0;
                            
                            return (
                                <div key={assignment.id} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-yellow-800">
                                                {assignment.bonusCampaign.bonusName}
                                            </h4>
                                            <p className="text-sm text-yellow-600">
                                                Bonus Value: ${assignment.potBalance}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{progress.toFixed(1)}%</p>
                                            <p className="text-xs text-yellow-600">Complete</p>
                                        </div>
                                    </div>
                                    
                                    <Progress 
                                        value={progress} 
                                        className="h-2 bg-yellow-100"
                                    />
                                    
                                    <div className="flex justify-between text-xs text-yellow-600">
                                        <span>Stock bets: ${stockProgress.toFixed(2)}</span>
                                        <span>${assignment.remainingWager.toFixed(2)} remaining</span>
                                    </div>
                                    
                                    {progress >= 100 && (
                                        <div className="flex items-center gap-2 p-2 bg-green-100 rounded-md">
                                            <Zap className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-green-700 font-medium">
                                                Bonus completed! Claim ${assignment.potBalance} now.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        
                        <div className="pt-2 border-t border-yellow-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-yellow-700">Total Active Stock Bonuses:</span>
                                <span className="font-semibold text-yellow-800">
                                    ${stockBonuses.reduce((sum, b) => sum + b.potBalance, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Eligibility Notice */}
            {!hasActiveStockBonuses && (wagerProgress?.data?.assignments?.length || 0) > 0 && (
                <Card className="border-gray-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">
                                You have active bonuses, but none are eligible for stock trading. 
                                Stock bets will not contribute to current bonus progress.
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default StockBettingIntegration;
