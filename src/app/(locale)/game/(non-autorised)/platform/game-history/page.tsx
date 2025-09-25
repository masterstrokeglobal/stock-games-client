"use client";
import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useGetUserBets, UserBetsResponse } from '@/react-query/game-user-queries';
import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { INR } from '@/lib/utils';
import { RoundRecordGameType } from '@/models/round-record';
import DateRangePickerAlt from '@/components/ui/date-range-picker-alt';
import { DateRange } from 'react-day-picker';
import { useQueryClient } from '@tanstack/react-query';

type TabType = "all" | "stock" | "casino";

const GameHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetUserBets({ page, limit, startDate, endDate });
  const typedData = data as UserBetsResponse | undefined;

  // Invalidate queries when page changes to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userBets"] });
  }, [page, queryClient]);

  const rows = useMemo(() => {
    const GAME_NAME_MAP: Record<string, string> = {
      [RoundRecordGameType.DERBY]: 'Stock Roulette',
      [RoundRecordGameType.STOCK_SLOTS]: 'Stock Slot',
      [RoundRecordGameType.STOCK_JACKPOT]: 'Stock Jackpot',
      [RoundRecordGameType.SEVEN_UP_DOWN]: '7 Up Down',
      [RoundRecordGameType.HEAD_TAIL]: 'Head Tail',
      [RoundRecordGameType.WHEEL_OF_FORTUNE]: 'Wheel Of Fortune',
      [RoundRecordGameType.AVIATOR]: 'Aviator',
      [RoundRecordGameType.DICE]: 'Dice',
      [RoundRecordGameType.RED_BLACK]: 'Red Black',
    };

    const stockItems = typedData?.stock?.items?.map((s: any, idx: number) => ({
      id: s.roundId ?? idx,
      date: s.createdAt,
      dateStr: s.createdAt ? dayjs(s.createdAt).format('YYYY-MM-DD') : '-',
      timeStr: s.createdAt ? dayjs(s.createdAt).format('HH:mm:ss') : '-',
      game: GAME_NAME_MAP[(s.gameType as string) ?? ''] ?? s.gameName ?? s.gameType ?? 'Stock',
      amount: s.amount ?? 0,
      payout: s.payout ?? 0,
      wL: (s.payout ?? 0) > 0 ? 'W' : 'L',
      net: (s.payout ?? 0) - (s.amount ?? 0),
      source: 'stock' as const,
    })) ?? [];

    const casinoItems = typedData?.casino?.items?.map((c: any) => ({
      id: c.id,
      date: c.createdAt,
      dateStr: c.createdAt ? dayjs(c.createdAt).format('YYYY-MM-DD') : '-',
      timeStr: c.createdAt ? dayjs(c.createdAt).format('HH:mm:ss') : '-',
      game: c.gameName ?? c.provider ?? 'Casino',
      amount: c.amount ?? 0,
      payout: c.payout ?? 0,
      wL: (c.payout ?? 0) > 0 ? 'W' : 'L',
      net: (c.payout ?? 0) - (c.amount ?? 0),
      source: 'casino' as const,
    })) ?? [];

    // For the 'all' tab, we'll show the items as is without filtering/merging to preserve backend pagination
    if (activeTab === 'all') {
      return [...stockItems, ...casinoItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (activeTab === 'stock') {
      return stockItems;
    } else {
      return casinoItems;
    }
  }, [typedData, activeTab]);

  const totalCount = useMemo(() => {
    if (activeTab === 'stock') return typedData?.stock?.totalCount ?? 0;
    if (activeTab === 'casino') return typedData?.casino?.totalCount ?? 0;
    return (typedData?.stock?.totalCount ?? 0) + (typedData?.casino?.totalCount ?? 0);
  }, [typedData, activeTab]);

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / limit));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Game History</h1>

      <div className="flex flex-wrap justify-between gap-3 items-center">
        <div className="flex gap-2 border rounded-md p-1 bg-white/5">
          <button className={`px-3 py-1 rounded ${activeTab==='all' ? 'bg-blue-600 text-white' : ''}`} onClick={() => {setActiveTab('all'); setPage(1);}}>All</button>
          <button className={`px-3 py-1 rounded ${activeTab==='stock' ? 'bg-blue-600 text-white' : ''}`} onClick={() => {setActiveTab('stock'); setPage(1);}}>Stock</button>
          <button className={`px-3 py-1 rounded ${activeTab==='casino' ? 'bg-blue-600 text-white' : ''}`} onClick={() => {setActiveTab('casino'); setPage(1);}}>Casino</button>
        </div>

        <div className="flex gap-2">
          <DateRangePickerAlt
            onDateChange={(range: DateRange | undefined) => {
              setPage(1);
              const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
              const to = range?.to ? dayjs(range.to).format('YYYY-MM-DD') : undefined;
              setStartDate(from);
              setEndDate(to);
            }}
            triggerClassName='bg-transparent h-10 hover:bg-blue-600 border-white'
            initialDateRange={
              startDate || endDate
                ? {
                    from: startDate ? dayjs(startDate).toDate() : undefined,
                    to: endDate ? dayjs(endDate).toDate() : undefined,
                  }
                : undefined
            }
          />
        </div>
      </div>

      <div className="overflow-auto w-full">
        <table className="min-w-full text-sm text-platform-text">
          <thead>
            <tr className="text-left border-b ">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Game</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">W/L</th>
              <th className="py-2 pr-4">Net P/L</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="py-6 text-center">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="py-6 text-center">No records</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={`${r.source}-${r.id}`} className="border-b">
                  <td className="py-2 pr-4">{r.id}</td>
                  <td className="py-2 pr-4">{r.dateStr}</td>
                  <td className="py-2 pr-4">{r.timeStr}</td>
                  <td className="py-2 pr-4">{r.game}</td>
                  <td className="py-2 pr-4">{INR(r.amount ?? 0)}</td>
                  <td className={`py-2 pr-4 ${r.wL==='W' ? 'text-green-600' : 'text-red-600'}`}>{r.wL}</td>
                  <td className={`py-2 pr-4 ${r.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>{INR(r.net)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end">
        <Pagination page={page} totalPage={totalPages} changePage={setPage} />
      </div>
    </div>
  );
};

export default GameHistoryPage;