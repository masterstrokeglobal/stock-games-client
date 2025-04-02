'use client';

import bettingHistoryColumns from "@/columns/betting-history-column";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import DataTable from "@/components/ui/data-table-server-game";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGameRecordHistory } from "@/react-query/game-record-queries";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslations } from 'next-intl';

const BettingHistoryPage = () => {
    const t = useTranslations('betting-history');
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
        return data.data.gameRecordHistory.roundRecords;
    }, [data]);

    const totalPages = useMemo(() => {
        if (!data?.data?.count) return 1;
        return Math.ceil(data.data.count / pageSize);
    }, [data, pageSize]);

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <Container className="bg-primary-game w-full  rounded-xl relative flex flex-col pt-24 gap-6 items-center min-h-screen">
            <TopBar>
                <h1 className="text-xl font-semibold">{t('page-title')}</h1>
            </TopBar>

            <section className="container-main w-full max-w-6xl">
                <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between mb-6">
                    <div className="flex sm:gap-5 gap-2 items-center flex-wrap text-white w-full">
                        <Input
                            type="date"
                            value={filter.startDate}
                            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                            className="h-12 text-white bg-primary-game border sm:max-w-44 border-[#EFF8FF17] focus:border-[#55B0FF]"
                        />
                        <span>{t('date-range.to')}</span>
                        <Input
                            type="date"
                            value={filter.endDate}
                            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                            className="h-12 text-white bg-primary-game border sm:max-w-44 border-[#EFF8FF17] focus:border-[#55B0FF]"
                        />
                        <div className="sm:ml-auto sm:w-fit w-full flex sm:flex-row flex-col gap-2 sm:items-center">
                            <Label>
                                <span className="text-white">{t('date-range.page-size')}</span>
                            </Label>

                            <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
                                <SelectTrigger className="h-12 text-white bg-primary-game border border-[#EFF8FF17] focus:border-[#55B0FF] sm:w-[100px] w-full">
                                    <SelectValue placeholder={t('date-range.page-size')} />
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
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-red-500">
                        {t('errors.load-failed')}
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