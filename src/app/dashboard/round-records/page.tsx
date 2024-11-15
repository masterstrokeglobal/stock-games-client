"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { RoundRecord } from "@/models/round-record";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetAllRoundRecords } from "@/react-query/round-record-queries";
import { SchedulerType } from "@/models/market-item";
import roundRecordColumns from "@/columns/round-records-columns";

type Props = {
    companyId?: string;
};

const RoundRecordTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | "">("");

    // Fetch all round records with pagination, search query, and filters
    const { data, isSuccess, isFetching } = useGetAllRoundRecords({
        page: page,
        search: search,
        type: type === "all" ? "" : type,
    });

    // Map the fetched data into RoundRecord model instances
    const roundRecords = useMemo(() => {
        if (isSuccess && data?.data?.roundRecords) {
            return Array.from(data.data.roundRecords).map(
                (record: any) => new RoundRecord(record)
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
                <h2 className="text-xl font-semibold">Round Records</h2>
                <div className="flex gap-5">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    {/* ShadCN Select for Scheduler Type Filter */}
                    <Select value={type} onValueChange={(val) => setType(val as SchedulerType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={SchedulerType.NSE}>NSE</SelectItem>
                                <SelectItem value={SchedulerType.CRYPTO}>Crypto</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={roundRecordColumns}
                    data={roundRecords}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default RoundRecordTable;
