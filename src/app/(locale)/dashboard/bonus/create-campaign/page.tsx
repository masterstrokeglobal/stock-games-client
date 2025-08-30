"use client";

import CreateBonusCampaign from '@/components/admin/bonus/create-bonus-campaign';
import React from 'react';

const CreateCampaignPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <CreateBonusCampaign />
        </div>
    );
};

export default CreateCampaignPage;
