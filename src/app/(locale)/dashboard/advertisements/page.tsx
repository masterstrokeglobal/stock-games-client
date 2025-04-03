"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetAdvertisements } from "@/react-query/advertisment-queries";
import { Advertisement } from "@/models/advertisment";
import advertisementColumns from "@/columns/advertisment-columns";


const AdvertisementTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [active, setActive] = useState<string | "">("all");


    const { data, isSuccess, isFetching } = useGetAdvertisements({
        page: page,
        active: active === "all" ? undefined : active,
        search: search,
        limit: 10
    });

    const advertisements = useMemo(() => {
        if (isSuccess && data?.data?.companyBanners) {
            return Array.from(data.data.companyBanners).map(
                (item: any) => new Advertisement(item)
            );
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

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
                <h2 className="text-xl font-semibold">Advertisements</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-4">
                        <Select value={active} defaultValue="all" onValueChange={(val) => setActive(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value={"true"}>Active</SelectItem>
                                    <SelectItem value={"false"}>Inactive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Link href="/dashboard/advertisements/create">
                            <Button>
                                <Plus
                                    size={18}
                                    className="mr-2 bg-white text-primary p-px rounded-full"
                                />
                                Create Advertisement
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={advertisementColumns}
                    data={advertisements}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default AdvertisementTable;