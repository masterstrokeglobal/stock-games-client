"use client";
import React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useGetUserBets, UserBetsResponse } from '@/react-query/game-user-queries';
import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { INR } from '@/lib/utils';
import { RoundRecordGameType } from '@/models/round-record';
import { TransactionType } from '@/models/transaction';
import DateRangePickerAlt from '@/components/ui/date-range-picker-alt';
import { DateRange } from 'react-day-picker';
import { useQueryClient } from '@tanstack/react-query';

type TabType = "all" | "stock" | "casino";

const GameHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const queryClient = useQueryClient();

  // Helper function to adjust end date for API (add 1 day for inclusive filtering)
  const getAdjustedEndDate = (endDate: string | undefined) => {
    if (!endDate) return endDate;
    const date = new Date(endDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const { data, isLoading } = useGetUserBets({ 
    page, 
    limit, 
    startDate, 
    endDate: getAdjustedEndDate(endDate) // Add 1 day for inclusive filtering
  });
  const typedData = data as UserBetsResponse | undefined;

  // Invalidate queries when page changes to ensure fresh data
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userBets"] });
  }, [page, queryClient]);

  const { rows, groupedByDate } = useMemo(() => {
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

    // Process stock items: merge placement and winning transactions with same roundId
    const rawStockItems = typedData?.stock?.items ?? [];
    const roundsMap = new Map<string, { placement?: any, winning?: any }>();
    
    // Group transactions by roundId and type
    rawStockItems.forEach((s: any) => {
      const roundId = s.roundId;
      if (!roundId) return; // Skip items without roundId
      
      if (!roundsMap.has(roundId)) {
        roundsMap.set(roundId, {});
      }
      
      const roundData = roundsMap.get(roundId)!;
      if (s.type === TransactionType.PLACEMENT) {
        roundData.placement = s;
      } else if (s.type === TransactionType.WINNING) {
        roundData.winning = s;
      }
    });

    // Create final stock items array
    const stockItems: any[] = [];
    
    rawStockItems.forEach((s: any, idx: number) => {
      const roundId = s.roundId;
      
      if (!roundId) {
        // Keep items without roundId as-is
        stockItems.push({
          id: s.roundId ?? idx,
          date: s.createdAt,
          dateStr: s.createdAt ? dayjs(s.createdAt).format('DD-MM-YYYY') : '-',
          timeStr: s.createdAt ? dayjs(s.createdAt).format('HH:mm') : '-',
          game: GAME_NAME_MAP[(s.gameType as string) ?? ''] ?? s.gameName ?? s.gameType ?? 'Stock',
          amount: s.amount ?? 0,
          payout: s.payout ?? 0,
          wL: (s.payout ?? 0) > 0 ? 'W' : 'L',
          net: (s.payout ?? 0) - (s.amount ?? 0),
          source: 'stock' as const,
        });
        return;
      }

      const roundData = roundsMap.get(roundId)!;
      const hasPlacement = !!roundData.placement;
      const hasWinning = !!roundData.winning;
      
      if (hasPlacement && hasWinning) {
        // Both placement and winning exist - only show winning with placement amount
        if (s.type === TransactionType.WINNING) {
          stockItems.push({
            id: s.roundId ?? idx,
            date: s.createdAt,
            dateStr: s.createdAt ? dayjs(s.createdAt).format('DD-MM-YYYY') : '-',
            timeStr: s.createdAt ? dayjs(s.createdAt).format('HH:mm') : '-',
            game: GAME_NAME_MAP[(s.gameType as string) ?? ''] ?? s.gameName ?? s.gameType ?? 'Stock',
            amount: roundData.placement.amount ?? 0, // Use placement amount
            payout: s.payout ?? 0,
            wL: (s.payout ?? 0) > 0 ? 'W' : 'L',
            net: (s.payout ?? 0) - (roundData.placement.amount ?? 0),
            source: 'stock' as const,
          });
        }
        // Skip placement transactions when both exist
      } else {
        // Only one type exists - keep it as-is
        stockItems.push({
          id: s.roundId ?? idx,
          date: s.createdAt,
          dateStr: s.createdAt ? dayjs(s.createdAt).format('DD-MM-YYYY') : '-',
          timeStr: s.createdAt ? dayjs(s.createdAt).format('HH:mm') : '-',
          game: GAME_NAME_MAP[(s.gameType as string) ?? ''] ?? s.gameName ?? s.gameType ?? 'Stock',
          amount: s.amount ?? 0,
          payout: s.payout ?? 0,
          wL: (s.payout ?? 0) > 0 ? 'W' : 'L',
          net: (s.payout ?? 0) - (s.amount ?? 0),
          source: 'stock' as const,
        });
      }
    });

    const casinoItems = typedData?.casino?.items?.map((c: any) => ({
      id: c.id,
      date: c.createdAt,
      dateStr: c.createdAt ? dayjs(c.createdAt).format('DD-MM-YYYY') : '-',
      timeStr: c.createdAt ? dayjs(c.createdAt).format('HH:mm') : '-',
      game: c.gameName ?? c.provider ?? 'Casino',
      amount: c.amount ?? 0,
      payout: c.payout ?? 0,
      wL: (c.payout ?? 0) > 0 ? 'W' : 'L',
      net: (c.payout ?? 0) - (c.amount ?? 0),
      source: 'casino' as const,
    })) ?? [];

    // Combine and sort all items
    let allItems: any[] = [];
    if (activeTab === 'all') {
      allItems = [...stockItems, ...casinoItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (activeTab === 'stock') {
      allItems = stockItems;
    } else {
      allItems = casinoItems;
    }

    // Group by date for mobile view
    const grouped = allItems.reduce((acc: Record<string, any[]>, item) => {
      const dateKey = item.dateStr;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});

    // Sort dates in descending order and sort items within each date
    const sortedGrouped = Object.keys(grouped)
      .sort((a, b) => {
        const dateA = dayjs(a, 'DD-MM-YYYY');
        const dateB = dayjs(b, 'DD-MM-YYYY');
        return dateB.valueOf() - dateA.valueOf();
      })
      .reduce((acc: Record<string, any[]>, date) => {
        acc[date] = grouped[date].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return acc;
      }, {});

    return {
      rows: allItems,
      groupedByDate: sortedGrouped
    };
  }, [typedData, activeTab]);

  const totalCount = useMemo(() => {
    if (activeTab === 'stock') return typedData?.stock?.totalCount ?? 0;
    if (activeTab === 'casino') return typedData?.casino?.totalCount ?? 0;
    return (typedData?.stock?.totalCount ?? 0) + (typedData?.casino?.totalCount ?? 0);
  }, [typedData, activeTab]);

  const totalPages = Math.max(1, Math.ceil((totalCount || 0) / limit));

  return (
    <div className="space-y-4 p-2">
      <h1 className="text-xl font-semibold text-platform-text">Game History</h1>

      <div className="flex flex-wrap justify-between gap-3 items-center">
        <div className="flex gap-2 border rounded-md p-1 bg-white/5 text-xs md:text-sm">
          <button className={`px-3 py-1 rounded text-platform-text ${activeTab==='all' ? 'bg-background-secondary ' : ''}`} onClick={() => {setActiveTab('all'); setPage(1);}}>All</button>
          <button className={`px-3 py-1 rounded text-platform-text ${activeTab==='stock' ? 'bg-background-secondary ' : ''}`} onClick={() => {setActiveTab('stock'); setPage(1);}}>Stock</button>
          <button className={`px-3 py-1 rounded text-platform-text ${activeTab==='casino' ? 'bg-background-secondary ' : ''}`} onClick={() => {setActiveTab('casino'); setPage(1);}}>Casino</button>
        </div>

        <div className="flex gap-2 items-center">
          <DateRangePickerAlt
            key={`dr-${startDate ?? ''}-${endDate ?? ''}`}
            onDateChange={(range: DateRange | undefined) => {
              setPage(1);
              const from = range?.from ? dayjs(range.from).format('YYYY-MM-DD') : undefined;
              const to = range?.to ? dayjs(range.to).format('YYYY-MM-DD') : undefined;
              setStartDate(from);
              setEndDate(to);
            }}
            triggerClassName='bg-transparent h-10 hover:bg-background-secondary border-borderColor text-xs md:text-sm'
            initialDateRange={
              startDate || endDate
                ? {
                    from: startDate ? dayjs(startDate).toDate() : undefined,
                    to: endDate ? dayjs(endDate).toDate() : undefined,
                  }
                : undefined
            }
          />
          {(startDate || endDate) && (
            <button
              className="px-3 py-2 rounded border border-platform-border text-platform-text hover:bg-background-primary hover:text-white h-10"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-auto w-full">
        <table className="min-w-full text-sm text-platform-text">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">ID</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Game</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Net P/L</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="py-6 text-center">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center">No records</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={`${r.source}-${r.id}`} className="border-b">
                  <td className="py-2 pr-4">{r.id}</td>
                  <td className="py-2 pr-4">{r.dateStr}</td>
                  <td className="py-2 pr-4">{r.timeStr}</td>
                  <td className="py-2 pr-4">{r.game}</td>
                  <td className="py-2 pr-4">{INR(r.amount ?? 0)}</td>
                  <td className={`py-2 pr-4 ${r.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>{INR(r.net)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Date-wise View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="py-6 text-center text-platform-text">Loading...</div>
        ) : Object.keys(groupedByDate).length === 0 ? (
          <div className="py-6 text-center text-platform-text">No records</div>
        ) : (
          Object.entries(groupedByDate).map(([date, items]) => (
            <div key={date} className="border rounded-lg overflow-hidden bg-white/5">
              <div className="bg-background-secondary px-4 py-2 font-medium text-sm text-platform-text border-b">
                {date}
              </div>
              <div className="space-y-0">
                {items.map((r) => (
                  <div key={`${r.source}-${r.id}`} className="px-4 py-3 border-b last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-medium text-platform-text text-sm">{r.game}</div>
                        <div className="text-xs text-platform-text/70">
                          {r.timeStr} • ID: {r.id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-platform-text">{INR(r.amount ?? 0)}</div>
                        <div className={`text-sm font-medium ${r.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {INR(r.net)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-end text-platform-text border-platform-border">
        <Pagination page={page} totalPage={totalPages} changePage={setPage} />
      </div>
    </div>
  );
};

export default GameHistoryPage;