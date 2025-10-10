"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BetHistory } from "@/models/bet-history";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

const betHistoryColumns: ColumnDef<BetHistory>[] = [
    {
        accessorKey: "id",
        header: "Bet ID",
        cell: ({ row }) => {
            const betHistory = row.original;
            return <span className="font-medium">#{betHistory.id}</span>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date & Time",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <div className="flex flex-col">
                    <span className="text-sm">
                        {dayjs(betHistory.createdAt).format("MMM DD, YYYY")}
                    </span>
                    <span className="text-xs text-gray-500">
                        {dayjs(betHistory.createdAt).format("hh:mm A")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{betHistory.username}</span>
                    <span className="text-xs text-gray-500">ID: {betHistory.userId}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "companyName",
        header: "Company",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <span className="text-sm">{betHistory.companyName || "N/A"}</span>
            );
        },
    },
    {
        accessorKey: "gameType",
        header: "Game Type",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <Badge variant="outline" className="capitalize">
                    {betHistory.gameType}
                </Badge>
            );
        },
    },
    {
        accessorKey: "amount",
        header: "Bet Amount",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <span className="font-semibold text-blue-600">
                    ₹{betHistory.amount?.toLocaleString()}
                </span>
            );
        },
    },
    {
        accessorKey: "winAmount",
        header: "Profit/Loss",
        cell: ({ row }) => {
            const betHistory = row.original;
            
            // If winAmount is 0, show 0
            if (!betHistory.winAmount || betHistory.winAmount === 0) {
                return (
                    <span className="font-semibold text-gray-400">
                        ₹0
                    </span>
                );
            }
            
            // Otherwise show winAmount - betAmount (profit)
            const profit = betHistory.winAmount - (betHistory.amount || 0);
            
            return (
                <span className={cn(
                    "font-semibold",
                    profit > 0 
                        ? "text-green-600" 
                        : profit < 0
                        ? "text-red-600"
                        : "text-gray-400"
                )}>
                    ₹{Math.abs(profit).toLocaleString()}
                </span>
            );
        },
    },
    {
        accessorKey: "placement",
        header: "Placement/Bet",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <span className="text-sm capitalize">
                    {betHistory.placement || "N/A"}
                </span>
            );
        },
    },
    {
        accessorKey: "isWinner",
        header: "Result",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <Badge
                    variant={betHistory.isWinner ? "default" : "destructive"}
                    className={cn(
                        betHistory.isWinner
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                    )}
                >
                    {betHistory.isWinner ? "Win" : "Loss"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "roundId",
        header: "Round ID",
        cell: ({ row }) => {
            const betHistory = row.original;
            return (
                <span className="text-xs text-gray-500">
                    {betHistory.roundId || "N/A"}
                </span>
            );
        },
    },
];

export default betHistoryColumns;


