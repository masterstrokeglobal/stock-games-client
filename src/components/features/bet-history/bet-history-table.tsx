"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import betHistoryColumns from "@/columns/bet-history-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetBetHistory } from "@/react-query/bet-history-queries";
import { BetHistory } from "@/models/bet-history";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import CompanySelect from "@/components/features/transaction/company-select";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

const GAME_TYPES = [
    { label: "All Games", value: "all" },
    { label: "Dice", value: "dice" },
    { label: "Head & Tail", value: "head_tail" },
    { label: "Seven Up Down", value: "seven_up_down" },
    { label: "Wheel of Fortune", value: "wheel_of_fortune" },
    { label: "Aviator", value: "aviator" },
    { label: "Guess Game", value: "guess_game" },
    { label: "Stock Slots", value: "stock_slots" },
    { label: "Stock Jackpot", value: "stock_jackpot" },
    { label: "Derby", value: "derby" },
    { label: "Casino", value: "casino" },
];

interface BetHistoryTableProps {
    userId?: number;
    className?: string;
}

const BetHistoryTable = ({ userId, className }: BetHistoryTableProps) => {
    const { userDetails } = useAuthStore();
    const admin = userDetails as Admin;

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [companyId, setCompanyId] = useState<string>("all");
    const [gameType, setGameType] = useState<string>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Helper function to adjust end date for API (add 1 day for inclusive filtering)
    const getAdjustedEndDate = (endDate: string) => {
        if (!endDate || endDate.trim() === "") return endDate;
        const date = new Date(endDate);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    // Debounce search input
    const debouncedSearch = useDebounce(searchInput, 300);

    // Update search when debounced value changes
    useEffect(() => {
        setSearch(debouncedSearch);
        setPage(1);
    }, [debouncedSearch]);

    // Build filters
    const filters = useMemo(() => {
        const filterObj: any = {
            page,
            limit: 10,
        };

        if (userId) {
            filterObj.userId = userId;
        }

        if (search) {
            if (!isNaN(Number(search))) {
                filterObj.userId = Number(search);
            } else {
                filterObj.username = search;
            }
        }

        if (companyId && companyId !== "all") {
            filterObj.companyId = Number(companyId);
        }

        if (gameType && gameType !== "all") {
            filterObj.gameType = gameType;
        }

        // Only add date filters if they are set
        if (startDate && startDate.trim() !== "") {
            filterObj.startDate = startDate;
        }

        if (endDate && endDate.trim() !== "") {
            filterObj.endDate = getAdjustedEndDate(endDate); // Add 1 day for inclusive filtering
        }

        return filterObj;
    }, [page, userId, search, companyId, gameType, startDate, endDate]);

    const { data, isSuccess, isFetching } = useGetBetHistory(filters);

    const betHistory = useMemo(() => {
        if (isSuccess && data?.data?.data) {
            return data.data.data.map((bet: any) => new BetHistory(bet));
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        const limit = filters.limit || 10;
        // Handle both pagination object and count field
        if (isSuccess && data?.data?.pagination?.totalPages) {
            return data.data.pagination.totalPages;
        }
        if (isSuccess && data?.data?.pagination?.total) {
            return Math.ceil(data.data.pagination.total / (data.data.pagination.limit || limit));
        }
        if (isSuccess && data?.data?.count) {
            return Math.ceil(data.data.count / limit);
        }
        return 1;
    }, [data, isSuccess, filters.limit]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow alphanumeric characters and empty string
        if (value === '' || /^[a-zA-Z0-9.]+$/.test(value)) {
            setSearchInput(value);
        }
    };

    // No need to restrict keydown events since we're allowing alphanumeric input
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // No restrictions needed for alphanumeric input
        console.log(e.key);
    };

    const handleReset = () => {
        setSearchInput("");
        setSearch("");
        setCompanyId("all");
        setGameType("all");
        setStartDate("");
        setEndDate("");
        setPage(1);
    };

    return (
        <section className={cn("container-main min-h-[60vh] my-12", className)}>
            <header className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Bet History</h2>
                    {admin?.isSuperAdmin && (
                        <CompanySelect 
                            setCompanyId={setCompanyId} 
                            companyId={companyId} 
                        />
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 flex-wrap items-center">
                    {/* Search by User ID */}
                    {!userId && (
                        <div className="relative min-w-60 flex-1">
                            <Search size={18} className="absolute top-2.5 left-2.5" />
                            <Input
                                placeholder="Search by User ID or Username"
                                value={searchInput}
                                onChange={handleSearch}
                                onKeyDown={handleKeyDown}
                                className="pl-10"
                            />
                        </div>
                    )}

                    {/* Game Type Filter */}
                    <Select
                        value={gameType}
                        onValueChange={(value) => {
                            setGameType(value);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Game Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {GAME_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Date Range Filters */}
                    <Input
                        type="date"
                        className="w-fit"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            setPage(1);
                        }}
                    />
                    <span className="text-sm text-gray-500">to</span>
                    <Input
                        type="date"
                        className="w-fit"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => {
                            setEndDate(e.target.value);
                            setPage(1);
                        }}
                    />

                    {/* Reset Button */}
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="ml-auto"
                    >
                        Reset Filters
                    </Button>
                </div>

            </header>

            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={betHistoryColumns}
                    data={betHistory}
                    totalPage={totalPages}
                    changePage={setPage}
                />
            </main>
        </section>
    );
};

export default BetHistoryTable;

