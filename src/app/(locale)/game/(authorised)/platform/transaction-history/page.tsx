"use client";

import TransactionTable from "@/components/features/gamer/wallet/transaction-list";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction, TransactionType } from "@/models/transaction";
import { useGetUserTransactions } from "@/react-query/payment-queries";
import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useMemo, useState } from "react";

const TransactionHistoryPage = () => {
    const t = useTranslations('transaction-history');
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
    }, [data, isSuccess]);

    return (
        <section className="w-full max-w-3xl mx-auto text-platform-text min-h-[calc(100vh-200px)] flex flex-col gap-4">
            <header className="flex flex-col gap-2 mb-4">
                <h1 className="text-xl font-semibold text-platform-text">{t('page-title')}</h1>
            </header>

            <Tabs
                defaultValue="deposit"
                className="w-full relative z-10"
                onValueChange={handleTabChange}
            >
                <TabsList className="grid w-full mb-4 grid-cols-2 bg-transparent border-2 dark:border-platform-border border-primary-game rounded-sm p-0 h-auto">
                    <TabsTrigger
                        value="deposit"
                        className="rounded-sm py-3 text-platform-text  bg-transparent data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] data-[state=active]:from-[#64B6FD] data-[state=active]:to-[#64B7FE] data-[state=active]:text-white data-[state=active]:border-r-2 dark:data-[state=active]:border-[#3B4BFF] data-[state=active]:border-[#64B7FE] border-transparent"
                    >
                        {t('tabs.deposits')}
                    </TabsTrigger>
                    <TabsTrigger
                        value="withdrawal"
                        className="rounded-sm py-3 text-platform-text  bg-transparent data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] data-[state=active]:from-[#64B6FD] data-[state=active]:to-[#64B7FE] data-[state=active]:text-white data-[state=active]:border-l-2 dark:data-[state=active]:border-[#3B4BFF] data-[state=active]:border-[#64B7FE] border-transparent"
                    >
                        {t('tabs.withdrawals')}
                    </TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-500">
                        {t('errors.load-failed')}
                    </div>
                ) : (
                    <TransactionTable transactions={transactions} />
                )}
            </Tabs>
        </section>
    );
};

export default TransactionHistoryPage;