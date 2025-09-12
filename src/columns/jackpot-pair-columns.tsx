import { ColumnDef, Row } from "@tanstack/react-table";
import { JackpotPair } from "@/models/jackpot-pair";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit2, Loader2, Trash } from "lucide-react";
import { useDeleteJackpotPair } from "@/react-query/jackpot-pair-queries";


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
            <ActionCell row={row} />
        ),
    },
];

const ActionCell = ({ row }: { row: Row<JackpotPair> }) => {
    const { mutate: deleteJackpotPair, isPending } = useDeleteJackpotPair();
    return (
        <AlertDialog>

            <div className="flex justify-end">
                <Link href={`/dashboard/jackpot-pair/${row.original.id}`}>
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
                        deleteJackpotPair(row.original.id?.toString() ?? "");
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


export default jackpotPairColumns;