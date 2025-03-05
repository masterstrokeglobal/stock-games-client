"use client";

import agentWalletTransactionColumns from "@/columns/agent-wallet-transaction-columns";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // Import ShadCN Select components
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { useGetAgentTransactions } from "@/react-query/agent-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";



const TransactionTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<TransactionType | "all">("all");
    const [status, setStatus] = useState<string | "">("");


    const requestType = type === "all" ? [TransactionType.AGENT_DEPOSIT, TransactionType.AGENT_WITHDRAWAL, TransactionType.WITHDRAWAL, TransactionType.DEPOSIT].join(",") : type;
    // Fetch all transactions with pagination, search query, and filters

    const { data, isSuccess, isFetching } = useGetAgentTransactions({
        page: page,
        search: search,
        type: requestType,
        status: status === "all" ? undefined : status,
    });

    const transactions = useMemo(() => {
        if (isSuccess && data?.data?.transactions) {
            return Array.from(data.data.transactions).map(
                (transaction: any) => new Transaction(transaction)
            );
        }
        return [];
    }, [data, isSuccess]);

    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    // Change page when pagination controls are used
    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Agent Wallet Transactions</h2>
                <div className="flex gap-5 ">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    {/* ShadCN Select for Type Filter */}
                    <Select value={type} onValueChange={(val) => {
                        setType(val as TransactionType)
                        setPage(1);
                    }} >
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value={"all"}>All</SelectItem>
                                <SelectItem value={TransactionType.AGENT_WITHDRAWAL}>
                                    Agent Withdrawal
                                </SelectItem>
                                <SelectItem value={TransactionType.AGENT_DEPOSIT}>
                                    Agent Deposit
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* ShadCN Select for Status Filter */}
                    <Select value={status} onValueChange={(val) => {
                        setStatus(val as TransactionStatus)
                        setPage(1);
                    }} >
                        <SelectTrigger>
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value={TransactionStatus.PENDING}>Pending</SelectItem>
                                <SelectItem value={TransactionStatus.COMPLETED}>Completed</SelectItem>
                                <SelectItem value={TransactionStatus.FAILED}>Failed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={agentWalletTransactionColumns}
                    data={transactions}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default TransactionTable;
