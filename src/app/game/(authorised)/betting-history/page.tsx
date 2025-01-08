// src/pages/betting-history.tsx
'use client';

import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import BettingCard from "@/components/features/game/betting-card";
import BettingHistoryFilter from "@/components/features/game/betting-history";
import GameRecord from "@/models/game-record";
import { useGameRecordHistory } from "@/react-query/game-record-queries";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";



const BettingHistoryPage = () => {
    const now = dayjs();

    const PAGE_SIZE = 10;
    const { ref, inView } = useInView();
    const [filter, setFilter] = useState({
        startDate: now.startOf('day').toDate(),
        endDate: now.endOf('day').toDate()
    });

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useGameRecordHistory({
        page: 1,
        limit: PAGE_SIZE,
        ...filter,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const records = useMemo(() => {
        if (!data) return [];
        return data.pages.map(page => page.data.gameRecordHistory).flatMap(page => page).map(record => new GameRecord(record));
    }, [data]);

    return (
        <Container className="bg-primary-game relative flex flex-col pt-24 gap-6 items-center min-h-screen overflow-hidden">

            <TopBar rightContent={<BettingHistoryFilter onFilterChange={(startDate, endDate) => {
                console.log(startDate, endDate);
                setFilter({ startDate, endDate })
            }} />}>
                <h1 className="text-xl font-semibold">Betting History</h1>
            </TopBar>

            <div className="mt-6 space-y-4 px-4 w-full max-w-md">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-red-500">
                        Failed to load betting history. Please try again later.
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {records.map((record) => (
                                <BettingCard key={record.id} record={record} />
                            ))}
                        </div>

                        <div ref={ref} className="py-4">
                            {isFetchingNextPage && (
                                <div className="flex justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Container>
    );
};

export default BettingHistoryPage;
