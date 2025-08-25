"use client";

import BonusCampaignsList from '@/components/admin/bonus/bonus-campaigns-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';
import React from 'react';

const ManageCampaignsPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Main Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <List className="w-5 h-5 text-green-500" />
                        All Bonus Campaigns
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <BonusCampaignsList />
                </CardContent>
            </Card>
        </div>
    );
};

export default ManageCampaignsPage;
