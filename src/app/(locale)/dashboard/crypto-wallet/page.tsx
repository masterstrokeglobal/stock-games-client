    "use client";

import { cryptoWalletColumns } from "@/columns/crypto-wallet";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetCryptoWallets } from "@/react-query/crypto-wallet-queries";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const CryptoWalletTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    // Fetch all crypto wallets with pagination and search query
    const { data, isSuccess, isFetching } = useGetCryptoWallets({
        page: page,
        search: search,
    });
    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

    // Handle search input change
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    // Change page when pagination controls are used
    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Crypto Wallets</h2>
                <div className="flex gap-5 items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/crypto-wallet/create">   <Button>Create</Button></Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={cryptoWalletColumns}
                    data={data}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default CryptoWalletTable;
