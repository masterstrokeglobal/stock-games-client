import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormSelect from "@/components/ui/form/form-select";
import FormSwitch from '@/components/ui/form/form-switch';
import FormDatePicker from "@/components/ui/form/form-date-picker";
import FormProvider from "@/components/ui/form/form-provider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BonusCategory, BonusFrequency } from "@/models/bonus";
import FormImage from "@/components/ui/form/form-image-compact";

// Define the schema for bonus input
export const bonusFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.nativeEnum(BonusCategory, {
        errorMap: () => ({ message: "Please select a valid category" }),
    }),
    amount: z.coerce.number().min(0, "Amount must be a positive number"),
    maxAmount: z.coerce.number().min(0, "Maximum amount must be a positive number").optional().nullable(),
    minAmount: z.coerce.number().min(0, "Minimum amount must be a positive number").optional().nullable(),
    startDate: z.coerce.date().transform((val) => val ? new Date(val) : null),
    endDate: z.coerce.date().transform((val) => val ? new Date(val) : null),
    imageUrl: z.string().url("Invalid image url").optional().nullable(),
    active: z.boolean().default(false),
    frequency: z.nativeEnum(BonusFrequency, {
        errorMap: () => ({ message: "Please select a valid frequency" }),
    }).optional().nullable(),
    maxCount: z.coerce.number().min(1, "Max count must be at least 1").default(1),
    percentage: z.boolean().default(true),
}).superRefine((data, ctx) => {
    // Validate that endDate is after startDate if both exist
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
            path: ["endDate"],
            message: "End date must be after start date",
            code: "custom",
        });
    }

    // Validate that maxAmount is greater than minAmount if both exist
    if (data.minAmount && data.maxAmount && data.maxAmount < data.minAmount) {
        ctx.addIssue({
            path: ["maxAmount"],
            message: "Maximum amount must be greater than minimum amount",
            code: "custom",
        });
    }
});

export type BonusFormValues = z.infer<typeof bonusFormSchema>;

type Props = {
    defaultValues?: Partial<BonusFormValues>;
    onSubmit: (data: BonusFormValues) => void;
    isLoading?: boolean;
    companyId?: number;
};

const categoryOptions = Object.values(BonusCategory).map((category) => ({
    label: category,
    value: category,
}));

const frequencyOptions = Object.values(BonusFrequency).map((frequency) => ({
    label: frequency,
    value: frequency,
}));

const BonusForm = ({ defaultValues, onSubmit, isLoading, companyId }: Props) => {
    const form = useForm<BonusFormValues>({
        resolver: zodResolver(bonusFormSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            description: defaultValues?.description || "",
            amount: defaultValues?.amount || 0,
            maxAmount: defaultValues?.maxAmount || null,
            minAmount: defaultValues?.minAmount || null,
            imageUrl: defaultValues?.imageUrl || null,
            startDate: defaultValues?.startDate || null,
            endDate: defaultValues?.endDate || null,
            active: defaultValues?.active ?? false,
            category: defaultValues?.category || BonusCategory.DEPOSIT,
            frequency: defaultValues?.frequency || null,
            maxCount: defaultValues?.maxCount || 1,
            percentage: defaultValues?.percentage ?? true,
        },
    });

    const handleSubmit = (data: BonusFormValues) => {
        onSubmit(data);
    };



    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-4">
                <FormInput
                    control={form.control}
                    name="name"
                    label="Bonus Name*"
                />

                <FormInput
                    control={form.control}
                    name="description"
                    label="Description*"
                />

                <FormSelect
                    control={form.control}
                    name="category"
                    label="Category*"
                    options={categoryOptions}
                />

                <FormImage
                    control={form.control}
                    name="imageUrl"
                    label="Image URL"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        control={form.control}
                        name="amount"
                        type="number"
                        label="Bonus Amount*"
                    />

                    <FormSwitch
                        control={form.control}
                        name="percentage"
                        label="Is Percentage"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                        control={form.control}
                        name="minAmount"
                        type="number"
                        label="Minimum Amount"
                    />

                    <FormInput
                        control={form.control}
                        name="maxAmount"
                        type="number"
                        label="Maximum Amount"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormDatePicker
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                    />

                    <FormDatePicker
                        control={form.control}
                        name="endDate"
                        label="End Date"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        control={form.control}
                        name="frequency"
                        label="Frequency"
                        options={frequencyOptions}
                    />

                    <FormInput
                        control={form.control}
                        name="maxCount"
                        type="number"
                        label="Max Count"
                    />
                </div>

                <FormSwitch
                    control={form.control}
                    name="active"
                    label="Active"
                />


            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Bonus"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default BonusForm;