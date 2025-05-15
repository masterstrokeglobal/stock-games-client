"use client";

import LedgerColumns from "@/columns/ledger-column";
import LedgerReport from "@/components/features/ledger/ledger-report";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetAllLedgerEntries } from "@/react-query/ledger-queries";
import { Search } from "lucide-react";
import Link from "next/link";
import { useQueryStates } from "nuqs";

const CompanyProfitLoss = () => {
    const [queryState, setQueryState] = useQueryStates({
        page: { defaultValue: "1", parse: (value) => parseInt(value), serialize: (value) => value.toString() },
        limit: { defaultValue: "10", parse: (value) => parseInt(value), serialize: (value) => value.toString() },
        search: { defaultValue: "", parse: (value) => value, serialize: (value) => value },
        companyIdFilter: { defaultValue: "", parse: (value) => value, serialize: (value) => value }
    });

    const { data, isLoading } = useGetAllLedgerEntries({
        page: queryState.page || 1,
        limit: queryState.limit || 10,
        companyIdFilter: queryState.companyIdFilter || undefined,
        search: queryState.search,
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQueryState({
            ...queryState,
            search: e.target.value,
            page: 1 // Reset to first page on search
        });
    };

    const changePage = (newPage: number) => {
        setQueryState({
            ...queryState,
            page: newPage
        });
    };


    return (
        <section className="container-main min-h-[60vh] my-12 space-y-6">
            <LedgerReport companyId={queryState.companyIdFilter || ""} />
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold"> Company Ledger</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            value={queryState.search}
                            className="pl-10"
                        />
                    </div>
                    <Link href={`/dashboard/company-ledger/create?companyId=${queryState.companyIdFilter}`}>
                        <Button>Create Entry</Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={queryState.page || 1}
                    loading={isLoading}
                    columns={LedgerColumns}
                    data={data?.ledger || []}
                    totalPage={data?.count || 1}
                    changePage={changePage}
                />
            </main>
        </section>
    );
}
export default CompanyProfitLoss;