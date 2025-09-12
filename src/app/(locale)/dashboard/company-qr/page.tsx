"use client";

import companyQRColumns from "@/columns/company-qr-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { useGetCompanyQRs } from "@/react-query/company-qr-queries";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

const CompanyQRTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [active] = useState<string | "">("all");

  const { data, isLoading } = useGetCompanyQRs({
    page,
    active: active === "all" ? undefined : active,
    search,
    limit: 10,
  });



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <section className="container-main min-h-[60vh] my-12">
      <header className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap md:items-center justify-between">
        <h2 className="text-xl font-semibold">Company QR</h2>
        <div className="flex gap-5 flex-wrap">
          <div className="relative min-w-60 flex-1">
            <Search size={18} className="absolute top-2.5 left-2.5" />
            <Input
              placeholder="Search"
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Link href="/dashboard/company-qr/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Company QR
            </Button>
          </Link>
        </div>
      </header>
      <DataTable
        changePage={changePage}
        data={data?.data}
        page={page}
        totalPage={data?.count}
        loading={isLoading}
        columns={companyQRColumns}
      />
    </section>
  );
};

export default CompanyQRTable;
