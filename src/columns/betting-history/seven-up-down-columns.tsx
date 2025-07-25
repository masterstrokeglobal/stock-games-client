import { ColumnDef } from "@tanstack/react-table";

export type SevenUpDownBettingHistoryRow = {
  id: number;
  roundId: number;
  amount: number;
  winner: string;
  selectedSide: string;
  isWinner: boolean;
  createdAt: string;
  netProfitLoss: number;
};

const sevenUpDownColumns: ColumnDef<SevenUpDownBettingHistoryRow>[] = [
  {
    header: "ID",
    accessorKey: "id",
    cell: ({ row }) => <div>{row.original.id}</div>,
  },
  {
    header: "Round ID",
    accessorKey: "roundId",
    cell: ({ row }) => <div>{row.original.roundId}</div>,
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => <div>{row.original.amount}</div>,
  },
  {
    header: "Selected Side",
    accessorKey: "selectedSide",
    cell: ({ row }) => <div className="capitalize">{row.original.selectedSide}</div>,
  },
  {
    header: "Winner",
    accessorKey: "winner",
    cell: ({ row }) => <div className="capitalize">{row.original.winner}</div>,
  },
  {
    header: "Is Winner",
    accessorKey: "isWinner",
    cell: ({ row }) => (
      <span
        className={
          row.original.isWinner
            ? "text-green-600 font-semibold"
            : "text-red-600 font-semibold"
        }
      >
        {row.original.isWinner ? "Yes" : "No"}
      </span>
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <div>
        {row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleString()
          : "-"}
      </div>
    ),
  },
  {
    header: "Net Profit/Loss",
    accessorKey: "netProfitLoss",
    cell: ({ row }) => <div>{row.original.netProfitLoss}</div>,
  },
];

export default sevenUpDownColumns;  