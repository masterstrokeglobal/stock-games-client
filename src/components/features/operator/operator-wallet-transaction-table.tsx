"use client";

import operatorWalletTransactionColumns from "@/columns/operator-wallet-transaction-columns";
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
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetOperatorWalletTransactions } from "@/react-query/operator-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

type Props = {
    operatorId: number;
    className?: string;
};

const OperatorWalletTransactionTable = ({ operatorId, className }: Props) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | "">("");
    const [status, setStatus] = useState<string | "">("");

    const { data, isSuccess, isLoading } = useGetOperatorWalletTransactions({
        operatorId: operatorId,
        page: page,
        limit: limit,
        // Note: Add search, type, status to API call once backend supports filtering
    });

    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return Math.ceil((data?.count || 0) / limit) || 1;
    }, [data, isSuccess, limit]);

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    // Change page when pagination controls are used
    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    // Filter data locally if API doesn't support server-side filtering yet
    const filteredData = useMemo(() => {
        if (!data?.data) return [];
        
        let filtered = data.data;
        
        // Filter by search term (operator name, description)
        if (search) {
            filtered = filtered.filter((transaction: any) =>
                transaction.description?.toLowerCase().includes(search.toLowerCase()) ||
                transaction.fromOperator?.name?.toLowerCase().includes(search.toLowerCase()) ||
                transaction.toOperator?.name?.toLowerCase().includes(search.toLowerCase()) ||
                transaction.pgId?.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        // Filter by type
        if (type && type !== "all") {
            filtered = filtered.filter((transaction: any) => transaction.type === type);
        }
        
        // Filter by status
        if (status && status !== "all") {
            filtered = filtered.filter((transaction: any) => transaction.status === status);
        }
        
        return filtered;
    }, [data?.data, search, type, status]);

    return (
        <section className={cn("container-main min-h-[60vh] my-12", className)}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-6">Wallet Transactions</h2>
            </div>
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <div className="flex gap-5 w-full items-center">
                    <div className="relative min-w-60 max-w-sm flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search transactions..."
                            onChange={handleSearch}
                            className="pl-10"
                            value={search}
                        />
                    </div>

                    {/* Type Filter */}
                    <Select value={type} onValueChange={(val) => {
                        setType(val);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Transaction Type</SelectLabel>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="operator_deposit">Operator Deposit</SelectItem>
                                <SelectItem value="wallet_recharge">Wallet Recharge</SelectItem>
                                <SelectItem value="transfer_in">Transfer In</SelectItem>
                                <SelectItem value="transfer_out">Transfer Out</SelectItem>
                                <SelectItem value="company_recharge">Company Recharge</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select value={status} onValueChange={(val) => {
                        setStatus(val);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Status</SelectLabel>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Limit selector */}
                    <Select value={limit.toString()} onValueChange={(val) => {
                        setLimit(parseInt(val));
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isLoading}
                    columns={operatorWalletTransactionColumns}
                    data={filteredData}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default OperatorWalletTransactionTable;
