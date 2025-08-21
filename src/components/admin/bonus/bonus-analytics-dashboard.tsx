"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, TrendingUp, Trophy, Target, Gift, Timer } from 'lucide-react';
import { useGetBonusAnalytics, usePaymentMethodAnalytics } from '@/react-query/enhanced-bonus-queries';
import CompanyContextBanner from './company-context-banner';

const BonusAnalyticsDashboard: React.FC = () => {
    const { data: analytics, isLoading } = useGetBonusAnalytics();
    const { data: paymentAnalytics } = usePaymentMethodAnalytics(30);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <CompanyContextBanner />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const stats = analytics?.data || {};

    return (
        <div className="space-y-6">
            <CompanyContextBanner />
            
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Gift className="h-12 w-12 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Trophy className="h-12 w-12 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <Coins className="h-12 w-12 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bonuses Issued</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBonusesIssued || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <TrendingUp className="h-12 w-12 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Bonus Value</p>
                                <p className="text-2xl font-bold text-gray-900">${stats.totalBonusValue || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bonus Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Bonus Status Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Active Bonuses</span>
                                <Badge className="bg-green-100 text-green-800">
                                    {stats.activeBonuses || 0}
                                </Badge>
                            </div>
                            <Progress value={((stats.activeBonuses || 0) / (stats.totalBonusesIssued || 1)) * 100} className="w-full" />
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Completed Bonuses</span>
                                <Badge className="bg-blue-100 text-blue-800">
                                    {stats.completedBonuses || 0}
                                </Badge>
                            </div>
                            <Progress value={((stats.completedBonuses || 0) / (stats.totalBonusesIssued || 1)) * 100} className="w-full" />
                            
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Expired Bonuses</span>
                                <Badge className="bg-red-100 text-red-800">
                                    {stats.expiredBonuses || 0}
                                </Badge>
                            </div>
                            <Progress value={((stats.expiredBonuses || 0) / (stats.totalBonusesIssued || 1)) * 100} className="w-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Provider Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Provider Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.providerPerformance?.map((provider: any, index: number) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">{provider.name}</span>
                                        <span className="text-sm text-gray-600">${provider.totalValue}</span>
                                    </div>
                                    <Progress value={provider.percentage} className="w-full" />
                                    <div className="text-xs text-gray-500">
                                        {provider.bonusCount} bonuses issued
                                    </div>
                                </div>
                            )) || (
                                <div className="text-center text-gray-500 py-4">
                                    No provider data available
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                {/* Payment Method Analytics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Coins className="w-5 h-5" />
                            Payment Category Performance (30d)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {paymentAnalytics?.data?.categoryBreakdown ? (
                            <div className="space-y-4">
                                {paymentAnalytics.data.categoryBreakdown.map((cat: any) => {
                                    const icon = cat.category === 'CRYPTOCURRENCY' ? '🪙' : 
                                               cat.category === 'BANK_TRANSFER' ? '🏦' : 
                                               cat.category === 'INTERNAL_TRANSFER' ? '🔄' : '💳';
                                    const label = cat.category === 'CRYPTOCURRENCY' ? 'Cryptocurrency' :
                                                cat.category === 'BANK_TRANSFER' ? 'Bank Transfer' :
                                                cat.category === 'INTERNAL_TRANSFER' ? 'Internal Transfer' : cat.category;
                                    
                                    return (
                                        <div key={cat.category} className="p-3 border rounded-lg">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">{icon} {label}</span>
                                                <span className="text-gray-600">{cat.bonusCount} bonuses</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                                                <div>Assignments: <span className="font-semibold">{cat.totalAssignments}</span></div>
                                                <div>Total Bonus: <span className="font-semibold">${cat.totalBonusAmount}</span></div>
                                                <div>Avg: <span className="font-semibold">${(cat.totalBonusAmount / cat.totalAssignments || 0).toFixed(0)}</span></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-4">No payment category data available</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Trigger Event Analytics */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Timer className="w-5 h-5" />
                        Trigger Event Performance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.triggerEventAnalytics?.map((trigger: any, index: number) => (
                            <div key={index} className="text-center p-4 border rounded-lg">
                                <h3 className="font-medium text-gray-900">{trigger.triggerEvent.replace(/_/g, ' ')}</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{trigger.count}</p>
                                <p className="text-sm text-gray-500">bonuses triggered</p>
                                <p className="text-sm font-medium text-green-600 mt-1">${trigger.totalValue}</p>
                            </div>
                        )) || (
                            <div className="col-span-full text-center text-gray-500 py-8">
                                No trigger event data available
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bonus Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recentActivity?.map((activity: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${
                                        activity.type === 'assigned' ? 'bg-green-500' :
                                        activity.type === 'completed' ? 'bg-blue-500' :
                                        activity.type === 'expired' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></div>
                                    <div>
                                        <p className="text-sm font-medium">{activity.bonusName}</p>
                                        <p className="text-xs text-gray-500">
                                            {activity.type === 'assigned' ? 'Assigned to' :
                                             activity.type === 'completed' ? 'Completed by' :
                                             activity.type === 'expired' ? 'Expired for' : 'Action by'} User #{activity.userId}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">${activity.amount}</p>
                                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                                </div>
                            </div>
                        )) || (
                            <div className="text-center text-gray-500 py-8">
                                No recent activity
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BonusAnalyticsDashboard;
