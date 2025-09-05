"use client";

import LoadingScreen from "@/components/common/loading-screen";
import OperatorWalletBalance from "@/components/features/operator/operator-wallet-balance";
import { Button } from "@/components/ui/button";
import { useGetCurrentOperator } from "@/react-query/operator-queries";
import { History, ArrowRight } from "lucide-react";
import Link from "next/link";

const OperatorWalletPage = () => {
    const { data: operator, isLoading } = useGetCurrentOperator();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!operator?.id) {
        return (
            <div className="container-main max-w-6xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-gray-600 mt-2">Unable to load operator information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-main max-w-6xl mx-auto p-6">
            <header className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Wallet Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your operator wallet balance and transactions</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/operator-dashboard/wallet/transactions">
                            <Button variant="outline" className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                View All Transactions
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <OperatorWalletBalance operatorId={operator.id} />
            </main>
        </div>
    );
};

export default OperatorWalletPage;
