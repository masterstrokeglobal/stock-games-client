"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StandardizedBettingHistory {
    roundId: number;
    gameName: string;
    marketType?: string;
    placementAmount: number;
    winningAmount: number;
    result: string;
    netProfitLoss: number;
    createdAt: string;
}

const allGamesColumns: ColumnDef<StandardizedBettingHistory>[] = [
    {
        accessorKey: "roundId",
        header: "Round ID",
        cell: ({ row }) => (
            <span className="font-medium">#{row.original.roundId}</span>
        ),
    },
    {
        accessorKey: "gameName",
        header: "Game Type",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.gameName.replace(/_/g, " ")}
            </Badge>
        ),
    },
    {
        accessorKey: "marketType",
        header: "Market Type",
        cell: ({ row }) => (
            <span className="text-sm font-medium">
                {row.original.marketType || "N/A"}
            </span>
        ),
    },
    {
        accessorKey: "placementAmount",
        header: "Placement Amount",
        cell: ({ row }) => (
            <span className="font-semibold text-blue-600">
                ₹{row.original.placementAmount.toLocaleString()}
            </span>
        ),
    },
    {
        accessorKey: "winningAmount",
        header: "Winning Amount",
        cell: ({ row }) => (
            <span className="font-semibold text-green-600">
                {row.original.winningAmount > 0 
                    ? `₹${row.original.winningAmount.toLocaleString()}`
                    : "₹0"
                }
            </span>
        ),
    },
    {
        accessorKey: "result",
        header: "Result",
        cell: ({ row }) => {
            const isWin = row.original.result === "Win";
            return (
                <Badge
                    variant={isWin ? "default" : "destructive"}
                    className={cn(
                        isWin
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                    )}
                >
                    {row.original.result}
                </Badge>
            );
        },
    },
    {
        accessorKey: "netProfitLoss",
        header: "Net Profit/Loss",
        cell: ({ row }) => {
            const profit = row.original.netProfitLoss;
            return (
                <span
                    className={cn(
                        "font-bold",
                        profit > 0
                            ? "text-green-600"
                            : profit < 0
                            ? "text-red-600"
                            : "text-gray-500"
                    )}
                >
                    {profit > 0 ? "+" : ""}₹{profit.toLocaleString()}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date & Time",
        cell: ({ row }) => (
            <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm">
                    {dayjs(row.original.createdAt).format("MMM DD, YYYY")}
                </span>
                <span className="text-xs text-gray-500">
                    {dayjs(row.original.createdAt).format("hh:mm A")}
                </span>
            </div>
        ),
    },
];

export default allGamesColumns;

