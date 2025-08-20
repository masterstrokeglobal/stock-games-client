"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    BarChart3, 
    List, 
    Users, 
    TrendingUp, 
    Gift, 
    Target,
    ArrowRight,
    Trophy,
    Zap,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { useGetAllBonusCampaigns } from '@/react-query/enhanced-bonus-queries';

const EnhancedBonusDashboard = () => {
    const { data: bonusCampaigns, isLoading } = useGetAllBonusCampaigns({
        page: 1,
        limit: 5
    });

    // Mock analytics data - replace with real data when available
    const mockAnalytics = {
        totalCampaigns: bonusCampaigns?.data?.totalCount || 0,
        activeCampaigns: bonusCampaigns?.data?.campaigns?.filter((c: any) => c.status === 'active').length || 0,
        totalBonusesAwarded: 1234,
        totalBonusValue: 45678
    };

    const quickActions = [
        {
            title: 'Create New Campaign',
            description: 'Set up a new bonus campaign with advanced triggers',
            icon: Plus,
            href: '/dashboard/bonus/create-campaign',
            color: 'bg-blue-500 hover:bg-blue-600',
            textColor: 'text-white'
        },
        {
            title: 'Manage Campaigns',
            description: 'View, edit, and manage all bonus campaigns',
            icon: List,
            href: '/dashboard/bonus/campaigns',
            color: 'bg-green-500 hover:bg-green-600',
            textColor: 'text-white'
        },
        {
            title: 'Analytics Dashboard',
            description: 'View comprehensive bonus analytics and insights',
            icon: BarChart3,
            href: '/dashboard/bonus/analytics',
            color: 'bg-purple-500 hover:bg-purple-600',
            textColor: 'text-white'
        },
        {
            title: 'User Progress Tracking',
            description: 'Monitor individual user bonus progress',
            icon: Users,
            href: '/dashboard/bonus/user-progress',
            color: 'bg-orange-500 hover:bg-orange-600',
            textColor: 'text-white'
        }
    ];

    const features = [
        {
            title: '8 Trigger Event Types',
            description: 'From deposit-based to custom events',
            icon: Zap,
            items: ['First Deposit', 'Every Deposit', 'Loss Based', 'Wager Based', 'Login Based', 'Game Specific', 'Time Limited', 'Custom Events']
        },
        {
            title: 'Dual Provider Support',
            description: 'Stock Games & QTech Games integration',
            icon: Target,
            items: ['Stock Market Games', 'QTech Casino Games', 'Provider-specific bonuses', 'Cross-provider tracking']
        },
        {
            title: 'Real-time Tracking',
            description: 'Live progress updates and notifications',
            icon: TrendingUp,
            items: ['Live progress bars', 'Completion alerts', 'Expiry notifications', 'Activity tracking']
        },
        {
            title: 'Advanced Analytics',
            description: 'Comprehensive reporting and insights',
            icon: BarChart3,
            items: ['Campaign performance', 'User engagement metrics', 'Provider analytics', 'ROI tracking']
        }
    ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">🎁 Bonus Management System</h1>
                    <p className="text-muted-foreground text-lg mt-2">
                        Comprehensive bonus campaign management with advanced analytics and real-time tracking
                    </p>
                </div>
                <Link href="/dashboard/bonus/create-campaign">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Campaign
                    </Button>
                </Link>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Total Campaigns</p>
                                <p className="text-3xl font-bold text-blue-900">{mockAnalytics.totalCampaigns}</p>
                            </div>
                            <Gift className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600">Active Campaigns</p>
                                <p className="text-3xl font-bold text-green-900">{mockAnalytics.activeCampaigns}</p>
                            </div>
                            <Zap className="w-8 h-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Bonuses Awarded</p>
                                <p className="text-3xl font-bold text-purple-900">{mockAnalytics.totalBonusesAwarded.toLocaleString()}</p>
                            </div>
                            <Trophy className="w-8 h-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-orange-600">Total Value</p>
                                <p className="text-3xl font-bold text-orange-900">${mockAnalytics.totalBonusValue.toLocaleString()}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-6 h-6 text-blue-500" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <Link key={index} href={action.href}>
                                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className={`p-3 rounded-full ${action.color} ${action.textColor} group-hover:scale-110 transition-transform`}>
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{action.title}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {action.description}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Features Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-6 h-6 text-purple-500" />
                        System Features & Capabilities
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="p-6 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white rounded-lg">
                                        <feature.icon className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {feature.items.map((item, itemIndex) => (
                                        <li key={itemIndex} className="flex items-center gap-2 text-sm">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Campaigns Preview */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <List className="w-6 h-6 text-green-500" />
                        Recent Campaigns
                    </CardTitle>
                    <Link href="/dashboard/bonus/campaigns">
                        <Button variant="outline">
                            View All Campaigns
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : bonusCampaigns?.data?.campaigns?.length > 0 ? (
                        <div className="space-y-4">
                            {bonusCampaigns.data.campaigns.slice(0, 5).map((campaign: any) => (
                                <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="font-medium">{campaign.bonusName}</h4>
                                        <p className="text-sm text-muted-foreground">{campaign.description}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{campaign.triggerEvent?.replace(/_/g, ' ')}</Badge>
                                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                                                {(campaign.status || 'inactive').charAt(0).toUpperCase() + (campaign.status || 'inactive').slice(1)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">{campaign.bonusValue}%</p>
                                        <p className="text-sm text-muted-foreground">
                                            Used: {campaign.currentUsageCount || 0}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No bonus campaigns created yet</p>
                            <Link href="/dashboard/bonus/create-campaign">
                                <Button className="mt-4">
                                    Create Your First Campaign
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* System Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-500" />
                        System Status
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">API Status</p>
                            <p className="text-sm text-green-600">Operational</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">Real-time Updates</p>
                            <p className="text-sm text-blue-600">Active</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
                            <p className="font-medium">Analytics</p>
                            <p className="text-sm text-purple-600">Processing</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default EnhancedBonusDashboard;
