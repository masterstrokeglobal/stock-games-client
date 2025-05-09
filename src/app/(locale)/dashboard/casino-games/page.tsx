"use client";

import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";

import casinoGamesColumns from "@/columns/casino-games";
import { useGetCasinoGames } from "@/react-query/casino-games-queries";
import { GameCategory, ProviderEnum } from "@/models/casino-games";
import { ComboboxSelect } from "@/components/ui/combobox";

const providerOptions = Object.values(ProviderEnum).map((provider) => ({
    label: provider.split("_").join(" ").charAt(0).toUpperCase() + provider.split("_").join(" ").slice(1),
    value: provider.toLowerCase()
})).sort((a, b) => a.label.localeCompare(b.label));

providerOptions.unshift({
    label: "All",
    value: "all"
})


const CasinoGames = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [provider, setProvider] = useState<string>("all");


    const { data, isFetching } = useGetCasinoGames({
        page: page,
        search: search,
        limit: 10,
        category: provider === "all" ? undefined : provider as GameCategory
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); 
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    const totalPage = Math.ceil(data?.count ? data.count / 10 : 1);

    console.log(totalPage, data?.count)
    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Casino Games</h2>
                <div className="flex gap-5 items-center ">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>

                    <ComboboxSelect 
                        options={providerOptions}
                        defaultValue={provider?.toString()}
                        placeholder="Select Provider"
                        value={provider?.toString()}
                        className="w-40"
                        onValueChange={(value) => setProvider(value as ProviderEnum) }
                    />


                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={casinoGamesColumns}
                    data={data?.games || []}
                    totalPage={totalPage}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default CasinoGames;