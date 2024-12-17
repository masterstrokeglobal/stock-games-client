import { Button } from "@/components/ui/button";
import FormImage from "@/components/ui/form/form-image-compact";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const createCompanyInputSchema = z.object({
    id: z.string().optional(),
    name: z.string().max(100).nonempty(),
    address: z.string().optional(),
    contactPersonName: z.string().optional(),
    contactPersonEmail: z.string().email(),
    logo: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    domain: z.string().optional(),
    paymentImage:z.string().url().optional()
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

const CompanyForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(createCompanyInputSchema),
        defaultValues,
    });

    const { control, handleSubmit } = form;
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
            <FormInput
                control={control}
                name="logo"
                label="Logo URL"
            />
            <FormInput
                control={control}
                type="color"
                name="primaryColor"
                label="Primary Color"
            />
            <FormInput
                control={control}
                name="secondaryColor"
                type="color"
                label="Secondary Color"
            />
            <FormInput
                control={control}
                name="domain"
                label="Domain"
            />
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

export default CompanyForm;

