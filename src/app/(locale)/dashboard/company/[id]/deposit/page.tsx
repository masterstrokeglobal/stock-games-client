"use client";
import CompanyWalletCard from "@/columns/company-wallet-card";
import SuperAdminCompanyDepositForm from "@/columns/company-wallet-deposit";
import { useCompanyWalletByCompanyId } from "@/react-query/company-queries";
import { useParams } from "next/navigation";

const CoinsAddCompanyWallet = () => {

    const companyId = useParams().id as string;
    const {data,isLoading } = useCompanyWalletByCompanyId({ companyId });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <section className="section max-w-md space-y-4">
            <CompanyWalletCard companyId={companyId} />
            {data?.id && <SuperAdminCompanyDepositForm defaultCompanyWalletId={data.id?.toString()} />}
        </section>);
};

export default CoinsAddCompanyWallet;