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


const CategoryOptions = Object.values(GameCategory).map((category) => ({
    label: category.split("_").join(" ").charAt(0).toUpperCase() + category.split("_").join(" ").slice(1),
    value: category.toLowerCase()
})).sort((a, b) => a.label.localeCompare(b.label));

CategoryOptions.unshift({
    label: "All",
    value: "all"
})



const CasinoGames = () => {

    const [filter, setFilter] = useState<{
        search: string;
        provider: string;
        category: string;
        page: number;
    }>({
        search: "",
        provider: "all",
        category: "all",
        page: 1
    });


    const { data, isFetching } = useGetCasinoGames({
        page: filter.page,
        search: filter.search,
        limit: 10,
        provider: filter.provider === "all" ? undefined : filter.provider as ProviderEnum,
        category: filter.category === "all" ? undefined : filter.category as GameCategory
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, search: e.target.value });
    };

    const changePage = (newPage: number) => {
        setFilter({ ...filter, page: newPage });
    };

    const totalPage = Math.ceil(data?.count ? data.count / 10 : 1);

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
                        defaultValue={filter.provider?.toString()}
                        placeholder="Select Provider"
                        value={filter.provider?.toString()}
                        className="w-40"
                        onValueChange={(value) => setFilter({ ...filter, provider: value as ProviderEnum })}
                    />

                    <ComboboxSelect
                        options={CategoryOptions}
                        defaultValue={filter.category?.toString()}
                        placeholder="Select Category"
                        value={filter.category?.toString()}
                        onValueChange={(value) => setFilter({ ...filter, category: value as GameCategory })}
                        className="w-40"
                    />


                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={filter.page}
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