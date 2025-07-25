import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import React from 'react';

// Header component for translated table headers
const TranslatedHeader: React.FC<{ translationKey: string }> = ({ translationKey }) => {
  const t = useTranslations('game-history.table');
  return <>{t(translationKey)}</>;
};

interface MarketItem {
  id: number;
  type: string;
  active: boolean;
  placementAllowed: boolean;
  name: string;
  oddsMultiplier: number;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface GameRecord {
  roundId: number;
  type: string;
  startTime: string;
  endTime: string;
  totalPlaced: number;
  totalWinningAmount: number;
  netProfitLoss: number;
  winningMarketItem: MarketItem;
}

// Status cell component
const StatusCell: React.FC<{ netProfitLoss: number }> = ({ netProfitLoss }) => {
  const isProfit = netProfitLoss > 0;

  return (
    <div className={`font-semibold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
      {isProfit ? '+' : ''}{netProfitLoss.toFixed(2)}
    </div>
  );
};

const gameHistoryColumns: ColumnDef<GameRecord>[] = [
  {
    accessorKey: "roundId",
    header: () => <TranslatedHeader translationKey="headers.round" />,
    cell: ({ row }) => (
      <div className="font-semibold">
        #{row.original.roundId}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <TranslatedHeader translationKey="headers.type" />,
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "startTime",
    header: () => <TranslatedHeader translationKey="headers.start-time" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {dayjs(row.original.startTime).format('DD MMM YYYY, hh:mm A')}
      </span>
    ),
  },
  {
    accessorKey: "endTime",
    header: () => <TranslatedHeader translationKey="headers.end-time" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {dayjs(row.original.endTime).format('DD MMM YYYY, hh:mm A')}
      </span>
    ),
  },
  {
    accessorKey: "totalPlaced",
    header: () => <TranslatedHeader translationKey="headers.total-placed" />,
    cell: ({ row }) => (
      <span className="font-semibold">
        Rs. {row.original.totalPlaced.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "totalWinningAmount",
    header: () => <TranslatedHeader translationKey="headers.total-winning" />,
    cell: ({ row }) => (
      <span className="font-semibold">
        Rs. {row.original.totalWinningAmount.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "winningMarketItem",
    header: () => <TranslatedHeader translationKey="headers.winner" />,
    cell: ({ row }) => (
      <span className="font-semibold capitalize">
        {row.original.winningMarketItem.name}
      </span>
    ),
  },
  {
    accessorKey: "netProfitLoss",
    header: () => <TranslatedHeader translationKey="headers.profit-loss" />,
    cell: ({ row }) => <StatusCell netProfitLoss={row.original.netProfitLoss} />,
  },
  {
    accessorKey: "actions",
    header: () => <TranslatedHeader translationKey="headers.actions" />,
    cell: ({ row }) => (
      <div className="flex items-center justify-center space-x-2">
        <Link href={`/game/betting-history/${row.original.roundId}`}>
          <Button size="sm" variant="secondary">
            <span className="text-sm">View</span>
          </Button>
        </Link>
      </div>
    ),
  }
];

export default gameHistoryColumns;