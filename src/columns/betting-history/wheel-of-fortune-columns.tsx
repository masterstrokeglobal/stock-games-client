import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { INR } from "@/lib/utils";
import { WHEEL_COLOR_CONFIG } from "@/models/round-record";

type WheelOfFortuneBettingHistoryRow = {
    id: number;
    roundId: number;
    amount: number;
    colorBetted: WheelColor;
    winningColor: WheelColor;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
};

const wheelOfFortuneColumns: ColumnDef<WheelOfFortuneBettingHistoryRow>[] = [
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
        header: "Color Betted",
        accessorKey: "colorBetted",
        cell: ({ row }) => (
            <Badge variant="outline" className={`capitalize ${WHEEL_COLOR_CONFIG[row.original.colorBetted].bgColor} ${WHEEL_COLOR_CONFIG[row.original.colorBetted].textColor}`}>
                {WHEEL_COLOR_CONFIG[row.original.colorBetted].name}
            </Badge>
        ),
    },
    {
        header: "Winning Color",
        accessorKey: "winningColor",
        cell: ({ row }) => (
            <Badge variant="outline" className={`capitalize ${WHEEL_COLOR_CONFIG[row.original.winningColor].bgColor} ${WHEEL_COLOR_CONFIG[row.original.winningColor].textColor}`}>
                {WHEEL_COLOR_CONFIG[row.original.winningColor].name}
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
                    {INR(row.original.netProfitLoss)}
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

export default wheelOfFortuneColumns;