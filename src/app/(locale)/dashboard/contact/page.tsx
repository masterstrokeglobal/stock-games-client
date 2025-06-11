"use client";

import contactColumns from "@/columns/contact-columns";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Contact from "@/models/contact";
import { useGetContacts } from "@/react-query/contact-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

const ContactTable = () => {
    const [filters, setFilters] = useState<{
        search: string;
        status: string;
        startDate: Date;
        endDate: Date;
        page: number;
    }>({
        search: "",
        status: "all",
        startDate: new Date(new Date().setDate(1)), // First day of current month
        endDate: new Date(),
        page: 1
    });

    const { data, isLoading, isSuccess } = useGetContacts({
        page: filters.page,
        status: filters.status === "all" ? undefined : filters.status,
        search: filters.search || undefined,
        limit: 10,
        startDate: filters.startDate.toISOString().split('T')[0],
        endDate: filters.endDate.toISOString().split('T')[0],
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
    }, [data]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    };

    const changePage = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
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
                            value={filters.search}
                            className="pl-10"
                        />
                    </div>
                    <Input
                        type="date"
                        value={filters.startDate.toISOString().split('T')[0]}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: new Date(e.target.value), page: 1 }))}
                        className="w-[180px]"
                    />
                    <Input
                        type="date"
                        value={filters.endDate.toISOString().split('T')[0]}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: new Date(e.target.value), page: 1 }))}
                        className="w-[180px]"
                    />
                    <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}
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
                    page={filters.page}
                    loading={isLoading}
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