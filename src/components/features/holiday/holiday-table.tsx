"use client";

import holidayColumns from "@/columns/holiday-column";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import DatePicker from "@/components/ui/date-picker";
import Holiday from "@/models/holiday";
import { useGetAllHolidays } from "@/react-query/holiday-queries";
import Link from "next/link";
import { useMemo, useState } from "react";


const HolidayTable = () => {
    const [page, setPage] = useState(1);
    const [date, setDate] = useState<Date | undefined>(undefined);

    const { data, isSuccess, isFetching } = useGetAllHolidays({
        page: page,
        date: date,
    });

    const holidays = useMemo(() => {
        if (isSuccess && data?.data?.holidays) {
            return Array.from(data.data.holidays).map(
                (holiday: any) => new Holiday(holiday)
            );
        }
        return [];
    }, [data, isSuccess]);

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);

    const handleDateChange = (date: Date) => {
        setDate(date);
        setPage(1);
    }

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Holidays</h2>
                <div className="flex gap-5 ">
                    <DatePicker value={date} className="min-w-40" onSelect={handleDateChange} />
                    <Link href="/dashboard/holiday/create">
                        <Button>Create Holiday</Button>
                    </Link>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={holidayColumns}
                    data={holidays}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default HolidayTable;