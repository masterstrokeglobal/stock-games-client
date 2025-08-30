"use client";

import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useState } from "react";
import casinoGamesColumns from "@/columns/casino-games";
import { useGetCasinoGames } from "@/react-query/casino-games-queries";
import { GameCategory, GameTypeEnum, ProviderCompany, ProviderEnum } from "@/models/casino-games";
import { ComboboxSelect } from "@/components/ui/combobox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const providerOptions: { label: string, value: string }[] = Object.values(ProviderEnum).map((provider) => ({
    label: provider.split("_").join(" ").charAt(0).toUpperCase() + provider.split("_").join(" ").slice(1),
    value: provider
})).sort((a, b) => a.label.localeCompare(b.label));

providerOptions.unshift({
    label: "All",
    value: "all"
})


const CategoryOptions: { label: string, value: string }[] = Object.values(GameCategory).map((category) => ({
    label: category.split("_").join(" ").charAt(0).toUpperCase() + category.split("_").join(" ").slice(1),
    value: category
})).sort((a, b) => a.label.localeCompare(b.label));

CategoryOptions.unshift({
    label: "All",
    value: "all"
})


const typeOptions: { label: string, value: string }[] = Object.values(GameTypeEnum).map((type) => ({
    label: type.split("_").join(" ").charAt(0).toUpperCase() + type.split("_").join(" ").slice(1),
    value: type
})).sort((a, b) => a.label.localeCompare(b.label));

typeOptions.unshift({
    label: "All",
    value: "all"
})



const CasinoGames = () => {

    const [filter, setFilter] = useState<{
        search: string;
        provider: string;
        category: string;
        type: string;
        page: number;
        limit: number;
    }>({
        search: "",
        provider: "all",
        category: "all",
        type: "all",
        page: 1,
        limit: 10
    });


    const { data, isFetching } = useGetCasinoGames({
        page: filter.page,
        search: filter.search,
        limit: filter.limit,
        type: filter.type === "all" ? undefined : filter.type as GameTypeEnum,
        provider: filter.provider === "all" ? undefined : filter.provider as ProviderEnum,
        category: filter.category === "all" ? undefined : filter.category as GameCategory
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, search: e.target.value, page: 1 });
    };

    const changePage = (newPage: number) => {
        setFilter({ ...filter, page: newPage });
    };

    const totalPage = Math.ceil(data?.count ? data.count / filter.limit : 1);

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
                        className="min-w-40"
                        onValueChange={(value) => setFilter({ ...filter, provider: value as ProviderEnum, page: 1 })}
                    />

                    <ComboboxSelect
                        options={CategoryOptions}
                        defaultValue={filter.category?.toString()}
                        placeholder="Select Category"
                        value={filter.category?.toString()}
                        onValueChange={(value) => setFilter({ ...filter, category: value as GameCategory, page: 1 })}
                        className="min-w-40"
                    />

                    <ComboboxSelect
                        options={typeOptions}
                        defaultValue={filter.type?.toString()}
                        placeholder="Select Type"
                        value={filter.type?.toString()}
                        onValueChange={(value) => setFilter({ ...filter, type: value as GameTypeEnum, page: 1 })}
                        className="min-w-40"
                    />
                    <Select onValueChange={(value) => setFilter({ ...filter, limit: parseInt(value) })} value={filter.limit.toString()}>
                        <SelectTrigger className="w-24">
                            <SelectValue placeholder="Select Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Limit</SelectLabel>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Provider</SelectLabel>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value={ProviderCompany.GAP}>Gap</SelectItem>
                                <SelectItem value={ProviderCompany.QTECH}>Qtech</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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