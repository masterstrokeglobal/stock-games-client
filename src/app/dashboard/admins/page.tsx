"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import adminColumns from "@/columns/admin-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetAllAdmins } from "@/react-query/admin-queries";
import Admin from "@/models/admin";

const AdminTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isSuccess, isFetching } = useGetAllAdmins({
        page: page,
        search: search,
    });

    const admins = useMemo(() => {
        if (isSuccess && data?.data?.admins) {
            return Array.from(data.data.admins).map(
                (admin: any) => new Admin(admin)
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
                <h2 className="text-xl font-semibold">Admins</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/admins/create">
                        <Button>
                            <Plus
                                size={18}
                                className="mr-2 bg-white text-primary p-px rounded-full"
                            />
                            Create Admin
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={adminColumns}
                    data={admins}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default AdminTable;