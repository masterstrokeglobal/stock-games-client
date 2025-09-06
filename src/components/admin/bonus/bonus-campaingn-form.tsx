import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import FormSwitch from '@/components/ui/form/form-switch';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGetAvailableProviders } from "@/react-query/enhanced-bonus-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the schema for bonus campaign input
export const bonusCampaignFormSchema = z.object({
    bonusName: z.string().min(1, "Bonus name is required"),
    description: z.string().min(1, "Description is required"),
    bonusType: z.string().min(1, "Bonus type is required"),
    triggerEvent: z.string().min(1, "Trigger event is required"),
    bonusValue: z.coerce.number().min(0, "Bonus value must be a positive number"),
    wagerRequirementType: z.string().min(1, "Wager requirement type is required"),
    wagerRequirementValue: z.coerce.number().min(0, "Wager requirement value must be a positive number"),
    applicablePaymentMethods: z.array(z.string()).optional(),
    applicablePaymentCategories: z.array(z.string()).optional(),
    applicableProviders: z.array(z.coerce.number()).optional(),
    directMainCredit: z.boolean().default(false),
    currentUsageCount: z.coerce.number().min(0, "Usage count must be a positive number").default(0),
    isActive: z.boolean().default(true),
    startDate: z.coerce.date().optional().nullable(),
    endDate: z.coerce.date().optional().nullable(),
    maxUsageCount: z.coerce.number().min(1, "Max usage count must be at least 1").optional().nullable(),
    minDepositAmount: z.coerce.number().min(0, "Minimum deposit amount must be a positive number").optional().nullable(),
    maxBonusAmount: z.coerce.number().min(0, "Maximum bonus amount must be a positive number").optional().nullable(),
}).superRefine((data, ctx) => {
    // Validate that endDate is after startDate if both exist
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
            path: ["endDate"],
            message: "End date must be after start date",
            code: "custom",
        });
    }

    // Validate that maxBonusAmount is greater than minDepositAmount if both exist
    if (data.minDepositAmount && data.maxBonusAmount && data.maxBonusAmount < data.minDepositAmount) {
        ctx.addIssue({
            path: ["maxBonusAmount"],
            message: "Maximum bonus amount must be greater than minimum deposit amount",
            code: "custom",
        });
    }
});

export type BonusCampaignFormValues = z.infer<typeof bonusCampaignFormSchema>;

type Props = {
    defaultValues?: Partial<BonusCampaignFormValues>;
    onSubmit: (data: BonusCampaignFormValues) => void;
    isLoading?: boolean;
};

const triggerEventOptions = [
    { label: "First Deposit", value: "FIRST_DEPOSIT" },
    { label: "Every Deposit", value: "EVERY_DEPOSIT" },
    // { label: "Loss Based", value: "LOSS_BASED" },
    // { label: "Wager Based", value: "WAGER_BASED" },
    // { label: "Login Based", value: "LOGIN_BASED" },
    // { label: "Game Specific", value: "GAME_SPECIFIC" },
    // { label: "Time Limited", value: "TIME_LIMITED" },
    // { label: "Custom Event", value: "CUSTOM_EVENT" },
];

const bonusTypeOptions = [
    { label: "Percentage", value: "PERCENTAGE" },
    { label: "Fixed Amount", value: "FIXED_AMOUNT" },
    // { label: "Free Spins", value: "FREE_SPINS" },
    // { label: "Cashback", value: "CASHBACK" },
];

const wagerRequirementTypeOptions = [
    { label: "No Wager Requirement", value: "NONE" },
    // { label: "Turnover Multiplier", value: "TURNOVER_MULTIPLIER" },
    { label: "Fixed Amount", value: "FIXED_AMOUNT" },
];

const paymentCategoryOptions = [
    { label: "🪙 Cryptocurrency (All crypto payments)", value: "CRYPTOCURRENCY" },
    { label: "🏦 Bank Transfer (UPI, RTGS, NEFT, cards)", value: "BANK_TRANSFER" },
    // { label: "🔄 Internal Transfer (Agent/Admin)", value: "INTERNAL_TRANSFER" },
];

const BonusCampaignForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<BonusCampaignFormValues>({
        resolver: zodResolver(bonusCampaignFormSchema),
        defaultValues: defaultValues,
    });

    const { data: providersData } = useGetAvailableProviders();

    const values = form.watch();
    const handleSubmit = (data: BonusCampaignFormValues) => {
        onSubmit(data);
    };

    const handleProviderChange = (providerId: number, checked: boolean) => {
        const currentProviders = values.applicableProviders || [];
        if (checked) {
            form.setValue('applicableProviders', [...currentProviders, providerId]);
        } else {
            form.setValue('applicableProviders', currentProviders.filter(p => p !== providerId));
        }
    };

    const providers = useMemo(() => {
        if (!providersData) return [];
        return providersData.data.providers.map((provider: any) => ({
            id: provider.id,
            name: provider.name,
        }));
    }, [providersData]);

    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-4">
                <FormInput
                    control={form.control}
                    name="bonusName"
                    label="Bonus Campaign Name*"
                />

<FormSelect
                        control={form.control}
                        name="triggerEvent"
                        label="Trigger Event*"
                        options={triggerEventOptions}
                    />
                      
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description*</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        control={form.control}
                        name="bonusType"
                        label="Bonus Type*"
                        options={bonusTypeOptions}
                    />

                              <FormInput
                        control={form.control}
                        name="bonusValue"
                        type="number"
                        label="Bonus Value*"
                        description={values.bonusType === "PERCENTAGE" ? "Enter percentage (e.g., 50 for 50%)" : "Enter fixed amount"}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        control={form.control}
                        name="minDepositAmount"
                        type="number"
                        label="Minimum Deposit Amount"
                        description="Minimum deposit required to trigger this bonus"
                    />

                    <FormInput
                        control={form.control}
                        name="maxBonusAmount"
                        type="number"
                        label="Maximum Bonus Amount"
                        description="Maximum bonus amount that can be awarded"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        control={form.control}
                        name="wagerRequirementType"
                        label="Wager Requirement Type*"
                        options={wagerRequirementTypeOptions}
                    />

                    <FormInput
                        control={form.control}
                        name="wagerRequirementValue"
                        type="number"
                        label="Wager Requirement Value*"
                        description="Value based on the selected requirement type"
                    />
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormDatePicker
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                        description="When the campaign becomes active"
                    />

                    <FormDatePicker
                        control={form.control}
                        name="endDate"
                        label="End Date"
                        description="When the campaign expires"
                    />
                </div>

                <FormInput
                    control={form.control}
                    name="maxUsageCount"
                    type="number"
                    label="Maximum Usage Count"
                    description="Maximum number of times this bonus can be claimed (leave empty for unlimited)"
                /> */}

                {/* Payment Categories */}
                <div className="space-y-3">
                    <Label>Applicable Payment Categories (leave empty for all)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {paymentCategoryOptions.map((cat) => (
                            <div key={cat.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`pc-${cat.value}`}
                                    checked={values.applicablePaymentCategories?.includes(cat.value) || false}
                                    onCheckedChange={(checked) => {
                                        const current = values.applicablePaymentCategories || [];
                                        const updated = (checked as boolean)
                                            ? [...current, cat.value]
                                            : current.filter((c) => c !== cat.value);
                                        form.setValue('applicablePaymentCategories', updated);
                                    }}
                                />
                                <Label htmlFor={`pc-${cat.value}`} className="text-sm font-normal">{cat.label}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Provider Selection */}
                <div className="space-y-3">
                    <Label>Applicable Providers</Label>
                    <div className="grid grid-cols-2 gap-4">
                        {providers.map((provider: any) => (
                            <div key={provider.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`provider-${provider.id}`}
                                    checked={values.applicableProviders?.includes(provider.id) || false}
                                    onCheckedChange={(checked) => handleProviderChange(provider.id, checked as boolean)}
                                />
                                <Label htmlFor={`provider-${provider.id}`} className="text-sm font-normal">
                                    {provider.name} (Provider {provider.id})
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSwitch
                        control={form.control}
                        name="directMainCredit"
                        label="Direct Main Credit"
                        description="Credit bonus directly to main balance"
                    />

                    <FormSwitch
                        control={form.control}
                        name="isActive"
                        label="Active"
                        description="Enable/disable this bonus campaign"
                    />
                </div>
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Campaign"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default BonusCampaignForm;