"use client";

import React from "react";
import LoadingScreen from "@/components/common/loading-screen";
import TransactionEditForm from "@/components/features/transaction/transaction-form";
import { useGetTransactionById, useUpdateTransactionById, } from "@/react-query/transactions-queries";
import { useParams, useRouter } from "next/navigation";

const EditTransactionPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetTransactionById(id.toString());
    const { mutate, isPending } = useUpdateTransactionById();
    const router = useRouter();

    const onSubmit = (updatedData: any) => {
        mutate({
            id,
            ...updatedData,
        }, {
            onSuccess: () => {
                router.push("/dashboard/transactions");
            },
        });
    };

    if (isLoading) return <LoadingScreen>Loading transaction...</LoadingScreen>;

    return (
        isSuccess && data && (
            <TransactionEditForm
                transaction={data.data.transaction}
                onSubmit={onSubmit}
                isLoading={isPending}
            />
        )
    );
};

export default EditTransactionPage;
