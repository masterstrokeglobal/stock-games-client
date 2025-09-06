"use client";

import LoadingScreen from "@/components/common/loading-screen";
import OperatorWalletTransactionTable from "@/components/features/operator/operator-wallet-transaction-table";
import { Button } from "@/components/ui/button";
import { useGetCurrentOperator } from "@/react-query/operator-queries";
import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";

const OperatorWalletTransactionsPage = () => {
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
                    <div className="flex items-center gap-4">
                        <Link href="/operator-dashboard/wallet">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Wallet
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Wallet Transaction History</h1>
                            <p className="text-gray-600 mt-1">View all wallet recharges, transfers and transactions</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/operator-dashboard/wallet">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                Wallet Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main>
                <OperatorWalletTransactionTable operatorId={operator.id} />
            </main>
        </div>
    );
};

export default OperatorWalletTransactionsPage;
