"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBonusCampaignRequest } from '@/lib/axios/enhanced-bonus-API';
import { useCreateBonusCampaign } from '@/react-query/enhanced-bonus-queries';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import BonusCampaignForm, { BonusCampaignFormValues } from './bonus-campaingn-form';

const CreateBonusCampaignForm: React.FC = () => {
    const router = useRouter();
    const createBonusMutation = useCreateBonusCampaign();

    const handleSubmit = async (formData: BonusCampaignFormValues) => {
        try {
            // Transform form data to match API request structure
            const apiData: CreateBonusCampaignRequest = {
                bonusName: formData.bonusName,
                description: formData.description,
                bonusType: formData.bonusType,
                triggerEvent: formData.triggerEvent,
                bonusValue: formData.bonusValue,
                wagerRequirementType: formData.wagerRequirementType,
                wagerRequirementValue: formData.wagerRequirementValue,
                applicablePaymentMethods: formData.applicablePaymentMethods || [],
                applicablePaymentCategories: formData.applicablePaymentCategories || [],
                applicableProviders: formData.applicableProviders|| [],
                directMainCredit: formData.directMainCredit,
                currentUsageCount: formData.currentUsageCount,
                isActive: formData.isActive,
                startDate: formData.startDate?.toISOString(),
                endDate: formData.endDate?.toISOString(),
                minDeposit: formData.minDepositAmount || undefined,
                maxBonusAmount: formData.maxBonusAmount || undefined,
                validityDays: formData.maxUsageCount ? undefined : 365, // Default validity if no usage limit
            };

            await createBonusMutation.mutateAsync(apiData);
            toast.success('Bonus campaign created successfully!');
            router.push('/dashboard/bonus/campaigns');
        } catch (error: any) {
            console.error('Failed to create bonus campaign:', error);
            toast.error(error?.response?.data?.message || 'Failed to create bonus campaign');
        }
    };

    const defaultValues: Partial<BonusCampaignFormValues> = {
        bonusType: 'PERCENTAGE',
        triggerEvent: 'FIRST_DEPOSIT',
        wagerRequirementType: 'TURNOVER_MULTIPLIER',
        bonusValue: 0,
        wagerRequirementValue: 1,
        currentUsageCount: 0,
        directMainCredit: false,
        isActive: true,
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Bonus Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                    <BonusCampaignForm
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        isLoading={createBonusMutation.isPending}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateBonusCampaignForm;