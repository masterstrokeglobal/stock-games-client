"use client";

import TransactionTable from "@/components/features/gamer/wallet/transaction-list";
import Pagination from "@/components/ui/game-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction, TransactionType } from "@/models/transaction";
import { useGetUserTransactions } from "@/react-query/payment-queries";
import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useMemo, useState } from "react";

const TransactionHistoryPage = () => {
    const [page, setPage] = useState(1);
    const t = useTranslations('transaction-history');
    const [transactionType, setTransactionType] = useState<TransactionType>(
        TransactionType.DEPOSIT
    );

    const { data, isSuccess, isLoading, error } = useGetUserTransactions({
        type: transactionType,
        page: page,
        pageSize: 10
    });

    const handleTabChange = (value: string) => {
        setTransactionType(value as TransactionType);
    };

    const {transactions, totalPages} = useMemo(() => {
        if (!isSuccess) return {transactions: [], totalPages: 0};
        return {
            transactions: data.data.transactions.map((transaction: any) => new Transaction(transaction)),
            totalPages: Math.ceil(data.data.count/10)
        };
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
                    <>
                        <TransactionTable transactions={transactions}  />
                        <Pagination totalPage={totalPages} page={page} className="w-fit mx-auto mt-2" changePage={(page) => setPage(page)} />
                    </>
                )}
            </Tabs>
        </section>
    );
};

export default TransactionHistoryPage;