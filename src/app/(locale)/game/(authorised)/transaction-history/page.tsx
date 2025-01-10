'use client';
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import TransactionTable from "@/components/features/gamer/wallet/transaction-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction, TransactionType } from "@/models/transaction";
import { useGetUserTransactions } from "@/react-query/payment-queries";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";


const TransactionHistoryPage = () => {
    const [transactionType, setTransactionType] = useState<TransactionType>(
        TransactionType.DEPOSIT
    );

    const { data, isSuccess, isLoading, error } = useGetUserTransactions({
        type: transactionType,
    });

    const handleTabChange = (value: string) => {
        setTransactionType(value as TransactionType);
    };

    const transactions = useMemo(() => {

        if (!isSuccess) return [];

        return data.data.transactions.map((transaction: any) => new Transaction(transaction));

    }, [data, isSuccess])


    return (
        <Container className="bg-primary-game relative flex flex-col pt-24 gap-12 items-center min-h-screen overflow-hidden">
            <img
                src="/top-gradient.svg"
                alt="Background gradient"
                className="w-full absolute z-0 top-0 h-auto"
                aria-hidden="true"
            />

            <TopBar>
                <h1 className="text-xl font-semibold">Transaction History</h1>
            </TopBar>

            <Tabs
                defaultValue="deposit"
                className="w-full relative z-10"
                onValueChange={handleTabChange}
            >
                <TabsList className="w-full h-13 p-2">
                    <TabsTrigger className="flex-1" value="deposit">
                        Deposits
                    </TabsTrigger>
                    <TabsTrigger className="flex-1" value="withdrawal">
                        Withdrawals
                    </TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        Failed to load transactions. Please try again later.
                    </div>
                ) : (
                    <TransactionTable transactions={transactions} />
                )}
            </Tabs>
        </Container>
    );
};

export default TransactionHistoryPage;
