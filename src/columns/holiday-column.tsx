import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Holiday } from "@/models/holiday";
import { useDeleteHoliday } from "@/react-query/holiday-queries";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2, Loader2, Trash } from "lucide-react";
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
            <span>{dayjs(row.original.startDate).format("DD-MM-YYYY")}</span>
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
            <ActionCell row={row} />
        ),
    },
];


const ActionCell = ({ row }: { row: Row<Holiday> }) => {
    const { mutate: deleteHoliday, isPending } = useDeleteHoliday();
    return (
        <AlertDialog>

            <div className="flex justify-end">
                <Link href={`/dashboard/holiday/${row.original.id}`}>
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
                        you want to delete this holiday?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be  undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        deleteHoliday(row.original.id.toString());
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};


export default holidayColumns;