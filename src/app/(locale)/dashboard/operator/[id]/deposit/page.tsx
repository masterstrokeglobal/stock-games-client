
"use client";

import DepositOperatorForm, { DepositOperatorFormValues } from "@/components/features/operator/deposit-form";
import OperatorInfoCard from "@/components/features/operator/operator-info-card";
import { COMPANYID } from "@/lib/utils";
import { useCompanyWalletByCompanyId } from "@/react-query/company-queries";
import { useDepositOperatorWallet, useGetCurrentOperator, useGetOperatorById } from "@/react-query/operator-queries";
import { AdminRole } from "@/models/admin";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

export default function DepositPage() {
    // const router = useRouter();
    const depositMutation = useDepositOperatorWallet();
    const params = useParams<{ id: string }>();
    const operatorId = parseInt(params.id);
    const { data: operator } = useGetOperatorById(operatorId);
    const { data: currentOperator } = useGetCurrentOperator();

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
            toast.success("Deposit successful");
            // router.refresh(); // uncomment if you want to refresh data without leaving the page
        } catch (error: any) {
            console.error("Failed to deposit:", error);
            const message = error?.response?.data?.message || "Failed to deposit. Please try again.";
            toast.error(message);
        }
    };


    // UI guard: Only company admin on this route
    if (currentOperator && (currentOperator as any).role && (currentOperator as any).role !== AdminRole.COMPANY_ADMIN) {
        return (
            <div className="container mx-auto py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-semibold">Unauthorized</h1>
                    <p className="text-gray-600 mt-2">Only Company Admin can deposit to operator wallets from admin route.</p>
                </div>
            </div>
        );
    }

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
