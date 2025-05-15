import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Ledger, { LedgerEntryType } from "@/models/ledger";
import { useDeleteLedgerEntry } from "@/react-query/ledger-queries";
import { ColumnDef, Row } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Loader2, PencilIcon, Trash2 } from "lucide-react";
import Link from "next/link";


const LedgerColumns: ColumnDef<Ledger>[] = [
    {
        header: "Date",
        accessorKey: "createdAt",
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => {
            return <div className={cn("font-semibold", row.original.entryType !== LedgerEntryType.PAID ? "text-green-500" : "text-red-500")}>
                {row.original.entryType !== LedgerEntryType.PAID ? "+ " : "- "}
                Rs.{row.original.amount}</div>
        }
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
            return <Badge variant={row.original.entryType === LedgerEntryType.PAID ? "destructive" : "success"} >
                {row.original.entryType === LedgerEntryType.PAID ? "Paid" : "Received"}
            </Badge>
        }
    },
    {
        header: "Company",
        accessorKey: "company",
        cell: ({ row }) => {
            return <div>{row.original.company?.name}</div>
        }
    },
    {
        header: "Created By",
        accessorKey: "createdBy",
        cell: ({ row }) => {
            return <div>{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</div>
        }
    },

    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn row={row} />
    }

]

export default LedgerColumns;

const ActionColumn = ({ row }: { row: Row<Ledger> }) => {
    const { mutate: deleteUser, isPending: deleting } = useDeleteLedgerEntry();

    const handleDeleting = () => {
        deleteUser(row.original.id.toString(), {});
    }


    return (
        <AlertDialog>
            <div className="flex space-x-4 min-w-36 justify-start">
                <Link href={`/dashboard/company-ledger/${row.original.id}`}>
                    <Button size="icon" variant="ghost" aria-label="View User">
                        <PencilIcon className="w-5 h-5" />
                    </Button>
                </Link>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete User"
                        disabled={deleting}
                    >
                        {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </Button>
                </AlertDialogTrigger>
            </div>

            <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-gray-600">
                        This action cannot be undone. This will permanently delete the user account and remove their data
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 flex justify-end space-x-3">
                    <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleDeleting}>
                            Delete Entry
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
