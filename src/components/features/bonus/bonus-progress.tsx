"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Coins, TrendingUp, Trophy, Target, Gift, Clock, Zap, Star, AlertCircle } from 'lucide-react';
import { useGetUserWagerProgress, useClaimCompletedBonus } from '@/react-query/enhanced-bonus-queries';
import { useAuthStore } from '@/context/auth-context';
import { useRealTimeWallet } from '@/hooks/useRealTimeWallet';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BonusProgressProps {
    className?: string;
    showHeader?: boolean;
    compact?: boolean;
}

const BonusProgressComponent: React.FC<BonusProgressProps> = ({ 
    className, 
    showHeader = true,
    compact = false
}) => {
    const { userDetails } = useAuthStore();
    
    // Real-time wallet integration
    const { 
        mainBalance, 
        bonusBalance, 
        onBet, 
        onTransaction 
    } = useRealTimeWallet({ 
        userId: userDetails?.id?.toString() || null,
        enablePolling: true,
        pollInterval: 8000 // Check every 8 seconds for bonus progress
    });
    
    const { data: wagerProgress, isLoading, error } = useGetUserWagerProgress(
        userDetails?.id?.toString() || '',
        !!userDetails?.id
    );

    const claimMutation = useClaimCompletedBonus();

    const handleClaimBonus = async (bonusId: string) => {
        try {
            await claimMutation.mutateAsync(bonusId);
            toast.success('Bonus claimed successfully! 🎉');
            
            // Trigger wallet update after claiming bonus
            if (userDetails?.id) {
                await onTransaction('BONUS_CLAIM');
            }
        } catch (error) {
            toast.error('Failed to claim bonus. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className={cn("animate-pulse space-y-4", className)}>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (error || !wagerProgress?.data) {
        return (
            <Card className={cn("w-full", className)}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <p className="text-gray-500 text-center">
                        Unable to load bonus progress. Please try again later.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const progressData = wagerProgress.data;
    const activeBonuses = progressData.assignments?.filter((a: any) => a.status === 'ACTIVE') || [];
    const completedBonuses = progressData.assignments?.filter((a: any) => a.status === 'COMPLETED') || [];
    const hasActiveBonuses = activeBonuses.length > 0;
    const hasCompletedBonuses = completedBonuses.length > 0;

    if (!hasActiveBonuses && !hasCompletedBonuses) {
        return (
            <Card className={cn("w-full", className)}>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <Gift className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center mb-2">
                        No active bonuses to track
                    </p>
                    <p className="text-xs text-gray-400 text-center">
                        Make a deposit or play eligible games to start earning bonuses!
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (compact) {
        return (
            <Card className={cn("w-full", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="w-5 h-5 text-blue-500" />
                        Bonus Progress
                        {hasActiveBonuses && (
                            <Badge variant="secondary" className="text-xs">
                                {activeBonuses.length} Active
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {activeBonuses.slice(0, 2).map((bonus: any) => {
                        const completedWager = bonus.completedWager || (bonus.requiredWager - bonus.remainingWager) || 0;
                        const progress = bonus.requiredWager > 0 
                            ? (completedWager / bonus.requiredWager) * 100 
                            : 0;
                        const isNearCompletion = progress >= 80;

                        return (
                            <div key={bonus.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm">{bonus.bonusCampaign?.bonusName || 'Bonus'}</span>
                                    <div className="flex items-center gap-1">
                                        {isNearCompletion && <Zap className="w-3 h-3 text-yellow-500" />}
                                        <span className="text-sm font-bold">{progress.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <Progress value={progress} className="h-2" />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>${completedWager} / ${bonus.requiredWager}</span>
                                    <span>${bonus.potBalance}</span>
                                </div>
                            </div>
                        );
                    })}
                    {activeBonuses.length > 2 && (
                        <p className="text-xs text-gray-500 text-center">
                            +{activeBonuses.length - 2} more bonuses
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className={cn("space-y-6", className)}>
            {showHeader && (
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-platform-text">🎯 Real-time Bonus Progress</h2>
                </div>
            )}

            {/* Completed Bonuses - Claim Section */}
            {hasCompletedBonuses && (
                <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800">
                            <Trophy className="w-5 h-5" />
                            🎉 Ready to Claim!
                            <Badge className="bg-green-200 text-green-800">
                                {completedBonuses.length} Completed
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {completedBonuses.map((bonus: any) => (
                            <div key={bonus.id} className="p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-green-800">{bonus.bonusCampaign?.bonusName || 'Bonus'}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className="text-xs bg-green-200 text-green-800">
                                                ${bonus.potBalance}
                                            </Badge>
                                            <Badge className="text-xs bg-yellow-200 text-yellow-800">
                                                <Star className="w-3 h-3 mr-1" />
                                                Completed!
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={() => handleClaimBonus(bonus.id)}
                                        disabled={claimMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {claimMutation.isPending ? 'Claiming...' : 'Claim Now'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Overall Progress Summary */}
            {hasActiveBonuses && (
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                            <Target className="w-5 h-5" />
                            Overall Progress Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-blue-600">Active Bonuses</p>
                                <p className="text-2xl font-bold text-blue-800">{activeBonuses.length}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600">Total Wagered Today</p>
                                <p className="text-2xl font-bold text-blue-800">
                                    ${progressData.totalWageredToday || 0}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600">Total Active Bonus</p>
                                <p className="text-2xl font-bold text-blue-800">
                                    ${progressData.totalActiveBonus || 0}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-blue-600">Overall Progress</p>
                                <p className="text-2xl font-bold text-blue-800">
                                    {activeBonuses.length > 0 
                                        ? ((activeBonuses.reduce((acc: number, bonus: any) => acc + (bonus.completedWager || 0), 0) / 
                                           activeBonuses.reduce((acc: number, bonus: any) => acc + (bonus.requiredWager || 0), 0)) * 100).toFixed(1)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                        
                        {activeBonuses.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-blue-700">
                                    <span>Progress</span>
                                    <span>
                                        ${activeBonuses.reduce((acc: number, bonus: any) => acc + (bonus.completedWager || 0), 0)} / 
                                        ${activeBonuses.reduce((acc: number, bonus: any) => acc + (bonus.requiredWager || 0), 0)}
                                    </span>
                                </div>
                                <Progress 
                                    value={activeBonuses.length > 0 
                                        ? (activeBonuses.reduce((acc: number, bonus: any) => acc + (bonus.completedWager || 0), 0) / 
                                           activeBonuses.reduce((acc: number, bonus: any) => acc + (bonus.requiredWager || 0), 0)) * 100
                                        : 0} 
                                    className="h-3"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Individual Bonus Progress */}
            {hasActiveBonuses && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-purple-800">
                            <Coins className="w-5 h-5" />
                            Individual Bonus Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeBonuses.map((bonus: any) => {
                            const completedWager = bonus.completedWager || (bonus.requiredWager - bonus.remainingWager) || 0;
                            const progress = bonus.requiredWager > 0 
                                ? (completedWager / bonus.requiredWager) * 100 
                                : 0;
                            
                            const isNearCompletion = progress >= 80;
                            const isAlmostDone = progress >= 95;
                            const timeRemaining = bonus.expiresAt 
                                ? Math.max(0, Math.ceil((new Date(bonus.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                                : null;

                            return (
                                <div key={bonus.id} className={cn(
                                    "p-4 bg-white rounded-lg border shadow-sm transition-all",
                                    isAlmostDone ? "border-yellow-300 bg-yellow-50" : "border-purple-200",
                                    isNearCompletion && "ring-2 ring-yellow-300"
                                )}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-purple-800">{bonus.bonusCampaign?.bonusName || 'Bonus'}</h4>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <Badge 
                                                    variant="secondary" 
                                                    className="text-xs bg-purple-200 text-purple-800"
                                                >
                                                    ${bonus.potBalance}
                                                </Badge>
                                                {isAlmostDone && (
                                                    <Badge className="text-xs bg-yellow-200 text-yellow-800 animate-pulse">
                                                        <Zap className="w-3 h-3 mr-1" />
                                                        Almost Done!
                                                    </Badge>
                                                )}
                                                {isNearCompletion && !isAlmostDone && (
                                                    <Badge className="text-xs bg-orange-200 text-orange-800">
                                                        🔥 Nearly Complete!
                                                    </Badge>
                                                )}
                                                {bonus.bonusCampaign?.applicableProviders && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {bonus.bonusCampaign.applicableProviders.includes(1) ? 'Stock Games' : 'QTech Games'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="text-right">
                                            <div className={cn(
                                                "text-lg font-bold",
                                                isAlmostDone ? "text-yellow-700" : "text-purple-700"
                                            )}>
                                                {progress.toFixed(1)}%
                                            </div>
                                            {timeRemaining !== null && (
                                                <div className={cn(
                                                    "flex items-center gap-1 text-xs",
                                                    timeRemaining <= 1 ? "text-red-600" : "text-gray-600"
                                                )}>
                                                    <Clock className="w-3 h-3" />
                                                    {timeRemaining === 0 ? 'Expires today!' : `${timeRemaining} days left`}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-purple-700">
                                            <span>Wager Progress</span>
                                            <span>${completedWager} / ${bonus.requiredWager}</span>
                                        </div>
                                        <Progress 
                                            value={progress} 
                                            className={cn(
                                                "h-3 transition-all",
                                                isAlmostDone ? "bg-yellow-200" : 
                                                isNearCompletion ? "bg-orange-200" : "bg-purple-100"
                                            )}
                                        />
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Remaining: ${bonus.remainingWager}</span>
                                            <span>
                                                {bonus.bonusCampaign?.triggerEvent && 
                                                    bonus.bonusCampaign.triggerEvent.replace(/_/g, ' ').toLowerCase()
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Recent Activity Indicator */}
                                    {bonus.lastActivity && (
                                        <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                <span className="text-blue-700">
                                                    Last activity: {new Date(bonus.lastActivity).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Provider Specific Tips */}
                                    {bonus.bonusCampaign?.applicableProviders && (
                                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                                            <p className="text-gray-700">
                                                💡 Play {bonus.bonusCampaign.applicableProviders.includes(1) ? 'Stock Games' : 'QTech Games'} 
                                                to make progress on this bonus
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Tips for Faster Progress */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                        <Target className="w-5 h-5" />
                        💡 Tips for Faster Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                                <div>
                                    <p className="font-medium text-amber-800">Play Eligible Games</p>
                                    <p className="text-amber-700">All bets on Stock and QTech games count toward your bonus progress</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                                <div>
                                    <p className="font-medium text-amber-800">Higher Bets = Faster Progress</p>
                                    <p className="text-amber-700">Larger bets will help you reach requirements faster</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                                <div>
                                    <p className="font-medium text-amber-800">Track Expiry Dates</p>
                                    <p className="text-amber-700">Complete bonuses before they expire to maximize value</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                                <div>
                                    <p className="font-medium text-amber-800">Real-time Updates</p>
                                    <p className="text-amber-700">Your progress updates automatically as you play</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BonusProgressComponent;
