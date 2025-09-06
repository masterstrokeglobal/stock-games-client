"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CreateBonusCampaignRequest } from '@/lib/axios/enhanced-bonus-API';
import { handleBonusCreationError } from '@/lib/utils/bonus-error-handler';
import { ProviderType } from '@/models/enhanced-bonus';
import { useCreateBonusCampaign, useGetAvailableProviders } from '@/react-query/enhanced-bonus-queries';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const CreateBonusCampaign: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateBonusCampaignRequest>({
        bonusName: '',
        description: '',
        bonusType: '',
        triggerEvent: '',
        bonusValue: 0,
        wagerRequirementType: '',
        wagerRequirementValue: 0,
        applicablePaymentMethods: [],
        applicablePaymentCategories: [],
        directMainCredit: false,
        currentUsageCount: 0,
        isActive: true
    });

    const createBonusMutation = useCreateBonusCampaign();
    const { data: providers } = useGetAvailableProviders();

    const triggerEvents = [
        { value: 'FIRST_DEPOSIT', label: 'First Deposit' },
        { value: 'EVERY_DEPOSIT', label: 'Every Deposit' },
        // { value: 'LOSS_BASED', label: 'Loss Based' },
        // { value: 'WAGER_BASED', label: 'Wager Based' },
        // { value: 'LOGIN_BASED', label: 'Login Based' },
        // { value: 'GAME_SPECIFIC', label: 'Game Specific' },
        // { value: 'TIME_LIMITED', label: 'Time Limited' },
        // { value: 'CUSTOM_EVENT', label: 'Custom Event' }
    ];

    const bonusTypes = [
        { value: 'PERCENTAGE', label: 'Percentage' },
        { value: 'FIXED_AMOUNT', label: 'Fixed Amount' },
        // { value: 'FREE_SPINS', label: 'Free Spins' },
        // { value: 'CASHBACK', label: 'Cashback' }
    ];

    const wagerRequirementTypes = [
        { value: 'NONE', label: 'No Wager Requirement' },
        // { value: 'TURNOVER_MULTIPLIER', label: 'Turnover Multiplier' },
        { value: 'FIXED_AMOUNT', label: 'Fixed Amount' }
    ];

    // Simplified payment categories per updated documentation
    const paymentCategories = [
        { value: "CRYPTOCURRENCY", label: "🪙 Cryptocurrency (All crypto payments)" },
        { value: "BANK_TRANSFER", label: "🏦 Bank Transfer (UPI, RTGS, NEFT, cards)" },
        // { value: "INTERNAL_TRANSFER", label: "🔄 Internal Transfer (Agent/Admin)" }
    ];

    const handleProviderChange = (providerId: ProviderType, checked: boolean) => {
        const currentProviders = formData.applicableProviders || [];
        if (checked) {
            setFormData({
                ...formData,
                applicableProviders: [...currentProviders, providerId]
            });
        } else {
            setFormData({
                ...formData,
                applicableProviders: currentProviders.filter(p => p !== providerId)
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createBonusMutation.mutateAsync(formData);
            toast.success('Bonus campaign created successfully!');
            // Reset form
            setFormData({
                bonusName: '',
                description: '',
                bonusType: '',
                triggerEvent: '',
                bonusValue: 0,
                wagerRequirementType: '',
                wagerRequirementValue: 0,
                applicablePaymentMethods: [],
                applicablePaymentCategories: [],
                directMainCredit: false,
                currentUsageCount: 0,
                isActive: true
            });
        } catch (error: any) {
            console.error('Error creating bonus campaign:', error);
            handleBonusCreationError(error, router.push);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Create Bonus Campaign</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bonusName">Bonus Name *</Label>
                            <Input
                                id="bonusName"
                                value={formData.bonusName}
                                onChange={(e) => setFormData({...formData, bonusName: e.target.value})}
                                required
                                placeholder="Enter bonus name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="triggerEvent">Trigger Event *</Label>
                            <Select
                                value={formData.triggerEvent}
                                onValueChange={(value) => setFormData({...formData, triggerEvent: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select trigger event" />
                                </SelectTrigger>
                                <SelectContent>
                                    {triggerEvents.map((event) => (
                                        <SelectItem key={event.value} value={event.value}>
                                            {event.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Enter bonus description"
                            rows={3}
                        />
                    </div>

                    {/* Bonus Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bonusType">Bonus Type *</Label>
                            <Select
                                value={formData.bonusType}
                                onValueChange={(value) => setFormData({...formData, bonusType: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select bonus type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bonusTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bonusValue">Bonus Value *</Label>
                            <Input
                                id="bonusValue"
                                type="number"
                                value={formData.bonusValue}
                                onChange={(e) => setFormData({...formData, bonusValue: parseFloat(e.target.value)})}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor="maxBonusAmount">Max Bonus Amount</Label>
                            <Input
                                id="maxBonusAmount"
                                type="number"
                                value={formData.maxBonusAmount || ''}
                                onChange={(e) => setFormData({...formData, maxBonusAmount: parseFloat(e.target.value)})}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div> */}
                    </div>

                    {/* Wager Requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="wagerRequirementType">Wager Requirement Type *</Label>
                            <Select
                                value={formData.wagerRequirementType}
                                onValueChange={(value) => setFormData({...formData, wagerRequirementType: value})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select wager type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {wagerRequirementTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="wagerRequirementValue">Wager Requirement Value *</Label>
                            <Input
                                id="wagerRequirementValue"
                                type="number"
                                value={formData.wagerRequirementValue}
                                onChange={(e) => setFormData({...formData, wagerRequirementValue: parseFloat(e.target.value)})}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                disabled={formData.wagerRequirementType === 'NONE' || !!formData.directMainCredit}
                            />
                        </div>
                    </div>

                    {/* Advanced Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minDeposit">Min Deposit Amount</Label>
                            <Input
                                id="minDeposit"
                                type="number"
                                value={formData.minDeposit || ''}
                                onChange={(e) => setFormData({...formData, minDeposit: parseFloat(e.target.value)})}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label htmlFor="validityDays">Validity (Days)</Label>
                            <Input
                                id="validityDays"
                                type="number"
                                value={formData.validityDays || ''}
                                onChange={(e) => setFormData({...formData, validityDays: parseInt(e.target.value)})}
                                min="1"
                                placeholder="30"
                            />
                        </div> */}

                        {/* <div className="space-y-2">
                            <Label htmlFor="spendingRequirement">Spending Requirement</Label>
                            <Input
                                id="spendingRequirement"
                                type="number"
                                value={formData.spendingRequirement || ''}
                                onChange={(e) => setFormData({...formData, spendingRequirement: parseFloat(e.target.value)})}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div> */}
                    </div>

                    {/* Provider Selection */}
                    <div className="space-y-3">
                        <Label>Applicable Providers</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {providers?.data && Array.isArray(providers.data) ? providers.data.map((provider: any) => (
                                <div key={provider.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`provider-${provider.id}`}
                                        checked={formData.applicableProviders?.includes(provider.id) || false}
                                        onCheckedChange={(checked) => handleProviderChange(provider.id, checked as boolean)}
                                    />
                                    <Label htmlFor={`provider-${provider.id}`} className="text-sm font-normal">
                                        {provider.name} (Provider {provider.id})
                                    </Label>
                                </div>
                            )) : (
                                // Fallback to hardcoded providers if API is not available
                                [
                                    { id: 1, name: 'Stock Games' },
                                    { id: 2, name: 'QTech Games' },
                                    { id: 3, name: 'Gap' },
                                 
                                ].map((provider) => (
                                    <div key={provider.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`provider-${provider.id}`}
                                            checked={formData.applicableProviders?.includes(provider.id) || false}
                                            onCheckedChange={(checked) => handleProviderChange(provider.id, checked as boolean)}
                                        />
                                        <Label htmlFor={`provider-${provider.id}`} className="text-sm font-normal">
                                            {provider.name} (Provider {provider.id})
                                        </Label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Payment Categories */}
                    <div className="space-y-3">
                        <Label>Applicable Payment Categories (leave empty for all)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {paymentCategories.map((cat) => (
                                <div key={cat.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`pc-${cat.value}`}
                                        checked={formData.applicablePaymentCategories?.includes(cat.value) || false}
                                        onCheckedChange={(checked) => {
                                            const current = formData.applicablePaymentCategories || [];
                                            const updated = (checked as boolean)
                                                ? [...current, cat.value]
                                                : current.filter((c) => c !== cat.value);
                                            setFormData({ ...formData, applicablePaymentCategories: updated });
                                        }}
                                    />
                                    <Label htmlFor={`pc-${cat.value}`} className="text-sm font-normal">{cat.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Direct Main Credit Toggle */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="directMainCredit"
                            checked={!!formData.directMainCredit}
                            onCheckedChange={(checked) => setFormData({ ...formData, directMainCredit: checked as boolean, wagerRequirementType: (checked ? 'NONE' : formData.wagerRequirementType) })}
                        />
                        <Label htmlFor="directMainCredit" className="text-sm font-normal">
                            Direct Credit to Main Balance (No Wager Required)
                        </Label>
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({...formData, isActive: checked as boolean})}
                        />
                        <Label htmlFor="isActive" className="text-sm font-normal">
                            Set as Active
                        </Label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={createBonusMutation.isPending}
                            className="min-w-[120px]"
                        >
                            {createBonusMutation.isPending ? 'Creating...' : 'Create Campaign'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateBonusCampaign;
