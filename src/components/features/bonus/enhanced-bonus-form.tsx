"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Coins, Info, Target, DollarSign } from 'lucide-react';
import { BonusType, TriggerEvent, WagerRequirementType, ProviderType } from '@/models/enhanced-bonus';
import { useCreateBonusCampaign } from '@/react-query/enhanced-bonus-queries';
import { Alert, AlertDescription } from '@/components/ui/alert';

const bonusFormSchema = z.object({
    bonusName: z.string().min(1, 'Bonus name is required').max(100, 'Name too long'),
    description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    bonusType: z.nativeEnum(BonusType),
    triggerEvent: z.nativeEnum(TriggerEvent),
    bonusValue: z.number().min(0, 'Bonus value must be positive').max(1000, 'Maximum 1000%'),
    wagerRequirementType: z.nativeEnum(WagerRequirementType),
    wagerRequirementValue: z.number().min(1, 'Wager requirement must be at least 1'),
    spendingRequirement: z.number().optional(),
    applicableProviders: z.array(z.nativeEnum(ProviderType)).optional(),
    minDeposit: z.number().min(0).optional(),
    maxBonusAmount: z.number().min(0).optional(),
    validityDays: z.number().min(1, 'Must be at least 1 day').max(365, 'Maximum 365 days').optional(),
    currentUsageCount: z.number().default(0),
    isActive: z.boolean()
});

type BonusFormData = z.infer<typeof bonusFormSchema>;

interface EnhancedBonusFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const EnhancedBonusForm: React.FC<EnhancedBonusFormProps> = ({ onSuccess, onCancel }) => {
    const [selectedProviders, setSelectedProviders] = useState<ProviderType[]>([]);
    const [previewBonus, setPreviewBonus] = useState<{ deposit: number; bonus: number; wager: number } | null>(null);
    
    const createBonusMutation = useCreateBonusCampaign();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid, isValidating, isDirty }
    } = useForm<BonusFormData>({
        resolver: zodResolver(bonusFormSchema),
        mode: 'onChange',
        defaultValues: {
            bonusName: '',
            description: '',
            bonusType: BonusType.PERCENTAGE,
            triggerEvent: TriggerEvent.FIRST_DEPOSIT,
            wagerRequirementType: WagerRequirementType.TURNOVER_MULTIPLIER,
            bonusValue: 50,
            wagerRequirementValue: 5,
            validityDays: 30,
            currentUsageCount: 0,
            isActive: true,
            applicableProviders: []
        }
    });

    const watchedValues = watch();

    // Calculate bonus preview
    React.useEffect(() => {
        const deposit = 100; // Example deposit
        const bonusAmount = (deposit * watchedValues.bonusValue) / 100;
        const cappedBonus = watchedValues.maxBonusAmount ? 
            Math.min(bonusAmount, watchedValues.maxBonusAmount) : bonusAmount;
        
        let wagerRequired = 0;
        switch (watchedValues.wagerRequirementType) {
            case WagerRequirementType.TURNOVER_MULTIPLIER:
                wagerRequired = (deposit + cappedBonus) * watchedValues.wagerRequirementValue;
                break;
            case WagerRequirementType.FIXED_AMOUNT:
                wagerRequired = watchedValues.wagerRequirementValue;
                break;
            case WagerRequirementType.NO_REQUIREMENT:
                wagerRequired = 0;
                break;
        }

        setPreviewBonus({
            deposit,
            bonus: cappedBonus,
            wager: wagerRequired
        });
    }, [watchedValues.bonusValue, watchedValues.maxBonusAmount, watchedValues.wagerRequirementType, watchedValues.wagerRequirementValue]);

    const handleProviderToggle = (providerId: ProviderType, checked: boolean) => {
        let newProviders: ProviderType[];
        if (checked) {
            newProviders = [...selectedProviders, providerId];
        } else {
            newProviders = selectedProviders.filter(id => id !== providerId);
        }
        setSelectedProviders(newProviders);
        setValue('applicableProviders', newProviders.length > 0 ? newProviders : undefined);
    };

    const onSubmit = async (data: BonusFormData) => {
        console.log('Form data being submitted:', data);
        console.log('Selected providers:', selectedProviders);
        
        try {
            const submitData = {
                bonusName: data.bonusName,
                description: data.description,
                bonusType: String(data.bonusType),
                triggerEvent: String(data.triggerEvent),
                bonusValue: data.bonusValue,
                wagerRequirementType: String(data.wagerRequirementType),
                wagerRequirementValue: data.wagerRequirementValue,
                spendingRequirement: data.spendingRequirement,
                minDeposit: data.minDeposit,
                maxBonusAmount: data.maxBonusAmount,
                validityDays: data.validityDays,
                currentUsageCount: Number(data.currentUsageCount || 0),
                isActive: data.isActive,
                applicableProviders: selectedProviders.length > 0 ? selectedProviders : undefined,
                companyId: Number(process.env.NEXT_PUBLIC_COMPANY_ID) || 4
            };
            
            console.log('Final submit data:', submitData);
            console.log('Data types:', {
                bonusType: typeof submitData.bonusType,
                triggerEvent: typeof submitData.triggerEvent,
                wagerRequirementType: typeof submitData.wagerRequirementType,
                currentUsageCount: typeof submitData.currentUsageCount
            });
            
            const result = await createBonusMutation.mutateAsync(submitData);
            console.log('Bonus creation successful:', result);
            
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create bonus:', error);
            console.error('Error details:', {
                message: (error as any)?.message,
                response: (error as any)?.response?.data,
                status: (error as any)?.response?.status
            });
        }
    };

    const getProviderIcon = (providerId: ProviderType) => {
        switch (providerId) {
            case ProviderType.STOCK:
                return <TrendingUp className="w-4 h-4" />;
            case ProviderType.QTECH:
                return <Coins className="w-4 h-4" />;
            default:
                return null;
        }
    };

    const getProviderName = (providerId: ProviderType) => {
        switch (providerId) {
            case ProviderType.STOCK:
                return 'Stock Trading';
            case ProviderType.QTECH:
                return 'Casino Games';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Create Bonus Campaign
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bonusName">Bonus Name</Label>
                                <Input
                                    id="bonusName"
                                    {...register('bonusName')}
                                    placeholder="e.g., Welcome Stock Bonus"
                                />
                                {errors.bonusName && (
                                    <p className="text-sm text-red-500">{errors.bonusName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bonusType">Bonus Type</Label>
                                <Select 
                                    value={watchedValues.bonusType} 
                                    onValueChange={(value) => setValue('bonusType', value as BonusType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={BonusType.PERCENTAGE}>Percentage Bonus</SelectItem>
                                        <SelectItem value={BonusType.FIXED_AMOUNT}>Fixed Amount</SelectItem>
                                        <SelectItem value={BonusType.FREE_SPINS}>Free Spins</SelectItem>
                                        <SelectItem value={BonusType.CASHBACK}>Cashback</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Describe the bonus campaign..."
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <Separator />

                        {/* Bonus Configuration */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Bonus Configuration</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="triggerEvent">Trigger Event</Label>
                                    <Select 
                                        value={watchedValues.triggerEvent} 
                                        onValueChange={(value) => setValue('triggerEvent', value as TriggerEvent)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={TriggerEvent.FIRST_DEPOSIT}>First Deposit</SelectItem>
                                            <SelectItem value={TriggerEvent.DEPOSIT_MATCH}>Deposit Match</SelectItem>
                                            <SelectItem value={TriggerEvent.WELCOME_BONUS}>Welcome Bonus</SelectItem>
                                            <SelectItem value={TriggerEvent.LOYALTY_REWARD}>Loyalty Reward</SelectItem>
                                            <SelectItem value={TriggerEvent.CASHBACK}>Cashback</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bonusValue">Bonus Percentage (%)</Label>
                                    <Input
                                        id="bonusValue"
                                        type="number"
                                        {...register('bonusValue', { valueAsNumber: true })}
                                        placeholder="50"
                                    />
                                    {errors.bonusValue && (
                                        <p className="text-sm text-red-500">{errors.bonusValue.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="validityDays">Validity (Days)</Label>
                                    <Input
                                        id="validityDays"
                                        type="number"
                                        {...register('validityDays', { valueAsNumber: true })}
                                        placeholder="30"
                                    />
                                    {errors.validityDays && (
                                        <p className="text-sm text-red-500">{errors.validityDays.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minDeposit">Minimum Deposit ($)</Label>
                                    <Input
                                        id="minDeposit"
                                        type="number"
                                        {...register('minDeposit', { valueAsNumber: true })}
                                        placeholder="100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxBonusAmount">Maximum Bonus ($)</Label>
                                    <Input
                                        id="maxBonusAmount"
                                        type="number"
                                        {...register('maxBonusAmount', { valueAsNumber: true })}
                                        placeholder="500"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Wager Requirements */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Wager Requirements</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="wagerRequirementType">Requirement Type</Label>
                                    <Select 
                                        value={watchedValues.wagerRequirementType} 
                                        onValueChange={(value) => setValue('wagerRequirementType', value as WagerRequirementType)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={WagerRequirementType.TURNOVER_MULTIPLIER}>
                                                Turnover Multiplier
                                            </SelectItem>
                                            <SelectItem value={WagerRequirementType.FIXED_AMOUNT}>
                                                Fixed Amount
                                            </SelectItem>
                                            <SelectItem value={WagerRequirementType.NO_REQUIREMENT}>
                                                No Requirement
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="wagerRequirementValue">
                                        {watchedValues.wagerRequirementType === WagerRequirementType.FIXED_AMOUNT 
                                            ? 'Required Amount ($)' 
                                            : 'Multiplier (x)'
                                        }
                                    </Label>
                                    <Input
                                        id="wagerRequirementValue"
                                        type="number"
                                        {...register('wagerRequirementValue', { valueAsNumber: true })}
                                        placeholder={watchedValues.wagerRequirementType === WagerRequirementType.FIXED_AMOUNT ? '1000' : '5'}
                                    />
                                    {errors.wagerRequirementValue && (
                                        <p className="text-sm text-red-500">{errors.wagerRequirementValue.message}</p>
                                    )}
                                </div>
                            </div>

                            {watchedValues.wagerRequirementType !== WagerRequirementType.FIXED_AMOUNT && (
                                <div className="space-y-2">
                                    <Label htmlFor="spendingRequirement">Spending Requirement ($)</Label>
                                    <Input
                                        id="spendingRequirement"
                                        type="number"
                                        {...register('spendingRequirement', { valueAsNumber: true })}
                                        placeholder="1000"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Optional: Minimum amount user must spend to complete bonus
                                    </p>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Provider Restrictions */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Game Provider Restrictions</h3>
                            <p className="text-sm text-gray-600">
                                Select which game providers count towards this bonus. Leave empty for all providers.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.values(ProviderType).filter(p => typeof p === 'number').map((providerId) => (
                                    <div key={providerId} className="flex items-center space-x-3 p-3 border rounded-lg">
                                        <Checkbox
                                            id={`provider-${providerId}`}
                                            checked={selectedProviders.includes(providerId as ProviderType)}
                                            onCheckedChange={(checked) => 
                                                handleProviderToggle(providerId as ProviderType, checked as boolean)
                                            }
                                        />
                                        <div className="flex items-center gap-2">
                                            {getProviderIcon(providerId as ProviderType)}
                                            <Label htmlFor={`provider-${providerId}`} className="font-medium">
                                                {getProviderName(providerId as ProviderType)}
                                            </Label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedProviders.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm text-gray-600">Selected providers:</span>
                                    {selectedProviders.map((providerId) => (
                                        <Badge key={providerId} variant="secondary" className="flex items-center gap-1">
                                            {getProviderIcon(providerId)}
                                            {getProviderName(providerId)}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Bonus Preview */}
                        {previewBonus && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Bonus Preview</h3>
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <p><strong>Example scenario:</strong> User deposits ${previewBonus.deposit}</p>
                                            <p>• Bonus received: <span className="font-semibold text-green-600">${previewBonus.bonus.toFixed(2)}</span></p>
                                            <p>• Wager required: <span className="font-semibold text-blue-600">${previewBonus.wager.toFixed(2)}</span></p>
                                            <p>• Total play value: <span className="font-semibold">${(previewBonus.deposit + previewBonus.bonus).toFixed(2)}</span></p>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <Separator />

                        {/* Activation */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="isActive">Activate Bonus</Label>
                                <p className="text-sm text-gray-500">
                                    Enable this bonus campaign immediately after creation
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={watchedValues.isActive}
                                onCheckedChange={(checked) => setValue('isActive', checked)}
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="space-y-4">
                            {/* Error Display */}
                            {createBonusMutation.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>
                                        <div className="space-y-2">
                                            <p><strong>Error creating bonus:</strong></p>
                                            <p>Status: {(createBonusMutation.error as any)?.response?.status || 'Unknown'}</p>
                                            <p>Message: {(createBonusMutation.error as any)?.response?.data?.message || 
                                                        (createBonusMutation.error as any)?.message || 
                                                        'Unknown error'}</p>
                                            <p>URL: {(createBonusMutation.error as any)?.config?.url || 'Unknown'}</p>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            {/* Success Display */}
                            {createBonusMutation.isSuccess && (
                                <Alert>
                                    <AlertDescription>
                                        Bonus campaign created successfully! ✅
                                    </AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="flex justify-end gap-4 pt-4">
                                {/* Test API Button */}
                                <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={async () => {
                                        try {
                                            console.log('Testing API connection...');
                                            const testData = {
                                                bonusName: 'Test Bonus',
                                                description: 'Test Description',
                                                bonusType: 'PERCENTAGE',
                                                triggerEvent: 'FIRST_DEPOSIT',
                                                bonusValue: 50,
                                                wagerRequirementType: 'TURNOVER_MULTIPLIER',
                                                wagerRequirementValue: 5,
                                                currentUsageCount: 0,
                                                isActive: true,
                                                companyId: Number(process.env.NEXT_PUBLIC_COMPANY_ID) || 4
                                            };
                                            console.log('Test data:', testData);
                                            console.log('Company ID from env:', process.env.NEXT_PUBLIC_COMPANY_ID);
                                            console.log('Test data types:', {
                                                bonusType: typeof testData.bonusType,
                                                triggerEvent: typeof testData.triggerEvent,
                                                wagerRequirementType: typeof testData.wagerRequirementType,
                                                currentUsageCount: typeof testData.currentUsageCount,
                                                companyId: typeof testData.companyId
                                            });
                                            await createBonusMutation.mutateAsync(testData);
                                        } catch (error) {
                                            console.error('Test failed:', error);
                                        }
                                    }}
                                >
                                    Test API
                                </Button>
                                
                                {onCancel && (
                                    <Button type="button" variant="outline" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                )}
                                <Button 
                                    type="submit" 
                                    disabled={createBonusMutation.isPending}
                                    className="min-w-32"
                                >
                                {createBonusMutation.isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </div>
                                ) : (
                                    <>
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Create Bonus
                                    </>
                                )}
                            </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EnhancedBonusForm;
