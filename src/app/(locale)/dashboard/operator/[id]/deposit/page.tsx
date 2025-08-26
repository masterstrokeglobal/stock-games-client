
"use client";

import DepositOperatorForm, { DepositOperatorFormValues } from "@/components/features/operator/deposit-form";
import OperatorInfoCard from "@/components/features/operator/operator-info-card";
import { COMPANYID } from "@/lib/utils";
import { useCompanyWalletByCompanyId } from "@/react-query/company-queries";
import { useDepositOperatorWallet, useGetOperatorById } from "@/react-query/operator-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function DepositPage() {
    const router = useRouter();
    const depositMutation = useDepositOperatorWallet();
    const params = useParams<{ id: string }>();
    const operatorId = parseInt(params.id);
    const { data: operator } = useGetOperatorById(operatorId);

    const {data} = useCompanyWalletByCompanyId({ companyId: COMPANYID.toString() });

    // Format wallet data for display
    const walletData = useMemo(() => ({
        balance: data?.balance,
        updatedAt: data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "-",
        id: data?.id || "-"
    }), [data]);


    const handleSubmit = async (data: DepositOperatorFormValues) => {
        try {
            await depositMutation.mutateAsync({
                operatorId: operatorId,
                amount: data.amount
            });
            router.push("/operator-dashboard");
        } catch (error) {
            console.error("Failed to deposit:", error);
        }
    };


    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Deposit to Operator Wallet</h1>
                    <p className="text-gray-600 mt-2">
                        {`                        Transfer funds from your wallet to an operator's wallet
`}                    </p>
                </div>
                {operator && <OperatorInfoCard operator={operator} />}

                <DepositOperatorForm
                    onSubmit={handleSubmit}
                    operatorId={params.id}
                    isLoading={depositMutation.isPending}
                    currentBalance={walletData.balance ?? 0}
                />
            </div>
        </div>
    );
}
