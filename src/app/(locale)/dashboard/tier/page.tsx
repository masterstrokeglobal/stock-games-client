"use client"
import tierColumns from "@/columns/tier-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetTiers } from "@/react-query/tier-queries";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const TierPage = () => {
    const [filter, setFilter] = useState<SearchFilters>({
        page: 1,
        limit: 10,
        search: "",
        orderBy: "createdAt",
        orderByField: "DESC"
    });
    const { data: tiers, isLoading } = useGetTiers(filter);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter({ ...filter, search: e.target.value });
    }

    const changePage = (page: number) => {
        setFilter({ ...filter, page });
    }
    return (
        <section className="container-main min-h-[60vh] ">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Tiers</h2>
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/tier/create">
                        <Button>Create Tier</Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={filter.page}
                    loading={isLoading}
                    columns={tierColumns}
                    data={tiers?.tiers ?? []}
                    totalPage={tiers?.count ?? 1}
                    changePage={changePage}
                />
            </main>
        </section>
    )
}

export default TierPage;
