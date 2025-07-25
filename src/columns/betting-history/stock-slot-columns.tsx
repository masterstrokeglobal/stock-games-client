import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export type StockSlotBettingHistoryRow = {
    id: number;
    roundId: number;
    amount: number;
    winningSide: string | null;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
};

const stockSlotBettingHistoryColumns: ColumnDef<StockSlotBettingHistoryRow>[] = [
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
        cell: ({ row }) => <div>Rs. {row.original.amount}</div>,
    },
    {
        header: "Winning Side",
        accessorKey: "winningSide",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.winningSide ?? "-"}
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
                    {row.original.netProfitLoss}
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

export default stockSlotBettingHistoryColumns;