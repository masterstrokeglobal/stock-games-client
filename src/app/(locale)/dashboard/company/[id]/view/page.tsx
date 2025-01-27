"use client";

import LoadingScreen from "@/components/common/loading-screen";
import CompanyCard from "@/components/features/company/company-card";
import CompanyEarningsCard from "@/components/features/company/company-earning";
import CompanyPlacementManagement from "@/components/features/company/company-placement-not-allowed";
import Company from "@/models/company";
import { useGetCompanyById } from "@/react-query/company-queries";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const ViewCompanyPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetCompanyById(id.toString());

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
                {companyDetails && <CompanyCard company={companyDetails} />}
                {companyDetails &&<CompanyPlacementManagement company={companyDetails} />}
                <CompanyEarningsCard companyId={id.toString()} />
            </main>
        </section>
    );
};

export default ViewCompanyPage;
