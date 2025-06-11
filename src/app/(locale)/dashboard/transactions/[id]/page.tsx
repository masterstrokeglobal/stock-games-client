"use client";

import React, { useMemo } from "react";
import LoadingScreen from "@/components/common/loading-screen";
import TransactionEditForm from "@/components/features/transaction/transaction-form";
import { useConfirmWithdrawal, useGetTransactionById, useUpdateTransactionById, } from "@/react-query/transactions-queries";
import { useParams, useRouter } from "next/navigation";
import { Transaction, TransactionType } from "@/models/transaction";
import WithdrawalDetails from "@/components/features/transaction/withdrawl-details";
import WithdrawDetailsRecord from "@/models/withdrawl-details";
import UserCard from "@/components/features/user/user-card";

const EditTransactionPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetTransactionById(id.toString());
    const { mutate, isPending } = useUpdateTransactionById();
    const { mutate: withdrawl, isPending: confirmPending } = useConfirmWithdrawal();
    const router = useRouter();

    const transaction = useMemo(() => {
        return new Transaction(data?.data?.transaction);
    }, [data]);

    const onSubmit = (updatedData: any) => {

        if (transaction.type == TransactionType.DEPOSIT) {
            mutate({
                id,
                ...updatedData,
            }, {
                onSuccess: () => {
                    router.push("/dashboard/transactions");
                },
            });
        };

        if (transaction.type == TransactionType.WITHDRAWAL) {
            withdrawl({
                id,
                ...updatedData,
            }, {
                onSuccess: () => {
                    router.push("/dashboard/transactions");
                },
            });
        };
    };

    const withdrawldetails = useMemo(() => {
        if (transaction.type != TransactionType.WITHDRAWAL) return null;
        return new WithdrawDetailsRecord(data?.data?.transaction.withdrawDetails);
    }, [data, transaction]);

    if (isLoading) return <LoadingScreen>Loading transaction...</LoadingScreen>;


    return (
        <>

            {transaction.user && <UserCard user={transaction.user} />}
            {withdrawldetails && <WithdrawalDetails withdrawDetails={withdrawldetails} />}
            {isSuccess && data && (
                <TransactionEditForm
                    transaction={data.data.transaction}
                    onSubmit={onSubmit}
                    showEdit={transaction.type == TransactionType.DEPOSIT||transaction.type==TransactionType.WITHDRAWAL}
                    isLoading={isPending || confirmPending}
                />)}
        </>
    );

};

export default EditTransactionPage;
