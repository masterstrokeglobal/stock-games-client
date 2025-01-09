'use client';

import bettingHistoryColumns from "@/columns/betting-history-column";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import DataTable from "@/components/ui/data-table-server-game";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import GameRecord from "@/models/game-record";
import { useGameRecordHistory } from "@/react-query/game-record-queries";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

const BettingHistoryPage = () => {
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({
        startDate: dayjs().startOf('week').format("YYYY-MM-DD"),
        endDate: dayjs().endOf('week').format("YYYY-MM-DD"),
    });

    const {
        data,
        isLoading,
        isError,
    } = useGameRecordHistory({
        page,
        limit: pageSize,
        startDate: dayjs(filter.startDate).startOf('day').toDate(),
        endDate: dayjs(filter.endDate).endOf('day').toDate(),
    });

    const records = useMemo(() => {
        if (!data?.data) return [];
        return data.data.gameRecordHistory;
    }, [data]);

    const totalPages = useMemo(() => {
        if (!data?.data?.total) return 1;
        return Math.ceil(data.data.total / pageSize);
    }, [data, pageSize]);

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <Container className="bg-primary-game relative flex flex-col pt-24 gap-6 items-center min-h-screen">
            <TopBar>
                <h1 className="text-xl font-semibold">Betting History</h1>
            </TopBar>

            <section className="container-main w-full max-w-6xl">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between mb-6">
                    <div className="flex gap-5 items-center">
                        <Input
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                            className="h-12 text-white bg-[#122146] border border-[#EFF8FF17] focus:border-[#55B0FF]"
                        />
                        <span>to</span>
                        <Input
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                            className="h-12 text-white bg-[#122146] border border-[#EFF8FF17] focus:border-[#55B0FF]"
                        />
                        <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
                            <SelectTrigger className="h-12 text-white bg-[#122146] border border-[#EFF8FF17] focus:border-[#55B0FF] w-[100px]">
                                <SelectValue placeholder="Page Size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-red-500">
                        Failed to load betting history. Please try again later.
                    </div>
                ) : (
                    <div>
                        <DataTable
                            page={page}
                            loading={isLoading}
                            columns={bettingHistoryColumns}
                            data={records}
                            totalPage={totalPages}
                            changePage={changePage}
                        />
                    </div>
                )}
            </section>
        </Container>
    );
};

export default BettingHistoryPage;