"use client";

import DepositEnabledFormPercentage, { BonusPercentageFormValues } from "@/components/common/enabled-bonus-percentage";
import LoadingScreen from "@/components/common/loading-screen";
import CompanyCard from "@/components/features/company/company-card";
import CompanyEarningsCard from "@/components/features/company/company-earning";
import CompanyPlacementManagement from "@/components/features/company/company-placement-not-allowed";
import Company from "@/models/company";
import { useGetCompanyById, useUpdateDepositBonusPercentageEnabled } from "@/react-query/company-queries";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ViewCompanyPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetCompanyById(id.toString());
    const { mutate, isPending } = useUpdateDepositBonusPercentageEnabled();


    const onChangeBonusPercentage = (data: BonusPercentageFormValues) => {
        mutate({
            companyId: id.toString(),
            depositBonusPercentageEnabled: data.depositBonusPercentageEnabled
        })
    };

    const defaultValues: BonusPercentageFormValues | null = useMemo(() => {
        if (!isSuccess) return null;

        const company = data.data;

        return {
            depositBonusPercentageEnabled: company.depositBonusPercentageEnabled
        };
    }, [data, isSuccess]);

    const companyDetails = useMemo(() => {
        if (isSuccess) {
            return new Company(data?.data);
        }
        return null;
    }, [data, isSuccess]);

    if (isLoading) return <LoadingScreen className="h-[60vh]">Loading company...</LoadingScreen>;


    return (
        <section className="container-main min-h-[60vh]">
            <main className="mt-4 space-y-8">
                {companyDetails && <CompanyCard company={companyDetails} showBonusPercentage={companyDetails.depositBonusPercentageEnabled} />}
                {companyDetails && <CompanyPlacementManagement company={companyDetails} />}
                {defaultValues && <DepositEnabledFormPercentage onSubmit={onChangeBonusPercentage} defaultValues={defaultValues} isLoading={isPending} />}
                <CompanyEarningsCard companyId={id.toString()} />
            </main>
        </section>
    );
};

export default ViewCompanyPage;
