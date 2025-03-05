"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AgentDetailsCard from "@/components/features/agent/agent-card";
import TransactionEditForm from "@/components/features/transaction/transaction-form";
import { Transaction, TransactionType } from "@/models/transaction";
import { useUpdateDepositRequestStatus, useUpdateWithdrawRequestStatus } from "@/react-query/agent-queries";
import { useGetTransactionById } from "@/react-query/transactions-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const EditTransactionPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetTransactionById(id.toString());
    const { mutate: deposit, isPending } = useUpdateDepositRequestStatus();
    const { mutate: withdrawl, isPending: confirmPending } = useUpdateWithdrawRequestStatus();
    const router = useRouter();

    const transaction = useMemo(() => {
        return new Transaction(data?.data?.transaction);
    }, [data]);

    const onSubmit = (updatedData: any) => {

        if (transaction.type == TransactionType.DEPOSIT) {
            deposit({
                transactionId: id,
                ...updatedData,
            }, {
                onSuccess: () => {
                    router.push("/dashboard/agents/transactions");
                },
            });
        };

        if (transaction.type == TransactionType.WITHDRAWAL) {
            withdrawl({
                transactionId: id,
                ...updatedData,
            }, {
                onSuccess: () => {
                    router.push("/dashboard/agents/transactions");
                },
            });
        };
    };

    if (isLoading) return <LoadingScreen>Loading transaction...</LoadingScreen>;

    return (
        <>

            {transaction.agent && <AgentDetailsCard agent={transaction.agent} />}
            {isSuccess && data && (
                <TransactionEditForm
                    transaction={data.data.transaction}
                    onSubmit={onSubmit}
                    isLoading={isPending || confirmPending}
                />)}
        </>
    );

};

export default EditTransactionPage;
