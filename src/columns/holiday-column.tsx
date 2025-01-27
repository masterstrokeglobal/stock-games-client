import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Holiday } from "@/models/holiday";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2 } from "lucide-react";
import Link from "next/link";

const holidayColumns: ColumnDef<Holiday>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.type}
            </Badge>
        ),
    },
    {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => (
            <span>{dayjs(row.original.date).format("DD-MM-YYYY")}</span>
        ),
    },
    {
        header: "Created On",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span>{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</span>
        ),
    },
    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
            <div className="flex justify-end">
                <Link href={`/dashboard/holiday/${row.original.id}`}>
                    <Button variant="ghost" aria-label="View Holiday">
                        <Edit2 size={18} />
                    </Button>
                </Link>
            </div>
        ),
    },
];

export default holidayColumns;