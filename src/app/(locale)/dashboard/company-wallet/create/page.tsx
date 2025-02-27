"use client";
import CompanyWalletForm from "@/columns/company-wallet-add";
import CompanyWalletCard from "@/columns/company-wallet-card";
import { COMPANYID } from "@/lib/utils";

const CreatePage = () => {


    return (
        <section className="section max-w-md space-y-4">
            <CompanyWalletCard companyId={COMPANYID.toString()} />
            <CompanyWalletForm  />
        </section>);
};

export default CreatePage;