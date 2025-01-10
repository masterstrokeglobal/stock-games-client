"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import marketItemColumns from "@/columns/market-items-columns"; // You'll need to create this
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetMarketItems } from "@/react-query/market-item-queries"; // You'll need to create this
import { MarketItem, SchedulerType } from "@/models/market-item";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const MarketItemTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | "">("all");
    const [active, setActive] = useState<string | "">("all");
    const [placementAllowed, setPlacementAllowed] = useState<string | "">("all");


    const { data, isSuccess, isFetching } = useGetMarketItems({
        page: page,
        type: type === "all" ? undefined : type,
        active: active === "all" ? undefined : active,
        placementAllowed: placementAllowed === "all" ? undefined : placementAllowed,
        search: search,
        limit: 10
    });

    const marketItems = useMemo(() => {
        if (isSuccess && data?.data?.marketItems) {
            return Array.from(data.data.marketItems).map(
                (item: any) => new MarketItem(item)
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
                <h2 className="text-xl font-semibold">Market Items</h2>
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

                        {/* ShadCN Select for Scheduler Type Filter */}
                        <Select value={type} defaultValue="all"  onValueChange={(val) => {
                            setType(val as SchedulerType)
                            setPage(1)
                        }}>
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

                        <Select value={active} defaultValue="all"  onValueChange={(val) => setActive(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All </SelectItem>
                                    <SelectItem value={"true"}>Active</SelectItem>
                                    <SelectItem value={"false"}>Inactive</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select value={placementAllowed} defaultValue="all" onValueChange={(val) => setPlacementAllowed(val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="all">All Horses</SelectItem>
                                    <SelectItem value={"false"}>Zero Position</SelectItem>
                                    <SelectItem value={"true"}> Non-Zero Positions</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Link href="/dashboard/market-items/create">
                            <Button>
                                <Plus
                                    size={18}
                                    className="mr-2 bg-white text-primary p-px rounded-full"
                                />
                                Create Market Item
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={marketItemColumns}
                    data={marketItems}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default MarketItemTable;
