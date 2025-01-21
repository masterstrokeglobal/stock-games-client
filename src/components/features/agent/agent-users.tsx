"use client";

import userColumns from "@/columns/user-columns";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import User from "@/models/user";
import { useGetAgentReferrals } from "@/react-query/agent-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

interface UserTableProps {
    agentId: string;
}

const AgentUserTable: React.FC<UserTableProps> = ({ agentId }) => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isSuccess, isFetching } = useGetAgentReferrals({
        page: page,
        agentId: agentId,
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

export default AgentUserTable;