"use client";

import { profitLossColumns } from "@/columns/profit-loss-columns";
import LedgerReport from "@/components/features/ledger/ledger-report";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { GetCompanyProfitLossFilters } from "@/lib/axios/payment-API";
import { useGetCompanyDailyProfitLoss, } from "@/react-query/payment-queries";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const CompanyProfitLoss = () => {

    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyIdFilter');

    const [filters, setFilters] = useState<GetCompanyProfitLossFilters>({
        page: 1,
        limit: 10,
        startDate: dayjs().startOf('month').toDate(),
        endDate: dayjs().endOf('month').toDate(),
        companyIdFilter: parseInt(companyId ?? "0")
    });


    const { data, isLoading } = useGetCompanyDailyProfitLoss({
        ...filters,
        startDate: dayjs(filters.startDate).startOf('day').toDate(),
        endDate: dayjs(filters.endDate).endOf('day').toDate(),
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value });
    }

    const changePage = (newPage: number) => {
        setFilters({ ...filters, page: newPage });
    }

    return (
        <section className="container-main min-h-[60vh] my-12 space-y-12">
            <LedgerReport companyId={companyId?.toString()} />
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold"> Daily Profit Loss</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Input type="date" value={dayjs(filters.startDate).format('YYYY-MM-DD')} onChange={(e) => setFilters({ ...filters, startDate: new Date(e.target.value) })} />
                        <Input type="date" value={dayjs(filters.endDate).format('YYYY-MM-DD')} onChange={(e) => setFilters({ ...filters, endDate: new Date(e.target.value) })} />
                    </div>

                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={filters.page}
                    loading={isLoading}
                    columns={profitLossColumns}
                    data={data?.profitLoss ?? []}
                    totalPage={data?.count ?? 1}
                    changePage={changePage}
                />
            </main>
        </section>

    )
}
export default CompanyProfitLoss;
