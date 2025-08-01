import { Button } from "@/components/ui/button";
import FormProvider from "@/components/ui/form/form-provider";
import FormSwitch from "@/components/ui/form/form-switch";
import Company from "@/models/company";
import { useUpdateCompanyById } from "@/react-query/company-queries";
import React from "react";
import { useForm } from "react-hook-form";

type CasinoAllowedFormValues = {
    allowedCasino: boolean;
};

interface CompanyCasinoAllowedProps {
    company: Company;
}

const CompanyCasinoAllowed: React.FC<CompanyCasinoAllowedProps> = ({ company }) => {
    const { mutate, isPending } = useUpdateCompanyById();

    const form = useForm<CasinoAllowedFormValues>({
        defaultValues: {
            allowedCasino: !!company.allowedCasino,
        },
    });

    const { handleSubmit } = form;

    const onSubmit = (data: CasinoAllowedFormValues) => {
        mutate({
            id: company.id?.toString(),
            allowedCasino: data.allowedCasino,
        } as any);
    };

    return (
        <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormSwitch control={form.control} name="allowedCasino" />
            <Button type="submit" disabled={isPending}>
                Save
            </Button>
        </FormProvider>
    );
};

export default CompanyCasinoAllowed;
