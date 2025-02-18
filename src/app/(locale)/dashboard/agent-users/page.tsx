"use client";

import userColumns from "@/columns/user-columns"; // Adjust this import to match your project structure
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user"; // Import the User model
import { useGetAgentReferrals } from "@/react-query/agent-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

const UserTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { userDetails } = useAuthStore();

    const { data, isSuccess, isFetching } = useGetAgentReferrals({
        page: page,
        agentId: userDetails?.id,
        search: search,
    });

    const users = useMemo(() => {
        if (isSuccess && data?.data?.referrals) {
            return Array.from(data.data.referrals).map((user: any) => new User(user));
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
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
                <h2 className="text-xl font-semibold">Users</h2>
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
                    columns={userColumns}
                    data={users}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default UserTable;
