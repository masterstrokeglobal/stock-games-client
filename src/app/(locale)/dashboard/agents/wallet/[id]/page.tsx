"use client";

import LoadingScreen from "@/components/common/loading-screen";
import AgentDetailsCard from "@/components/features/agent/agent-card";
import TransactionEditForm from "@/components/features/transaction/transaction-form";
import { Transaction, TransactionType } from "@/models/transaction";
import { useUpdateAgentChipsDeposit, useUpdateAgentChipsWithdrawal } from "@/react-query/agent-queries";
import { useGetTransactionById } from "@/react-query/transactions-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

const EditTransactionPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetTransactionById(id.toString());
    const { mutate: deposit, isPending } = useUpdateAgentChipsDeposit();
    const { mutate: withdrawl, isPending: confirmPending } = useUpdateAgentChipsWithdrawal();
    const router = useRouter();

    const transaction = useMemo(() => {
        return new Transaction(data?.data?.transaction);
    }, [data]);

    const onSubmit = (updatedData: any) => {

        if (transaction.type == TransactionType.AGENT_DEPOSIT) {
            deposit({
                transactionId: id,
                ...updatedData,
            }, {
                onSuccess: () => {
                    router.push("/dashboard/agents/wallet");
                },
            });
        };
        
        if (transaction.type == TransactionType.AGENT_WITHDRAWAL) {
            withdrawl({
                transactionId: id,
                ...updatedData,
            }, {
                onSuccess: () => {
                    router.push("/dashboard/agents/wallet");
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
