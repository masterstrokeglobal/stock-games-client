"use client";

import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";

import casinoGamesColumns from "@/columns/casino-games";
import { useGetCasinoGames } from "@/react-query/casino-games-queries";


const CasinoGames = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isFetching } = useGetCasinoGames({
        page: page,
        search: search,
        limit: 10
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); 
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Casino Games</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={casinoGamesColumns}
                    data={data?.games || []}
                    totalPage={data?.count || 0}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default CasinoGames;