"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketStats } from "@/types/market-category-profit-loss";
import DataTable from "@/components/ui/data-table-server";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarketCategoryDetailProps {
  markets: MarketStats[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const columns: ColumnDef<MarketStats>[] = [
  {
    accessorKey: "marketName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Market Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <div className="font-semibold">{row.original.marketName}</div>
        <div className="text-xs text-muted-foreground">{row.original.marketCode}</div>
      </div>
    ),
  },
  {
    accessorKey: "combined.totalBets",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Bets
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatCurrency(row.original.combined.totalBets),
  },
  {
    accessorKey: "combined.totalWinnings",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Winnings
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatCurrency(row.original.combined.totalWinnings),
  },
  {
    accessorKey: "combined.netProfitLoss",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Net P&L
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.combined.netProfitLoss;
      return (
        <span
          className={cn(
            "font-bold",
            value >= 0 ? "text-green-600" : "text-red-600"
          )}
        >
          {formatCurrency(value)}
        </span>
      );
    },
  },
  {
    accessorKey: "combined.betCount",
    header: "Bet Count",
    cell: ({ row }) => row.original.combined.betCount.toLocaleString(),
  },
  {
    accessorKey: "combined.winRate",
    header: "Win Rate",
    cell: ({ row }) => `${row.original.combined.winRate.toFixed(2)}%`,
  },
  {
    id: "games",
    header: "Game Breakdown",
    cell: ({ row }) => {
      const hasSlots = row.original.stockSlots;
      const hasJackpot = row.original.stockJackpot;
      return (
        <div className="space-y-1 text-xs">
          {hasSlots && (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Slots:</span>
              <span className={cn(
                "font-semibold",
                row.original.stockSlots!.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(row.original.stockSlots!.netProfitLoss)}
              </span>
            </div>
          )}
          {hasJackpot && (
            <div className="flex justify-between gap-2">
              <span className="text-muted-foreground">Jackpot:</span>
              <span className={cn(
                "font-semibold",
                row.original.stockJackpot!.netProfitLoss >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(row.original.stockJackpot!.netProfitLoss)}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
];

export default function MarketCategoryDetail({
  markets,
  totalPages,
  currentPage,
  isLoading,
  onPageChange,
}: MarketCategoryDetailProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Market Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={markets}
          loading={isLoading}
          page={currentPage}
          totalPage={totalPages}
          changePage={onPageChange}
        />
      </CardContent>
    </Card>
  );
}



