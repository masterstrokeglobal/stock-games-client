import { Badge } from "@/components/ui/badge";
import { INR } from "@/lib/utils";
import { MarketItem } from "@/models/market-item";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

// Matches the sample data structure provided in the prompt
export type DerbyHistoryRow = {
    id: number;
    roundId: number;
    amount: number;
    placedValue: string;
    winningMarketItem: MarketItem | null;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
};

const derbyHistoryColumns: ColumnDef<DerbyHistoryRow>[] = [
    {
        header: "Round ID",
        accessorKey: "roundId",
        cell: ({ row }) => <div>#{row.original.roundId}</div>,
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => <div>{INR(row.original.amount)}</div>,
    },
    {
        header: "Placed Value",
        accessorKey: "placedValue",
        cell: ({ row }) => <div>{row.original.placedValue}</div>,
    },
    {
        header: "Winning Horse",
        accessorKey: "winningMarketItem",
        cell: ({ row }) =>
            row.original.winningMarketItem ? (
                <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="capitalize w-fit">
                        {row.original.winningMarketItem.name}
                    </Badge>
                </div>
            ) : (
                <div>-</div>
            ),
    },
    {
        header: "Result",
        accessorKey: "isWinner",
        cell: ({ row }) =>
            row.original.isWinner ? (
                <span className="text-green-600 font-semibold">Win</span>
            ) : (
                <span className="text-red-600 font-semibold">Lose</span>
            ),
    },
    {
        header: "Net Profit/Loss",
        accessorKey: "netProfitLoss",
        cell: ({ row }) =>
            typeof row.original.netProfitLoss === "number" ? (
                <div
                    className={
                        row.original.netProfitLoss > 0
                            ? "text-green-600"
                            : row.original.netProfitLoss < 0
                                ? "text-red-600"
                                : ""
                    }
                >
                    {INR(row.original.netProfitLoss)}
                </div>
            ) : (
                <div>-</div>
            ),
    },
    {
        header: "Placed At",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <div>{dayjs(row.original.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
        ),
    },
];

export default derbyHistoryColumns;