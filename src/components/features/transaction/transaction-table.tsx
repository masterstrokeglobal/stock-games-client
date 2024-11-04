"use client";

import React, { useMemo, useState } from "react";
import { useGetAllTransactions } from "@/react-query/transactions-queries"; // Adjust import path as needed
import transactionColumns from "@/columns/transactions-columns"; // Adjust import path as needed
import DataTable from "@/components/ui/data-table-server"; // Import your DataTable component
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Props = {
    userId?: string;
};

const TransactionTable = ({ }: Props) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isSuccess, isFetching } = useGetAllTransactions({
        page: page,
        search: search,
    });

    const transactions = useMemo(() => {
        if (isSuccess && data?.data?.transactions) {
            return data.data.transactions; // Assuming this returns the correct transaction data array
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1; // Assuming 10 items per page
    }, [data, isSuccess]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Transactions</h2>
                <div className="relative min-w-60 flex-1">
                    <Search size={18} className="absolute top-2.5 left-2.5" />
                    <Input
                        placeholder="Search"
                        onChange={handleSearch}
                        className="pl-10"
                    />
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={transactionColumns}
                    data={transactions}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default TransactionTable;
