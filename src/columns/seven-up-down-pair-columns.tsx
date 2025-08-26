import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SevenUpDownPair from "@/models/seven-up-down-pair";
import { useDeleteSevenUpDownPair } from "@/react-query/seven-up-down-pair-queries";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit2, Loader2, Trash } from "lucide-react";
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
            <ActionCell row={row} />
        ),
    },
];


const ActionCell = ({ row }: { row: Row<SevenUpDownPair> }) => {
    const { mutate: deleteCoinTossPair, isPending } = useDeleteSevenUpDownPair();
    return (
        <AlertDialog>

            <div className="flex justify-end">
                <Link href={`/dashboard/seven-up-down-pair/${row.original.id}`}>
                    <Button variant="ghost" aria-label="View Holiday">
                        <Edit2 size={18} />
                    </Button>
                </Link>
                <AlertDialogTrigger asChild>
                    <Button disabled={isPending} variant="ghost" aria-label="Delete Holiday">
                        {isPending ? <Loader2 size={18} className="animate-spin" /> : <Trash size={18} />}
                    </Button>
                </AlertDialogTrigger>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure
                        you want to delete this coin toss pair?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel  >Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        deleteCoinTossPair(row.original.id?.toString() ?? "");
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default sevenUpDownPairColumns;