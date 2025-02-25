"use client";

import React from "react";
import CompanyForm, { CompanyFormValues } from "@/components/features/company/company-form"; // Adjust the import
import { useCreateCompany } from "@/react-query/company-queries";
import { useRouter } from "next/navigation";

const defaultValues: CompanyFormValues = {
    name: "",
    address: "",
    contactPersonName: "",
    contactPersonEmail: "",
    logo: "",
    domain: "",
};

const CreateCompanyPage = () => {
    const router = useRouter();
    const { mutate, isPending } = useCreateCompany();

    const onSubmit = (data: CompanyFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/company"); // Redirect after creation
            },
        });
    };

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Create Company</h2>
            </header>
            <main className="mt-4">
                <CompanyForm
                    defaultValues={defaultValues}
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />
            </main>
        </section>
    );
};

export default CreateCompanyPage;
