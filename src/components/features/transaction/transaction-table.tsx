"use client";

import transactionColumns from "@/columns/transactions-columns"; // You'll need to create this
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
import { useAuthStore } from "@/context/auth-context";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { useGetAllTransactions } from "@/react-query/transactions-queries"; // You'll need to create this
import dayjs from "dayjs";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import CompanySelect from "./company-select";
import Admin from "@/models/admin";
import { cn } from "@/lib/utils";

type Props = {
    userId?: string;
    className?: string;
};

// Filter Type Definition
type Filter = {
    timeFrom: string;
    timeTo: string;
};

const TransactionTable = ({ userId, className }: Props) => {
    const [page, setPage] = useState(1);
    const { userDetails } = useAuthStore();
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | "">("");
    const [status, setStatus] = useState<string | "">("");
    const [companyId, setCompanyId] = useState<string>("all");
    const [filter, setFilter] = useState<Filter>({
        timeFrom: dayjs().startOf("day").toISOString(),
        timeTo: dayjs().endOf("day").toISOString(),
    });

    
    const user = userDetails as Admin;
    const { data, isSuccess, isLoading } = useGetAllTransactions({
        page: page,
        search: search,
        limit: limit,
        type: type === "all" ? "" : type,
        companyId: companyId === "all" ? "" : companyId,
        userId: userId,
        status: status === "all" ? "" : status,
        startDate: filter.timeFrom,
        endDate: filter.timeTo,
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
        return Math.ceil(data?.data?.count / limit) || 1;
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
                <h2 className="text-xl font-semibold mb-6">Transactions</h2>
                {user.isSuperAdmin && (
                    <CompanySelect setCompanyId={setCompanyId} companyId={companyId} />
                )}
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

                    {/* Time Filters */}
                    <Input
                        type="datetime-local"
                        className="ml-auto w-fit"
                        value={dayjs(filter.timeFrom).format("YYYY-MM-DDTHH:mm")}
                        onChange={(e) => {
                            setPage(1);
                            setFilter({
                                ...filter,
                                timeFrom: dayjs(e.target.value).toISOString(), // Convert local time to UTC
                            });
                        }}
                    />
                    <span>to</span>
                    <Input
                        type="datetime-local"
                        className="w-fit"
                        value={dayjs(filter.timeTo).format("YYYY-MM-DDTHH:mm")}
                        onChange={(e) => {
                            setPage(1);
                            setFilter({
                                ...filter,
                                timeTo: dayjs(e.target.value).toISOString(), // Convert local time to UTC
                            });
                        }}
                    />

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
