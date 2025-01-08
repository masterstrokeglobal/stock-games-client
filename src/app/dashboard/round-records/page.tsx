"use client";

import roundRecordColumns from "@/columns/round-records-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import DatePicker from "@/components/ui/date-picker";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { timeOptions } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetWinningReport } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

type Filter = {
    startDate?: Date;
    endDate?: Date;
    timeFrom?: string;
    timeTo?: string;
}

const RoundRecordTable = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>(SchedulerType.NSE);
    const [filter, setFilter] = useState<Filter>({
        startDate: dayjs().subtract(1, "week").toDate(),
        endDate: new Date(),
        timeFrom: "all",
        timeTo: "all",
    });

    // Fetch all round records with pagination, search query, and filters
    const { data, isSuccess, isFetching } = useGetWinningReport({
        page: page,
        type: type === "all" ? undefined : type,
        startTime: filter.startDate,
        endTime: filter.endDate,
    });

    const roundRecords = useMemo(() => {
        if (isSuccess && data?.data?.rounds) {
            return Array.from(data.data.rounds).map(
                (record: any) => new RoundRecord(record)
            );
        }
        return [];
    }, [data, isSuccess]);

    // Calculate total pages based on data count
    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data, isSuccess]);


    // Change page when pagination controls are used
    const changePage = (newPage: number) => {
        setPage(newPage);
    };


    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Round Records</h2>
                <div className="flex gap-5">
                    <DatePicker value={filter.startDate} onSelect={(date) => setFilter({ ...filter, startDate: date })} />
                    <DatePicker value={filter.endDate} onSelect={(date) => setFilter(
                        { ...filter, endDate: date }
                    )} />

                    {/* ShadCN Select for Scheduler Type Filter */}
                    <Select value={type} onValueChange={(val) => setType(val as SchedulerType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Types</SelectLabel>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value={SchedulerType.NSE}>NSE</SelectItem>
                                <SelectItem value={SchedulerType.CRYPTO}>Crypto</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <Select value={filter.timeFrom ?? timeOptions[0].value} onValueChange={(val) => setFilter({ ...filter, timeFrom: val })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Time From" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {timeOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Button> Export </Button>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={roundRecordColumns}
                    data={roundRecords}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default RoundRecordTable;
