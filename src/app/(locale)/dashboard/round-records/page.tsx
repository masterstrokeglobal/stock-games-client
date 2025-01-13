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
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useMemo, useState } from "react";
import { toast } from "sonner";

dayjs.extend(utc);
dayjs.extend(timezone);

// Filter Type Definition
type Filter = {
    startDate?: Date;
    endDate?: Date;
    timeFrom: string;
    timeTo: string;
};

const RoundRecordTable = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>("all");
    const [isDownload, setIsDownload] = useState(false);
    const [filter, setFilter] = useState<Filter>({
        timeFrom: dayjs().startOf("day").toISOString(),
        timeTo: dayjs().endOf("day").toISOString(),
    });

    // Define params with type
    const params: {
        page: number;
        type?: string;
        startTime: string;
        endTime: string;
    } = {
        page: page,
        type: type === "all" ? undefined : type,
        startTime: filter.timeFrom,
        endTime: filter.timeTo,
    };

    // Fetch round records
    const { data, isSuccess, isFetching } = useGetWinningReport(params);

    // Handle Excel Download
    const downloadExcel = async () => {
        setIsDownload(true);
        try {
            const response = await roundRecordsAPI.getWinningReportExcel(params);

            const blob = new Blob([response.data], {
                type: response.headers["content-type"] || "application/octet-stream",
            });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `winning-report-${type}-${dayjs
                .utc(filter.startDate)
                .format("YYYY-MM-DD")}.xlsx`;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            toast.success("Downloaded Successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download");
        } finally {
            setIsDownload(false);
        }
    };

    // Memoize round records
    const roundRecords = useMemo(() => {
        if (isSuccess && data?.data?.rounds) {
            return data.data.rounds.map((record: any) => new RoundRecord(record));
        }
        return [];
    }, [data, isSuccess]);

    // Calculate total pages
    const totalPages = useMemo(() => {
        return Math.ceil((data?.data?.count || 0) / 10) || 1;
    }, [data]);

    // Page change handler
    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Round Records</h2>
                <div className="flex gap-5 items-center">
                    {/* Time Filters */}
                    <Input
                        type="datetime-local"
                        value={dayjs(filter.timeFrom).format("YYYY-MM-DDTHH:mm")}
                        onChange={(e) => {
                            setPage(1);
                            setFilter({
                                ...filter,
                                timeFrom: dayjs(e.target.value).toISOString(), // Convert local time to UTC
                            });
                        }}
                    />
                    <span>to</span>
                    <Input
                        type="datetime-local"
                        value={dayjs(filter.timeTo).format("YYYY-MM-DDTHH:mm")}
                        onChange={(e) => {
                            setPage(1);
                            setFilter({
                                ...filter,
                                timeTo: dayjs(e.target.value).toISOString(), // Convert local time to UTC
                            });
                        }}
                    />


                    {/* Type Filter */}
                    <Select value={type} onValueChange={(val) => setType(val)}>
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

                    {/* Download Button */}
                    <Button onClick={downloadExcel} disabled={isDownload}>
                        {isDownload ? "Downloading..." : "Download Excel"}
                    </Button>
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
