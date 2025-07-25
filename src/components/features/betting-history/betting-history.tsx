"use client";

import { getHistoryColumns } from "@/columns/betting-history";
import DataTable from "@/components/ui/data-table-server";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RoundRecordGameType } from "@/models/round-record";
import { useGetUserBettingHistory } from "@/react-query/user-queries";
import dayjs from "dayjs";
import { useState } from "react";

type Props = {
    userId?: string;
};

// Filter Type Definition
type Filter = {
    timeFrom: string;
    timeTo: string;
};

const LIMIT = 10;

const BettingHistory = ({ userId }: Props) => {
    const [page, setPage] = useState(1);
    const [roundRecordGameType, setRoundRecordGameType] = useState<RoundRecordGameType>(RoundRecordGameType.DERBY);
    const [filter, setFilter] = useState<Filter>({
        timeFrom: dayjs().startOf("day").toISOString(),
        timeTo: dayjs().endOf("day").toISOString(),
    });

    const { data, isLoading } = useGetUserBettingHistory({
        page: page,
        limit: LIMIT,
        userId: userId,
        startDate: new Date(filter.timeFrom),
        endDate: new Date(filter.timeTo),
        roundRecordGameType: roundRecordGameType,
    });
    const totalPages = Math.ceil(data?.count / LIMIT) || 1;

    // Change page when pagination controls are used
    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-6">Betting History</h2>
            </div>
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <div className="flex gap-5 w-full items-center ">
                    {/* Time Filters */}
                    <Input
                        type="datetime-local"
                        className="ml-auto w-fit"
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
                        className="w-fit"
                        value={dayjs(filter.timeTo).format("YYYY-MM-DDTHH:mm")}
                        onChange={(e) => {
                            setPage(1);
                            setFilter({
                                ...filter,
                                timeTo: dayjs(e.target.value).toISOString(), // Convert local time to UTC
                            });
                        }}
                    />
                    <Select value={roundRecordGameType} onValueChange={(value) => setRoundRecordGameType(value as RoundRecordGameType)}>
                        <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Select Game Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={RoundRecordGameType.DERBY}>Derby</SelectItem>
                            <SelectItem value={RoundRecordGameType.AVIATOR}>Aviator</SelectItem>
                            <SelectItem value={RoundRecordGameType.DICE}>Dice</SelectItem>
                            <SelectItem value={RoundRecordGameType.HEAD_TAIL}>Head Tail</SelectItem>
                            <SelectItem value={RoundRecordGameType.WHEEL_OF_FORTUNE}>Wheel of Fortune</SelectItem>
                            <SelectItem value={RoundRecordGameType.STOCK_SLOTS}>Stock Slots</SelectItem>
                            <SelectItem value={RoundRecordGameType.STOCK_JACKPOT}>Stock Jackpot</SelectItem>
                            <SelectItem value={RoundRecordGameType.SEVEN_UP_DOWN}>Seven Up Down</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>
            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isLoading}
                    columns={getHistoryColumns(roundRecordGameType)}
                    data={data?.data}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default BettingHistory;
