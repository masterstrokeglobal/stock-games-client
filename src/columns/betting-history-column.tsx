import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

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
        header: "Round",
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2 whitespace-nowrap">
                <span>Round #{row.original.roundId}</span>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Date & Time",
        cell: ({ row }: any) => <span className="whitespace-nowrap">{dayjs(row.original.createdAt).format('DD MMM YYYY, h:mm A')}</span>,
    },
    {
        accessorKey: "placementType",
        header: "Bet Type",
        cell: ({ row }: any) => (
            <span className="font-semibold capitalize whitespace-nowrap">
                {row.original.placedValues ?? row.original.placementType ?? "-"}
            </span>
        ),
    },

    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: any) => (
            <span className="font-bold whitespace-nowrap">
                ${row.original.amount.toFixed(2)}
            </span>
        ),
    },
    {
        // winnername
        accessorKey: "winner",
        header: "Winner",
        cell: ({ row }: any) => (
            <span className="font-semibold whitespace-nowra">
                {row.original.winnerName.length !== 0 ? row.original.winnerName : "-"}
            </span>
        ),
    },
    {
        accessorKey: "isWinner",
        header: "Status",
        cell: ({ row }) => {
            console.log(row.original.winnerName.length);
            if (row.original?.winnerName === "") return <span className="text-gray-400">Pending</span>;

            return (
                <div className={`flex items-center gap-2 ${row.original.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                    {(row.original.isWinner) ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-400" />
                    ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-400" />
                    )}
                    {row.original.isWinner ? 'Won' : 'Lost'}
                </div>
            )
        },
    },
];

export default bettingHistoryColumns;