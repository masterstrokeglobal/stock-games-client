import { ColumnDef } from "@tanstack/react-table";

type ReportItem = {
    gametype: string;
    roundrecordgametype: string;
    userid: number;
    username: string;
    totalplaced: string;
    totalwinning: string;
    netholding: number;
    percentageShare: number;
    shareAmount: number;
}

const reportColumns: ColumnDef<ReportItem>[] = [
    {
        header: "GAME TYPE",
        accessorKey: "gametype",
        cell: ({ row }) => <div className="w-32 truncate capitalize">{row.original.gametype}</div>,
    },
    {
        header: "ROUND RECORD GAME TYPE",
        accessorKey: "roundrecordgametype",
        cell: ({ row }) => <div className="w-40 truncate capitalize">{row.original.roundrecordgametype?.replace(/_/g, ' ')}</div>,
    },
    {
        header: "USERNAME",
        accessorKey: "username",
        cell: ({ row }) => <div className="w-32 truncate text-left">{row.original.username}</div>,
    },
    {
        header: "TOTAL PLACED",
        accessorKey: "totalplaced",
        cell: ({ row }) => <div className="text-left">₹{parseFloat(row.original.totalplaced).toFixed(2)}</div>,
    },
    {
        header: "TOTAL WINNING",
        accessorKey: "totalwinning",
        cell: ({ row }) => <div className="text-left">₹{parseFloat(row.original.totalwinning).toFixed(2)}</div>,
    },
    {
        header: "NET HOLDING",
        accessorKey: "netholding",
        cell: ({ row }) => (
            <div className={`text-left font-medium ${row.original.netholding >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{row.original.netholding.toFixed(2)}
            </div>
        ),
    },
    {
        header: "PERCENTAGE SHARE",
        accessorKey: "percentageShare",
        cell: ({ row }) => <div className="text-left">{row.original.percentageShare}%</div>,
    },
    {
        header: "SHARE AMOUNT",
        accessorKey: "shareAmount",
        cell: ({ row }) => (
            <div className={`text-left font-medium ${row.original.shareAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{row.original.shareAmount.toFixed(2)}
            </div>
        ),
    },
];

export default reportColumns;
