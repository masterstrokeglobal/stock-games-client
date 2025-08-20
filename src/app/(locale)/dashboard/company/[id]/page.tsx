"use client";

import LoadingScreen from "@/components/common/loading-screen";
import CompanyForm, { CompanyFormValues } from "@/components/features/company/company-form"; // Adjust the import
import CompanySuperAdminForm from "@/components/features/company/company-superadmin-form";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import { useGetCompanyById, useUpdateCompanyById } from "@/react-query/company-queries"; // Import hooks for fetching and updating company
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const EditCompanyPage = () => {
    const params = useParams();
    const { id } = params; // Extract company ID from parameters
    const { data, isLoading, isSuccess } = useGetCompanyById(id.toString()); // Fetch the company data by ID
    const { mutate, isPending } = useUpdateCompanyById(); // Hook for updating a company
    const router = useRouter();
    const { userDetails } = useAuthStore();

    const user = userDetails as Admin;
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
            allowedCasino: company.allowedCasino,
            maxSinglePlacementPerGameType: company.maxSinglePlacementPerGameType,
            minPlacement: company.minPlacement,
            maxPlacement: company.maxPlacement,
            gameRestrictions: company.gameRestrictions,
            minCasinoPlacement: company.minCasinoPlacement,
            maxCasinoPlacement: company.maxCasinoPlacement,
            depositBonusPercentage: company.depositBonusPercentage,
            depositBonusPercentageEnabled: company.depositBonusPercentageEnabled,
            domain: company.domain,
            paymentImage: company.paymentImage,
            dynamicQR: company.dynamicQR,
            otpIntegration: company.otpIntegration,
            userVerfication: company.userVerfication,
            coinValues: company.coinValues,
            theme: company.theme,
        };
    }, [data, isSuccess]);

    const onSubmit = (data: CompanyFormValues) => {
        mutate(data, {
            onSuccess: () => {
                if (user.isCompanyAdmin) {
                    router.push("/dashboard/company-admin");
                } else {
                    router.push("/dashboard/company");
                }
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
                {user?.isSuperAdmin ? (
                    <CompanySuperAdminForm
                        defaultValues={defaultValues as any}
                        onSubmit={onSubmit}
                        isLoading={isPending}
                    />
                ) : (
                    <CompanyForm
                        defaultValues={defaultValues as any}
                        onSubmit={onSubmit}
                        isLoading={isPending}
                    />
                )}

            </main>
        </section>
    );
};

export default EditCompanyPage;
