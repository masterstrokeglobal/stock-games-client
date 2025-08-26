import { ColumnDef, Row } from "@tanstack/react-table";
import { SlotPair } from "@/models/slot-pair";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useDeleteSlotPair } from "@/react-query/slot-pair-queries";
import { Edit2, Loader2, Trash } from "lucide-react";

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
            <ActionCell row={row} />
        ),
    },
];

const ActionCell = ({ row }: { row: Row<SlotPair> }) => {
    const { mutate: deleteSlotPair, isPending } = useDeleteSlotPair();
    return (
        <AlertDialog>

            <div className="flex justify-end">
                <Link href={`/dashboard/coin-toss-pair/${row.original.id}`}>
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
                        deleteSlotPair(row.original.id?.toString() ?? "");
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};



export default slotPairColumns;