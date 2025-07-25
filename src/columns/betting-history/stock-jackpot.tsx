import { MarketItem } from "@/models/market-item";
import { ColumnDef } from "@tanstack/react-table";


export type StockJackpotBettingHistoryRow = {
    id: number;
    roundId: number;
    amount: number;
    placementType: string;
    isWinner: boolean;
    createdAt: string;
    netProfitLoss: number;
    marketItem: MarketItem;
    intialPriceForMarket: number;
    finalPriceForMarket: number;
};

const stockJackpotColumns: ColumnDef<StockJackpotBettingHistoryRow>[] = [
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
        header: "Placement Type",
        accessorKey: "placementType",
        cell: ({ row }) => <div className="capitalize">{row.original.placementType}</div>,
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
        header: "Market",
        accessorKey: "marketItem",
        cell: ({ row }) => <div>{row.original.marketItem?.name || "-"}</div>,
    },
    {
        header: "Initial Price",
        accessorKey: "intialPriceForMarket",
        cell: ({ row }) => <div>{row.original.intialPriceForMarket ?? "-"}</div>,
    },
    {
        header: "Final Price",
        accessorKey: "finalPriceForMarket",
        cell: ({ row }) => <div>{row.original.finalPriceForMarket ?? "-"}</div>,
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

export default stockJackpotColumns; 