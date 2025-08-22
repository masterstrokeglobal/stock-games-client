"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { useEnhancedUserBonusStatus, useGetUserBonusSummary } from '@/react-query/enhanced-bonus-queries';
import { Gift, Target, TrendingUp, Trophy, Wallet } from 'lucide-react';
import React from 'react';

interface BonusSummaryProps {
    className?: string;
    showHeader?: boolean;
}

export interface BonusAssignmentData {
    id: number;
    initialBonusAmount: number;
    potBalance: number;
    requiredWager: number;
    completedWager: number;
    remainingWager: number;
    status: string;
    wagerProgress: string;
    wagerProgressNumeric: number;
    isExpired: boolean;
    daysUntilExpiry: number | null;
    statusDisplay: string;
    bonusName: string;
    triggerEvent: string;
    createdAt: string;
}

const BonusSummaryComponent: React.FC<BonusSummaryProps> = ({ 
    className, 
    showHeader = true 
}) => {
    const { userDetails } = useAuthStore();
    
    const { data: bonusSummary, isLoading } = useGetUserBonusSummary(
        userDetails?.id?.toString() || '',
        !!userDetails?.id
    );
    const { data: enhancedStatus } = useEnhancedUserBonusStatus();

    if (isLoading) {
        return (
            <div className={cn("animate-pulse space-y-4", className)}>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
            </div>
        );
    }

    // New API shape example received from user:
    // {
    //   user: { id, username },
    //   wallet: { mainBalance, bonusBalance },
    //   activeAssignments: [...],
    //   completedAssignments: [...],
    //   aggregates: { active: { totalInitial, totalLocked, totalRequiredWager, totalCompletedWager, totalRemainingWager }, completed: {...} }
    // }

    // Hook returns the summary object directly (not wrapped in { data: ... })
    const summaryObj = bonusSummary;
    const activeBonuses: any[] = summaryObj?.activeAssignments || [];
    const completedBonuses: any[] = summaryObj?.completedAssignments || [];
    const aggregates = summaryObj?.aggregates;

    const totalPotBalance = aggregates?.active?.totalLocked ?? 0; // locked == pot balance aggregate
    const totalRequiredWager = aggregates?.active?.totalRequiredWager ?? 0;
    const totalCompletedWager = aggregates?.active?.totalCompletedWager ?? 0;
    const totalRemainingWager = aggregates?.active?.totalRemainingWager ?? 0;
    const overallProgress = totalRequiredWager > 0 ? (totalCompletedWager / totalRequiredWager) * 100 : 0;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-blue-100 text-blue-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTriggerEventDisplay = (triggerEvent: string) => {
        switch (triggerEvent) {
            case 'FIRST_DEPOSIT': return '🎯 First Deposit';
            case 'EVERY_DEPOSIT': return '🔄 Every Deposit';
            case 'WEEKLY_BONUS': return '📅 Weekly Bonus';
            default: return triggerEvent;
        }
    };

    const showEmpty = activeBonuses.length === 0 && completedBonuses.length === 0;

    return (
        <div className={cn("space-y-6", className)}>
            {showHeader && (
                <div className="flex items-center gap-2 mb-6">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-platform-text">📊 Your Bonus Status Summary</h2>
                </div>
            )}

            {/* Empty State */}
            {showEmpty && (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <Gift className="w-14 h-14 text-gray-400 mb-4" />
                        <p className="text-gray-500 text-center mb-2">No bonuses yet. Make a deposit or play eligible games to unlock bonuses.</p>
                        <p className="text-xs text-gray-400">Check back after your first qualifying action.</p>
                    </CardContent>
                </Card>
            )}

            {/* Wallet Overview */}
            <Card className="bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] border-2 dark:border-platform-border border-primary-game text-platform-text">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-platform-text">
                        <Wallet className="w-5 h-5" />
                        💰 Wallet Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-platform-text/70">Bonus Balance</p>
                            <p className="text-2xl font-bold text-green-400">${summaryObj?.wallet?.bonusBalance ?? 0}</p>
                            <p className="text-xs text-platform-text/60">available now</p>
                        </div>
                        {activeBonuses.length > 0 ? (
                            <div className="text-center">
                                <p className="text-sm text-platform-text/70">Total Potential Release</p>
                                <p className="text-2xl font-bold text-purple-400">${totalPotBalance}</p>
                                <p className="text-xs text-platform-text/60">unlock by wagering</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-platform-text/70">Total Released (All-Time)</p>
                                <p className="text-2xl font-bold text-purple-400">${aggregates?.completed?.totalInitial ?? 0}</p>
                                <p className="text-xs text-platform-text/60">from completed bonuses</p>
                            </div>
                        )}
                        {enhancedStatus?.directCreditBonusAmount > 0 && (
                            <div className="col-span-2 text-center">
                                <p className="text-sm text-platform-text/70">Recent Direct Credits</p>
                                <p className="text-xl font-semibold text-green-300">+${enhancedStatus.directCreditBonusAmount}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Active Bonuses (if any) */}
            {activeBonuses.length > 0 && (
                <Card className="bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] border-2 dark:border-platform-border border-primary-game text-platform-text">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-platform-text">
                            <Gift className="w-5 h-5" />
                            🎁 Active Bonuses ({activeBonuses.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {activeBonuses.map((bonus: any) => {
                            const progressNumeric = bonus.requiredWager > 0 ? ((bonus.requiredWager - bonus.remainingWager) / bonus.requiredWager) * 100 : 0;
                            return (
                                <div key={bonus.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-platform-border">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-platform-text">Assignment #{bonus.id}</span>
                                            <span className="text-platform-text/60">-</span>
                                            <span className="text-sm text-platform-text">{bonus.name}</span>
                                            <Badge variant="secondary" className="text-xs bg-[#EEC53C] text-black">
                                                ${bonus.potBalance}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-platform-text/70">
                                            {bonus.triggerEvent && <span>{getTriggerEventDisplay(bonus.triggerEvent)}</span>}
                                            <span>•</span>
                                            <span>{progressNumeric.toFixed(1)}% Complete</span>
                                        </div>
                                        
                                        {/* Payment Categories & Direct Credit */}
                                        {bonus.applicablePaymentCategories && bonus.applicablePaymentCategories.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {bonus.applicablePaymentCategories.map((category: string) => {
                                                    const icon = category === 'CRYPTOCURRENCY' ? '🪙' : 
                                                               category === 'BANK_TRANSFER' ? '🏦' : 
                                                               category === 'INTERNAL_TRANSFER' ? '🔄' : '💳';
                                                    return (
                                                        <span key={category} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                            {icon} {category.replace('_', ' ')}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                        
                                        {bonus.directMainCredit && (
                                            <div className="mt-2">
                                                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                                    ✅ Direct to Main Balance
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <Badge className={cn("text-xs", getStatusColor(bonus.status || 'active'))}>
                                            {(bonus.status || 'active').toString()}
                                        </Badge>
                                        {progressNumeric > 0 && (
                                            <div className="w-20 mt-1">
                                                <Progress value={progressNumeric} className="h-1 bg-black/30" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Completed Bonuses (if any) */}
            {completedBonuses.length > 0 && (
                <Card className="bg-gradient-to-b dark:from-[#121456] dark:to-[#0c0f3f] from-[#5a9de0] to-[#3c5f99] border-2 dark:border-platform-border border-primary-game text-platform-text">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-platform-text">
                            <Gift className="w-5 h-5" />
                            ✅ Completed Bonuses ({completedBonuses.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {completedBonuses.map((bonus: any) => {
                            const releasedDate = bonus.releasedAt ? new Date(bonus.releasedAt).toLocaleDateString() : '';
                            return (
                                <div key={bonus.id} className="flex justify-between items-center gap-3 text-sm bg-black/20 rounded-md px-3 py-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate font-medium">{bonus.name}</p>
                                        {releasedDate && <p className="text-[10px] text-platform-text/50">Released {releasedDate}</p>}
                                    </div>
                                    <span className="text-green-400 font-semibold whitespace-nowrap">+${bonus.initialBonusAmount}</span>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}

            {/* Wagering Requirements (only if there are active bonuses) */}
            {activeBonuses.length > 0 && (
                <Card className="bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] border-2 dark:border-platform-border border-primary-game text-platform-text">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-platform-text">
                            <Target className="w-5 h-5" />
                            🎯 Wagering Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-orange-400">${totalRequiredWager}</p>
                                <p className="text-sm text-platform-text/70">Total Required</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-400">${totalCompletedWager}</p>
                                <p className="text-sm text-platform-text/70">Completed ({overallProgress.toFixed(1)}%)</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-400">${totalRemainingWager}</p>
                                <p className="text-sm text-platform-text/70">Remaining</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-platform-text">
                                <span>Overall Progress</span>
                                <span className="font-medium">{overallProgress.toFixed(1)}%</span>
                            </div>
                            <Progress value={overallProgress} className="h-3 bg-black/30" />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* How to Complete */}
            <Card className="bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] border-2 dark:border-platform-border border-primary-game text-platform-text">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-platform-text">
                        <TrendingUp className="w-5 h-5" />
                        🎮 How to Complete Your Bonuses
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#EEC53C] text-black rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <p className="font-medium text-platform-text">Playing Games</p>
                                <p className="text-platform-text/70">Place bets on Stock provider games or QTech casino games</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#EEC53C] text-black rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <p className="font-medium text-platform-text">Meeting Wager Requirements</p>
                                <p className="text-platform-text/70">Each bonus has specific wagering amounts that must be completed</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-[#EEC53C] text-black rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <p className="font-medium text-platform-text">Progress Tracking</p>
                                <p className="text-platform-text/70">The system tracks your progress automatically and updates in real-time</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <div>
                                <p className="font-medium text-platform-text">Bonus Release</p>
                                <p className="text-platform-text/70">Once completed, bonus moves from pot balance to your main balance</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BonusSummaryComponent;
