import { Badge } from "@/components/ui/badge";
import { INR } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";


export type HeadTailBettingHistoryRow = {
  id: number;
  roundId: number;
  amount: number;
  winningSide: "head" | "tail" | string;
  selectedSide: "head" | "tail" | string;
  isWinner: boolean;
  createdAt: string;
  netProfitLoss: number;
};

const headTailBettingHistoryColumns: ColumnDef<HeadTailBettingHistoryRow>[] = [
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
    cell: ({ row }) => <div>{INR(row.original.amount)}</div>,
  },
  {
    header: "Selected Side",
    accessorKey: "selectedSide",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.selectedSide}
      </Badge>
    ),
  },
  {
    header: "Winning Side",
    accessorKey: "winningSide",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.winningSide}
      </Badge>
    ),
  },
  {
    header: "Win/Loss",
    accessorKey: "isWinner",
    cell: ({ row }) =>
      row.original.isWinner !== undefined ? (
        <Badge variant={row.original.isWinner ? "success" : "destructive"}>
          {row.original.isWinner ? "Win" : "Loss"}
        </Badge>
      ) : (
        <div>-</div>
      ),
  },
  {
    header: "Net Profit/Loss",
    accessorKey: "netProfitLoss",
    cell: ({ row }) =>
      row.original.netProfitLoss !== undefined ? (
        <div
          className={
            row.original.netProfitLoss > 0
              ? "text-green-600"
              : row.original.netProfitLoss < 0
              ? "text-red-600"
              : ""
          }
        >
          {INR(row.original.netProfitLoss)  }
        </div>
      ) : (
        <div>-</div>
      ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <div>{dayjs(row.original.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
    ),
  },
];

export default headTailBettingHistoryColumns;
