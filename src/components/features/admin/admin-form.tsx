import React, { useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormComboboxSelect from "@/components/ui/form/form-combobox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetAllCompanies } from '@/react-query/company-queries';
import FormPassword from '@/components/ui/form/form-password';

// Define the schema for admin input
const passwordValidation = z.string().min(8);
export const createAdminInputSchema = z.object({
    id: z.string().optional(),
    name: z.string().max(100).optional(),
    email: z.string().email(),
    password: passwordValidation.optional(),
    companyId: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.id && !data.password) {
        ctx.addIssue({
            path: ["password"],
            message: "Password is required for creating admin",
            code: "custom",
        });
    }
});

export type AdminFormValues = z.infer<typeof createAdminInputSchema>;

// Define type for SelectOption used in dropdowns
type SelectOption = {
    value: string;
    label: string;
};

type Props = {
    defaultValues?: AdminFormValues;
    onSubmit: (data: AdminFormValues) => void;
    isLoading?: boolean;
};

const AdminForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const [search, setSearch] = useState("");
    const form = useForm<AdminFormValues>({
        resolver: zodResolver(createAdminInputSchema),
        defaultValues,
    });

    // Fetch company options and handle loading state
    const { data: companyData, isLoading: companiesLoading } = useGetAllCompanies({
        page: 1,
        search: search,
    });

    const companyOptions: SelectOption[] = useMemo(() => {
        if (companiesLoading) return [];
        if (!companyData) return [];

        return companyData.data.companies.map((company: { id: string; name: string; }) => ({
            value: company.id.toString(),
            label: company.name,
        }));
    }, [companyData, companiesLoading]);

    const handleSubmit = (data: AdminFormValues) => {
        onSubmit(data);
    };

    return (
        <FormProvider onSubmit={form.handleSubmit(handleSubmit)} methods={form}>
            <div className="space-y-4">
                <FormInput
                    control={form.control}
                    name="name"
                    label="Admin Name"
                />
                <FormInput
                    control={form.control}
                    name="email"
                    label="Email*"
                />
                <FormPassword
                    control={form.control}
                    name="password"
                    type="password"
                    label="Password*"
                />
                <FormComboboxSelect
                    className='w-full'
                    name='companyId'
                    onSearchInputChange={setSearch}
                    disabled={companiesLoading}
                    placeholder={companiesLoading ? "Loading..." : "Select Company"}
                    control={form.control}
                    options={companyOptions}
                    label="Company ID"
                />
            </div>

            <footer className="flex justify-end gap-4 mt-8">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Admin"}
                </Button>
            </footer>
        </FormProvider>
    );
};

export default AdminForm;
