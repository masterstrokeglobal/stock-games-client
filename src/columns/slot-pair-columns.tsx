import { ColumnDef } from "@tanstack/react-table";
import { SlotPair } from "@/models/slot-pair";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slotPairColumns: ColumnDef<SlotPair>[] = [
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
        header: "Market Items",
        accessorKey: "marketItems",
        cell: ({ row }) => (
            <div>
                <div className="text-sm text-muted-foreground">{row.original?.marketItems?.map((item) => item.name).join(", ")}</div>
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
    },
    {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => (
            <div>
                <Link href={`/dashboard/slot-pair/${row.original.id}`}>
                    <Button variant="outline">Edit</Button>
                </Link>
            </div>
        ),
    },
];

export default slotPairColumns;