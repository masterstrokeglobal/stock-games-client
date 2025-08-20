"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BonusAnalyticsDashboard from '@/components/admin/bonus/bonus-analytics-dashboard';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AnalyticsPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/bonus">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Overview
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Bonus Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Comprehensive analytics and insights for your bonus management system
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/bonus/campaigns">
                        <Button variant="outline">
                            Manage Campaigns
                        </Button>
                    </Link>
                    <Link href="/dashboard/bonus/create-campaign">
                        <Button>
                            Create Campaign
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li>
                        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-400">/</span>
                    </li>
                    <li>
                        <Link href="/dashboard/bonus" className="text-gray-500 hover:text-gray-700">
                            Bonus Management
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-400">/</span>
                    </li>
                    <li className="text-gray-900">Analytics</li>
                </ol>
            </nav>

            {/* Main Content */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-500" />
                            Bonus System Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <BonusAnalyticsDashboard />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsPage;
