import { ColumnDef } from "@tanstack/react-table";
import { JackpotPair } from "@/models/jackpot-pair";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const jackpotPairColumns: ColumnDef<JackpotPair>[] = [
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
                <Link href={`/dashboard/jackpot-pair/${row.original.id}`}>
                    <Button variant="outline">Edit</Button>
                </Link>
            </div>
        ),
    },
];

export default jackpotPairColumns;