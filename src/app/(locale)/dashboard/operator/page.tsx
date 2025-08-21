"use client";
import operatorColumns from "@/columns/operator-columns";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetAllOperators } from "@/react-query/operator-queries";
import { Search } from "lucide-react";
import React, { useMemo, useState } from "react";

const OperatorTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");


    const { data, isFetching } = useGetAllOperators({
        page,
        search,
    });
    console.log("data", data);



    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center mt-20 justify-between">
                <h2 className="text-xl font-semibold">Operators</h2>
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search operators"
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
                    columns={operatorColumns}
                    data={data}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default OperatorTable;