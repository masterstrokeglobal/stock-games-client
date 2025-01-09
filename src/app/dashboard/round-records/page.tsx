"use client";

import roundRecordColumns from "@/columns/round-records-columns";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { roundRecordsAPI } from "@/lib/axios/round-record-API";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useGetWinningReport } from "@/react-query/round-record-queries";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);


type Filter = {
    startDate?: Date;
    endDate?: Date;
    timeFrom: string;
    timeTo: string;
}

const RoundRecordTable = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>("all");
    const [filter, setFilter] = useState<Filter>({
        timeFrom: dayjs().startOf('year').format("YYYY-MM-DDTHH:mm:ss"),
        timeTo: dayjs().endOf('year').format("YYYY-MM-DDTHH:mm:ss"),
    });

    const params = {
        page: page,
        type: type === "all" ? undefined : type,
        startTime: filter.timeFrom,
        endTime: filter.timeTo,
    };

    // Fetch all round records with pagination, search query, and filters
    const { data, isSuccess, isFetching } = useGetWinningReport(params);

    const downloadExcel = async () => {
        // will get a buffer response
        const response = await roundRecordsAPI.getWinningReportExcel(params);

        // Create a blob from the response data
        const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'application/octet-stream',
        });

        // Create a link element to trigger download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `winning-report-${type}-${dayjs.utc(filter.startDate).format("YYYY-MM-DD")}.xlsx`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    }

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

    const handleTimeFromChange = (val: string) => {
        setFilter({ ...filter, timeFrom: val, timeTo: val });
        setPage(1);
    }


    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Round Records</h2>
                <div className="flex gap-5 items-center">
                    {/*              <DatePicker value={filter.startDate} onSelect={(date) => setFilter({ ...filter, startDate: date })} />
                    <DatePicker value={filter.endDate} onSelect={(date) => setFilter(
                        { ...filter, endDate: date }
                    )} /> */}

                    <Input type="datetime-local" value={filter.timeFrom}
                     onChange={(e) => setFilter({ ...filter, timeFrom: e.target.value })} />
                    <span>
                        to
                    </span>
                    <Input type="datetime-local" value={filter.timeTo}
                     onChange={(e) => setFilter({ ...filter, timeTo: e.target.value })} />

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

                    {/*                     <Select value={filter.timeFrom ?? timeOptions[0].value} onValueChange={(val) => handleTimeFromChange(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Time From" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="all">All Time</SelectItem>
                                {timeOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                            </SelectGroup>
                        </SelectContent>
                    </Select> */}
                    <Button onClick={downloadExcel}
                    > Export </Button>
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
