"use client";

import DepositOperatorForm, { DepositOperatorFormValues } from "@/components/features/operator/deposit-form";
import OperatorInfoCard from "@/components/features/operator/operator-info-card";
import { useDepositOperatorWallet, useGetCurrentOperator, useGetOperatorById } from "@/react-query/operator-queries";
import { OperatorRole } from "@/models/operator";
// import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function DepositPage() {
    // const router = useRouter();
    const depositMutation = useDepositOperatorWallet();
    const { data: currentOperator, isLoading: isLoadingOperator } = useGetCurrentOperator();
    const params = useParams<{ id: string }>();
    const operatorId = parseInt(params.id);
    const { data: operator } = useGetOperatorById(operatorId);

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

    // UI guard: Agents cannot access deposit capability
    if (currentOperator && currentOperator.role === OperatorRole.AGENT) {
        return (
            <div className="container mx-auto py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-semibold">Unauthorized</h1>
                    <p className="text-gray-600 mt-2">Only Master and above can deposit to an operator wallet.</p>
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
                    operatorId={operatorId.toString()}
                    isLoading={depositMutation.isPending}
                    currentBalance={currentOperator?.operatorWallet?.balance || 0}
                />
            </div>
        </div>
    );
}
