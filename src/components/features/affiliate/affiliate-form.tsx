import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from '@/components/ui/form/form-password';
import FormProvider from "@/components/ui/form/form-provider";
import FormSwitch from '@/components/ui/form/form-switch';
import { AffiliateRole } from '@/models/affiliate';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the schema for affiliate input
const passwordValidation = z.string().min(8);
export const createAffiliateInputSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().max(100).optional(),
    username: z.string().min(1).email(),
    canCreateSubAffiliate: z.boolean().default(false),
    password: passwordValidation.optional(),
    comission: z.coerce.number().min(0).nonnegative(),
    referralBonus: z.coerce.number().min(0).nonnegative(),
    isPercentage: z.boolean().default(false),
    minAmount: z.coerce.number().min(0).nonnegative(),
    maxAmount: z.coerce.number().min(0).nonnegative().optional(),
    provideMaxAmount: z.boolean().default(false),
    role: z.nativeEnum(AffiliateRole),
}).superRefine((data, ctx) => {
    if (!data.id && !data.password) {
        ctx.addIssue({
            path: ["password"],
            message: "Password is required for creating affiliate",
            code: "custom",
        });
    }

    // Additional validation for percentage value
    if (data.isPercentage && data.referralBonus > 100) {
        ctx.addIssue({
            path: ["referralBonus"],
            message: "Percentage cannot exceed 100%",
            code: "custom",
        });
    }
});

export type AffiliateFormValues = z.infer<typeof createAffiliateInputSchema>;


type Props = {
    defaultValues?: AffiliateFormValues;
    onSubmit: (data: AffiliateFormValues) => void;
    isLoading?: boolean;
    subAffiliate?: boolean;
};


const AffiliateForm = ({ defaultValues, onSubmit, isLoading, subAffiliate }: Props) => {
    const form = useForm<AffiliateFormValues>({
        resolver: zodResolver(createAffiliateInputSchema),
        defaultValues: {
            ...defaultValues,
            isPercentage: defaultValues?.isPercentage || false,
            referralBonus: defaultValues?.referralBonus || 0,
        },
    });

    const isPercentage = form.watch('isPercentage');

    const handleSubmit = (data: AffiliateFormValues) => {
        onSubmit(data);
    };


    console.log(form.formState.errors);
    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-4">
                <FormInput
                    control={form.control}
                    name="name"
                    label="Affiliate Name"
                />
                <FormInput
                    control={form.control}
                    name="username"
                    label="Email*"
                />
                <FormPassword
                    control={form.control}
                    name="password"
                    type="password"
                    label="Password*"
                />
                {!subAffiliate && (
                    <>
                        <FormInput
                            control={form.control}
                            name="referralBonus"
                            type="number"
                            label={`Referral Bonus${isPercentage ? ' (%)' : ''}`}
                        />
                        <FormSwitch
                            control={form.control}
                            name="isPercentage"
                            label="Is Percentage"
                        />
                        <FormSwitch
                            control={form.control}
                            name="canCreateSubAffiliate"
                            label="Sub Affiliate Creation"
                            description="If enabled, the affiliate can create sub affiliates under them"
                        />
                    </>
                )}

                
                <div className="flex gap-4">
                    <FormInput
                        control={form.control}
                        name="minAmount"
                        type="number"
                        label="Min Amount"
                    />

                </div>

                <div className="flex gap-4">
                    <FormInput
                        control={form.control}
                        name="maxAmount"
                        type="number"
                        disabled={!form.watch('provideMaxAmount')}
                        label="Max Amount"
                    />

                    <FormSwitch
                        control={form.control}
                        name="provideMaxAmount"
                        label="Provide Max Amount"
                        className="flex-1"
                    />

                </div>

                <FormInput
                    control={form.control}
                    name="comission"
                    type="number"
                    label="Comission (%) "
                />
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Affiliate"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default AffiliateForm;