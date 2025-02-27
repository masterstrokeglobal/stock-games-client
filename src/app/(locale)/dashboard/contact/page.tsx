"use client";

import contactColumns from "@/columns/contact-columns";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Contact from "@/models/contact"; // You'll need to create this model
import { useGetContacts } from "@/react-query/contact-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

const ContactTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const { data, isSuccess, isFetching } = useGetContacts({
        page: page,
        status: filter === "all" ? undefined : filter,
        search: search,
        limit: 10,
    });

    const contacts = useMemo(() => {
        if (isSuccess && data?.data?.tickets) {
            return Array.from(data.data.tickets).map(
                (contact: any) => new Contact(contact)
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
        <section className="container-main min-h-[60vh] my-12  ">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Contact Queries</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search by name, email or subject"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Select
                        value={filter}
                        onValueChange={(value: string) => setFilter(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by field" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={contactColumns}
                    data={contacts}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default ContactTable;