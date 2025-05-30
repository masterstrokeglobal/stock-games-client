import { ColumnDef } from "@tanstack/react-table";
import { CoinTossPair } from "@/models/coin-toss-pair";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

const coinTossPairColumns: ColumnDef<CoinTossPair>[] = [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => (
            <Badge variant="outline">{row.original.type}</Badge>
        ),
    },
    {
        header: "Head Market Item",
        accessorKey: "head",
        cell: ({ row }) => (
            <div>
                <div className="text-sm text-muted-foreground">{row.original.head.name}</div>
            </div>
        ),
    },
    {
        header: "Tail Market Item",
        accessorKey: "tail",
        cell: ({ row }) => (
            <div>
                <div className="text-sm text-muted-foreground">{row.original.tail.name}</div>
            </div>
        ),
    },
    {
        header: "Status",
        accessorKey: "active",
        cell: ({ row }) => (
            <Badge variant={row.original.active ? "success" : "destructive"}>
                {row.original.active ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => dayjs(row.original.createdAt).format("DD-MM-YYYY"),
    }
];

export default coinTossPairColumns;