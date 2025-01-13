import dayjs from "dayjs";
import { ColumnDef } from "@tanstack/react-table";

import { useTranslations } from 'next-intl';
import React from 'react';
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

// Header component for translated table headers
 const TranslatedHeader: React.FC<{ translationKey: string }> = ({ translationKey }) => {
  const t = useTranslations('betting-history.table');
  return <>{t(translationKey)}</>;
};

// Cell component for translations and dynamic content
 const RoundCell: React.FC<{ roundId: number }> = ({ roundId }) => {
  const t = useTranslations('betting-history.table');
  return <div className="flex items-center gap-2 whitespace-nowrap">{t('round-prefix')}{roundId}</div>;
};

 const StatusCell: React.FC<{ isWinner: boolean; winnerName: string }> = ({ isWinner, winnerName }) => {
  const t = useTranslations('betting-history.table');

  if (winnerName === "") {
    return <span className="text-gray-400">{t('status.pending')}</span>;
  }
  
  return (
    <div className={`flex items-center gap-2 ${isWinner ? 'text-green-400' : 'text-red-400'}`}>
      {isWinner ? <ArrowUpCircle className="w-5 h-5 text-green-400" /> : <ArrowDownCircle className="w-5 h-5 text-red-400" />}
      {isWinner ? t('status.won') : t('status.lost')}
    </div>
  );
};

interface BettingHistory {
  id: number;
  roundId: number;
  winningId: number;
  isWinner: boolean;
  winnerName: string;
  placementType: string;
  placedValues: string;
  winnerCode: string;
  amount: number;
  market: number[];
  createdAt: string;
}

const bettingHistoryColumns: ColumnDef<BettingHistory>[] = [
  {
    accessorKey: "round",
    header: () => <TranslatedHeader translationKey="headers.round" />,
    cell: ({ row }) => <RoundCell roundId={row.original.roundId} />,
  },
  {
    accessorKey: "createdAt",
    header: () => <TranslatedHeader translationKey="headers.date-time" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap">
        {dayjs(row.original.createdAt).format('DD MMM YYYY, h:mm A')}
      </span>
    ),
  },
  {
    accessorKey: "placementType",
    header: () => <TranslatedHeader translationKey="headers.bet-type" />,
    cell: ({ row }) => (
      <span className="font-semibold capitalize whitespace-nowrap">
        {row.original.placedValues ?? row.original.placementType ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <TranslatedHeader translationKey="headers.amount" />,
    cell: ({ row }) => (
      <span className="font-bold whitespace-nowrap">
        ${row.original.amount.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "winner",
    header: () => <TranslatedHeader translationKey="headers.winner" />,
    cell: ({ row }) => (
      <span className="font-semibold whitespace-nowrap">
        {row.original.winnerName.length !== 0 ? row.original.winnerName : "-"}
      </span>
    ),
  },
  {
    accessorKey: "isWinner",
    header: () => <TranslatedHeader translationKey="headers.status" />,
    cell: ({ row }) => <StatusCell isWinner={row.original.isWinner} winnerName={row.original.winnerName} />,
  },
];

export default bettingHistoryColumns;
