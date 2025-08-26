"use client";

import DepositOperatorForm, { DepositOperatorFormValues } from "@/components/features/operator/deposit-form";
import { useDepositOperatorWallet, useGetCurrentOperator } from "@/react-query/operator-queries";
import { useRouter } from "next/navigation";

export default function DepositPage() {
    const router = useRouter();
    const depositMutation = useDepositOperatorWallet();
    const { data: currentOperator, isLoading: isLoadingOperator } = useGetCurrentOperator();

    const handleSubmit = async (data: DepositOperatorFormValues) => {
        try {
            await depositMutation.mutateAsync({
                operatorId: parseInt(currentOperator?.id?.toString() || "0"),
                amount: data.amount
            });
            router.push("/operator-dashboard");
        } catch (error) {
            console.error("Failed to deposit:", error);
        }
    };

    if (isLoadingOperator) {
        return (
            <div className="container mx-auto py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
                        <div className="h-32 bg-gray-200 rounded mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
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

                <DepositOperatorForm
                    onSubmit={handleSubmit}
                    operatorId={currentOperator?.id?.toString() || "N/A"}
                    isLoading={depositMutation.isPending}
                    currentBalance={currentOperator?.operatorWallet?.balance || 0}
                />
            </div>
        </div>
    );
}
