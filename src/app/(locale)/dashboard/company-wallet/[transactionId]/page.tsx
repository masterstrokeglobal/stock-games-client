"use client";

import CompanyWalletCard from "@/columns/company-wallet-card";
import LoadingScreen from "@/components/common/loading-screen";
import TransactionEditForm from "@/components/features/transaction/transaction-form";
import { Transaction } from "@/models/transaction";
import { useVerifyCompanyDeposit } from "@/react-query/payment-queries";
import { useGetTransactionById } from "@/react-query/transactions-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const EditTransactionPage = () => {
    const params = useParams();
    const router = useRouter();
    const { transactionId } = params;
    const { data, isLoading, isSuccess } = useGetTransactionById(transactionId.toString());
    const { mutate, isPending: confirmPending } = useVerifyCompanyDeposit();

    const transaction = useMemo(() => {
        return new Transaction(data?.data?.transaction);
    }, [data]);

    const onSubmit = (updatedData: any) => {
        mutate({
            transactionId,
            ...updatedData,
        }, {
            onSuccess: () => {
                router.push("/dashboard/company-wallet");
            },
        });
    };



    if (isLoading) return <LoadingScreen>Loading transaction...</LoadingScreen>;

    const companyID = transaction.company?.id?.toString();


    return (
        <>

            {companyID && <CompanyWalletCard companyId={companyID} />}
            {isSuccess && data && (
                <TransactionEditForm
                    transaction={data.data.transaction}
                    onSubmit={onSubmit}
                    isLoading={confirmPending}
                />)}
        </>
    );

};

export default EditTransactionPage;
