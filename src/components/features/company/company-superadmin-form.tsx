import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image-compact";
import FormInput from "@/components/ui/form/form-input";
import FormMultiInput from "@/components/ui/form/form-multi-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormRecord from "@/components/ui/form/form-record";
import { RoundRecordGameType } from "@/models/round-record";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/ui/form";
import FormSwitch from "@/components/ui/form/form-switch";

export const createCompanyInputSchema = z.object({
    id: z.string().optional(),
    name: z.string().max(100).nonempty(),
    address: z.string().optional(),
    contactPersonName: z.string().optional(),
    contactPersonEmail: z.string().email(),
    logo: z.string().optional(),
    domain: z.string().optional(),
    paymentImage: z.string().url().optional(),
    dynamicQR: z.boolean().optional(),
    gameRestrictions: z.array(z.nativeEnum(RoundRecordGameType)).optional(),
    userVerfication: z.boolean().default(false).optional(),
    otpIntegration: z.boolean().default(false).optional(),
    askWithdrawlOption: z.boolean().default(false).optional(),
    theme: z.record(z.string(), z.string()).optional(),
    minPlacement: z.coerce.number().optional(),
    allowedCasino: z.boolean().optional(),
    coinValues: z.array(z.coerce.number()).min(4).max(4).default([]),
    maxSinglePlacementPerGameType: z.record(z.nativeEnum(RoundRecordGameType), z.coerce.number()).optional(),
    maxPlacement: z.coerce.number().optional(),
    minCasinoPlacement: z.coerce.number().optional(),
    maxCasinoPlacement: z.coerce.number().optional(),
}).superRefine((data, ctx) => {
    if (!data.id && !data.logo) {
        ctx.addIssue({
            path: ["logo"],
            message: "Logo is required for creating a company",
            code: "custom",
        });
    }
});


export type CompanyFormValues = z.infer<typeof createCompanyInputSchema>;


type Props = {
    defaultValues?: CompanyFormValues;
    onSubmit: (data: CompanyFormValues) => void;
    isLoading?: boolean;
};

const CompanySuperAdminForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(createCompanyInputSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;

    // Custom field array for gameRestrictions
    const {
        fields: gameRestrictionFields,
        append: appendGameRestriction,
        remove: removeGameRestriction
    } = useFieldArray({
        control: control as any,
        name: "gameRestrictions" as any
    });

    const gameTypeOptions = Object.values(RoundRecordGameType);

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
                control={control}
                name="name"
                label="Company Name*"
            />
            <FormInput
                control={control}
                name="address"
                label="Address"
            />
            <FormInput
                control={control}
                name="contactPersonName"
                label="Contact Person Name"
            />
            <FormInput
                control={control}
                name="contactPersonEmail"
                label="Contact Person Email*"
            />
            <FormImage
                control={control}
                name="logo"
                label="Logo URL"
            />

            <FormInput
                control={control}
                name="domain"
                label="Domain"
            />
            <FormInput
                control={control}
                name="minPlacement"
                label="Minimum Placement"
            />
            <FormInput
                control={control}
                name="maxPlacement"
                label="Maximum Placement"
            />
            <FormRecord
                control={control}
                name="theme"
                label="Theme"
            />
            <FormRecord
                control={control}
                name="maxSinglePlacementPerGameType"
                label="Max Single Placement Per Game Type"
            />
            <div className="mb-4">
                <label className="block font-medium mb-2">Game Restrictions</label>
                {gameRestrictionFields.map((field, idx) => (
                    <div key={field.id} className="flex items-center gap-2 mb-2">
                        <FormField
                            control={control}
                            name={`gameRestrictions.${idx}`}
                            render={({ field: selectField }) => (
                                <Select
                                    value={selectField.value}
                                    onValueChange={selectField.onChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Game Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gameTypeOptions.map(option => (
                                            <SelectItem value={option} key={option} className="capitalize">
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Button type="button" variant="destructive" onClick={() => removeGameRestriction(idx)}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={() => appendGameRestriction("")}>Add Restriction</Button>
            </div>
            <FormInput
                control={control}
                name="minPlacement"
                label="Minimum Placement"
            />
            <FormInput
                control={control}
                name="minCasinoPlacement"
                label="Minimum Casino Placement"
            />
            <FormInput
                control={control}
                name="maxCasinoPlacement"
                label="Maximum Casino Placement"
            />
            <FormMultiInput
                control={control}
                name="coinValues"
                label="Coins"
            />
            <FormSwitch
                control={control}
                name="dynamicQR"
                title="Dynamic QR for Payouts"
                description=" Dynamic QR for Payouts"
                label="Dynamic QR" />

            <FormSwitch
                control={control}
                name="userVerfication"
                title="User Verification"
                description=" User Verification is required for creating an account"
                label="User Verification" />
            <FormSwitch
                control={control}
                name="otpIntegration"
                title="OTP Integration"
                description=" Phone Number Verification is required for creating an account"
                label="Phone Number Verification" />

            <FormSwitch
                control={control}
                name="askWithdrawlOption"
                title="Ask Withdrawl Option"
                description=" Ask Withdrawl Option at  the time of deposit"
                label="Ask Withdrawl Option" />
            <FormImage
                control={control}
                name="paymentImage"
                label="Payment Method" />

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => { }}>Reset</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Company"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default CompanySuperAdminForm;
