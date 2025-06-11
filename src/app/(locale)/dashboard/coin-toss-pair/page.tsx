
"use client";

import coinTossPairColumns from "@/columns/coin-toss-pair-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetCoinTossPairs } from "@/react-query/coin-toss-queries";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const CoinTossPairTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filter] = useState("all");

    const { data, isFetching } = useGetCoinTossPairs({
        page: page,
        status: filter === "all" ? undefined : filter,
        search: search,
        limit: 10,
    });


    const totalPages = useMemo(() => {
        return Math.ceil(data?.count / 10) || 1;
    }, [data]);

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
                <h2 className="text-xl font-semibold">Coin Toss Pairs</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search by pair name or symbol"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/coin-toss-pair/create">
                        <Button>Create Pair</Button>
                    </Link>     
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={coinTossPairColumns}
                    data={data?.data}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default CoinTossPairTable;