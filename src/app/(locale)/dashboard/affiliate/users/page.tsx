"use client";
import { affiliateUserColumns } from "@/columns/user-columns";
import AffiliateBreadcrumb from "@/components/features/affiliate/affiliate-breadcrumb";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import User from "@/models/user";
import { useGetAffiliateUsers } from "@/react-query/affiliate-queries";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
const UserTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [orderByField, setOrderByField] = useState("createdAt");
    const [orderBy, setOrderBy] = useState("DESC");
    const searchParams = useSearchParams();
    const affiliateId = searchParams.get("affiliateId");

    const { data, isSuccess, isFetching } = useGetAffiliateUsers({
        page,
        search,
        orderByField,
        orderBy,
        affiliateId: affiliateId ? parseInt(affiliateId) : undefined,
    });

    const users = useMemo(() => {
        if (isSuccess && data?.data?.users) {
            return Array.from(data.data.users).map((user: any) => new User(user));
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleFieldChange = (value: string) => {
        setOrderByField(value);
        setPage(1);
    };

    const handleOrderChange = (value: string) => {
        setOrderBy(value);
        setPage(1);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            {affiliateId && (
                <div className="mb-4 mt-20">
                    <AffiliateBreadcrumb affiliateId={affiliateId} />
                </div>
            )}
            <header className={cn("flex flex-col md:flex-row gap-4 flex-wrap md:items-center mt-20 justify-between", affiliateId && "mt-2")}>
                <h2 className="text-xl font-semibold">Users</h2>
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Select
                            value={orderByField}
                            onValueChange={handleFieldChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by field" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="createdAt">Created Date</SelectItem>
                                    <SelectItem value="firstname"> Name</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Select
                            value={orderBy}
                            onValueChange={handleOrderChange}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="ASC">Ascending</SelectItem>
                                    <SelectItem value="DESC">Descending</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={affiliateUserColumns}
                    data={users}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default UserTable;