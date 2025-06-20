import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SevenUpDownPair from "@/models/seven-up-down-pair";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";

const sevenUpDownPairColumns: ColumnDef<SevenUpDownPair>[] = [
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
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="text-sm text-muted-foreground max"
                                title={row.original?.marketItems?.map((item) => item.name).join(", ")}
                            >
                                {row.original?.marketItems?.slice(0, 5).map((item) => item.name).join(", ")}
                                {row.original?.marketItems && row.original.marketItems.length > 5 && "..."}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            {row.original?.marketItems?.map((item) => item.name).join(", ")}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
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
                <Link href={`/dashboard/seven-up-down-pair/${row.original.id}`}>
                    <Button variant="outline">Edit</Button>
                </Link>
            </div>
        ),
    },
];

export default sevenUpDownPairColumns;