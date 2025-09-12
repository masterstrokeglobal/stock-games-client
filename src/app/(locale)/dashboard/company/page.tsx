"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import companyColumns from "@/columns/company-columns"; // You'll need to create this
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetAllCompanies } from "@/react-query/company-queries"; // You'll need to create this
import { Company } from "@/models/company";

const CompanyTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const { data, isSuccess, isFetching } = useGetAllCompanies({
        page: page,
        search: search,
    });

    const companies = useMemo(() => {
        if (isSuccess && data?.data?.companies) {
            return Array.from(data.data.companies).map(
                (company: any) => new Company(company)
            );
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
                <h2 className="text-xl font-semibold">Companies</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/company/create">
                        <Button>
                            <Plus
                                size={18}
                                className="mr-2 bg-white text-primary p-px rounded-full"
                            />
                            Create Company
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4 max-w-[calc(100vw-280px)]">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={companyColumns}
                    data={companies}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default CompanyTable;