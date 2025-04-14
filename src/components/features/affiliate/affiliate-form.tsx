import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormPassword from '@/components/ui/form/form-password';
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from '@/components/ui/form/form-select';
import FormSwitch from '@/components/ui/form/form-switch';
import { AffiliateRole } from '@/models/affiliate';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the schema for affiliate input
const passwordValidation = z.string().min(8);
export const createAffiliateInputSchema = z.object({
    id: z.string().optional(),
    name: z.string().max(100).optional(),
    username: z.string().min(1),
    password: passwordValidation.optional(),
    companyId: z.string().optional(),
    referralBonus: z.coerce.number().min(0).nonnegative(),
    role: z.nativeEnum(AffiliateRole),
    isPercentage: z.boolean().default(false),
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
};

const affiliateRoles = Object.values(AffiliateRole).map(role => ({
    value: role.toLowerCase(),
    label: role.split("_").join(" ").toLowerCase()
}));

const AffiliateForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<AffiliateFormValues>({
        resolver: zodResolver(createAffiliateInputSchema),
        defaultValues: {
            ...defaultValues,
            isPercentage: defaultValues?.isPercentage || false,
            referralBonus: defaultValues?.referralBonus || 0,
        },
    });

    // Watch the isPercentage field to provide conditional validation
    const isPercentage = form.watch('isPercentage');



    const handleSubmit = (data: AffiliateFormValues) => {
        onSubmit(data);
    };


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
                    label="Username*"
                />
                <FormPassword
                    control={form.control}
                    name="password"
                    type="password"
                    label="Password*"
                />

                <FormSelect
                    control={form.control}
                    name="role"
                    label="Role"
                    options={affiliateRoles}
                />

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