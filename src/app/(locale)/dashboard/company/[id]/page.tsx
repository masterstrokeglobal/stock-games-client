"use client";

import React, { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import CompanyForm, { CompanyFormValues } from "@/components/features/company/company-form"; // Adjust the import
import { useGetCompanyById, useUpdateCompanyById } from "@/react-query/company-queries"; // Import hooks for fetching and updating company
import { useParams, useRouter } from "next/navigation";

const EditCompanyPage = () => {
    const params = useParams();
    const { id } = params; // Extract company ID from parameters
    const { data, isLoading, isSuccess } = useGetCompanyById(id.toString()); // Fetch the company data by ID
    const { mutate, isPending } = useUpdateCompanyById(); // Hook for updating a company
    const router = useRouter();

    const defaultValues: CompanyFormValues | null = useMemo(() => {
        if (!isSuccess) return null;

        const company = data.data;

        return {
            id: company.id?.toString(),
            name: company.name,
            address: company.address,
            contactPersonName: company.contactPersonName,
            contactPersonEmail: company.contactPersonEmail,
            logo: company.logo,
            depositBonusPercentage: company.depositBonusPercentage,
            depositBonusPercentageEnabled: company.depositBonusPercentageEnabled,
            primaryColor: company.primaryColor,
            secondaryColor: company.secondaryColor,
            domain: company.domain,
            paymentImage: company.paymentImage,
        };
    }, [data, isSuccess]);

    const onSubmit = (data: CompanyFormValues) => {
        mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/company"); // Redirect after updating
            },
        });
    };

    if (isLoading) return <LoadingScreen>Loading company...</LoadingScreen>; // Show loading screen

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Company</h2>
            </header>
            <main className="mt-4">
                <CompanyForm
                    defaultValues={defaultValues as any}
                    onSubmit={onSubmit}
                    isLoading={isPending}
                />

            </main>
        </section>
    );
};

export default EditCompanyPage;
