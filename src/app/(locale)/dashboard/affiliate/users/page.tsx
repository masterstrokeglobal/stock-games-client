"use client";
import { AffiliateUser, affiliateUserColumns } from "@/columns/user-columns";
import AffiliateBreadcrumb from "@/components/features/affiliate/affiliate-breadcrumb";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue   } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useGetAffiliateUsers, useGetAffiliateUsersDownload } from "@/react-query/affiliate-queries";
import { Download, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
const UserTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [limit, setLimit] = useState(10); 

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const searchParams = useSearchParams();
    const affiliateId = searchParams.get("affiliateId");

    const { data, isSuccess, isFetching } = useGetAffiliateUsers({
        page,
        search,
        startDate,
        endDate,
        limit,
        affiliateId: affiliateId ? parseInt(affiliateId) : undefined,
    });

    const { mutate: downloadUsers } = useGetAffiliateUsersDownload({
        page,
        search,
        startDate,
        endDate,
        affiliateId: affiliateId ? parseInt(affiliateId) : undefined,
    });

    const users: AffiliateUser[] = useMemo(() => {
        if (isSuccess && data?.data?.data) {
            return Array.from(data.data.data);
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / limit) || 1;
    }, [data, isSuccess, limit]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    const handleDownload = () => {
        downloadUsers();
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

                    <div className="flex gap-2 items-center">
                        <Input type="date" onChange={(e) => setStartDate(new Date(e.target.value))} />
                        <span>to</span>
                        <Input type="date" onChange={(e) => setEndDate(new Date(e.target.value))} />
                    </div>
                    <Button onClick={handleDownload}>
                        <Download size={18} className="mr-2" />
                        Download
                    </Button>

                    <Select
                        value={limit.toString()}
                        onValueChange={(value) => setLimit(parseInt(value))}
                    >
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Select a limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
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