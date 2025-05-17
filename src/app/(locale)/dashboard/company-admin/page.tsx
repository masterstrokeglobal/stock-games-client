"use client";

import CompanyWalletCard from "@/columns/company-wallet-card";
import LoadingScreen from "@/components/common/loading-screen";
import CompanyCard from "@/components/features/company/company-card";
import CompanyEarningsCard from "@/components/features/company/company-earning";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import Company from "@/models/company";
import { useGetCompanyById } from "@/react-query/company-queries";
import { useMemo } from "react";

const ViewCompanyPage = () => {
    const { userDetails } = useAuthStore();
    const admin = userDetails as unknown as Admin;

    const companyId = admin.company!.id!.toString();
    const { data, isLoading, isSuccess } = useGetCompanyById(companyId);



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
                <CompanyWalletCard companyId={companyId} />
                {companyDetails && <CompanyCard company={companyDetails} />}
                {<CompanyEarningsCard companyId={companyId} />}
            </main>
        </section>
        
    );
};

export default ViewCompanyPage;
