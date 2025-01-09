import dayjs from "dayjs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

const bettingHistoryColumns = [
    {
        accessorKey: "round",
        header: "Round",
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2">
                <span>Round #{row.original.roundId}</span>
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Date & Time",
        cell: ({ row }: any) => dayjs(row.original.createdAt).format('DD MMM YYYY, h:mm A'),
    },
    {
        accessorKey: "placementType",
        header: "Bet Type",
        cell: ({ row }: any) => (
            <span className="font-semibold capitalize">
                {row.original.placeValue}
            </span>
        ),
    },
  
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }: any) => (
            <span className="font-bold">
                ${row.original.amount.toFixed(2)}
            </span>
        ),
    },
    {
        // winnername
        accessorKey: "winner",
        header: "Winner",
        cell: ({ row }: any) => (
            <span className="font-semibold">
                {row.original.winnerName}
            </span>
        ),
    },
    {
        accessorKey: "isWinner",
        header: "Status",
        cell: ({ row }: any) => (
            <div className={`flex items-center gap-2 ${row.original.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                {row.original.isWinner ? (
                    <ArrowUpCircle className="w-5 h-5 text-green-400" />
                ) : (
                    <ArrowDownCircle className="w-5 h-5 text-red-400" />
                )}
                {row.original.isWinner ? 'Won' : 'Lost'}
            </div>
        ),
    },
];

export default bettingHistoryColumns;