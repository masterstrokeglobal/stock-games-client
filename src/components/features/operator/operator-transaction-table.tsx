"use client";

import operatorTransactionColumns from "@/columns/operator-transactions-columns";
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
import { TransactionStatus, TransactionType } from "@/models/transaction";
import { useGetOperatorTransactions } from "@/react-query/operator-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

type Props = {
    operatorId: number;
    className?: string;
};


const OperatorTransactionTable = ({ operatorId, className }: Props) => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | "">("");
    const [status, setStatus] = useState<string | "">("");


    // Use the operator ID from props or get from user details
    const currentOperatorId = operatorId;

    const { data, isSuccess, isLoading } = useGetOperatorTransactions({
        operatorId: currentOperatorId,
        page: page,
        search,
        type,
        status,
        limit: limit,
    });

    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return Math.ceil(data?.count / limit) || 1;
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

    return (
        <section className={cn("container-main min-h-[60vh] my-12", className)}>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-6">Operator Transactions</h2>
            </div>
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <div className="flex gap-5 w-full items-center ">
                    <div className="relative min-w-60 max-w-sm flex-1">
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
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={TransactionType.DEPOSIT}>Deposit</SelectItem>
                                <SelectItem value={TransactionType.PLACEMENT}>Placement</SelectItem>
                                <SelectItem value={TransactionType.WINNING}>Winning</SelectItem>
                                <SelectItem value={TransactionType.WITHDRAWAL}>Withdrawal</SelectItem>
                                <SelectItem value={TransactionType.POINTS_EARNED}>Points Earned</SelectItem>
                                <SelectItem value={TransactionType.POINTS_REDEEMED}>Points Redeemed</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>


                    {/* ShadCN Select for Status Filter */}
                    <Select value={status} onValueChange={(val) => {
                        setStatus(val as TransactionStatus)
                        setPage(1);
                    }} >
                        <SelectTrigger className="w-fit">
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

                    {/* limit the number of transactions to 100 */}
                    <Select value={limit.toString()} onValueChange={(val) => {
                        setLimit(parseInt(val))
                        setPage(1);
                    }} >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
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
                    columns={operatorTransactionColumns}
                    data={data?.data}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default OperatorTransactionTable;
