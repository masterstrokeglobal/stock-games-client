import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2 } from "lucide-react"; // Import necessary icons
import Link from "next/link"; // Adjust import path
import React from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useConfirmWithdrawal, useUpdateTransactionById } from "@/react-query/transactions-queries";

const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
        header: "Transaction ID",
        accessorKey: "pgId",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.pgId || 'N/A'}</div>,
    },
    {
        header: "User",
        accessorKey: "user",
        cell: ({ row }) => <div>{row.original.user?.username || 'N/A'}</div>,
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => (
            <Badge className="text-nowrap" variant={row.original.type === TransactionType.DEPOSIT ? "success" : "outline"}>
                {row.original.type.split("_").join(" ")}
            </Badge>
        ),
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => {
            if (row.original.type === TransactionType.POINTS_EARNED || row.original.type === TransactionType.POINTS_REDEEMED) {
                return <div className="text-nowrap">
                    {row.original.amount} Points
                </div>
            }
            return <div className="text-nowrap">Rs. {row.original.amount.toFixed(2)}</div>
        }
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === TransactionStatus.COMPLETED ? "success" : "outline"}>
                {row.original.status.split("_").join(" ")}
            </Badge>
        ),
    },
    {
        header: "Bonus Percentage",
        accessorKey: "bonusPercentage",
        cell: ({ row }) => <div>{row.original.bonusPercentage ? `${row.original.bonusPercentage}%` : 'N/A'}</div>,
    },
    {
        header: "Created On",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-sm whitespace-nowrap">{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</span>
        ),
    },

    {
        header: "Accept/Reject",
        accessorKey: "acceptReject",
        cell: ({ row }) => <StatusChangeColumn transaction={row.original} />,
    },
    {
        header: "Actions",
        accessorKey: "actions",
        cell: ({ row }) => (
            <div className="flex justify-end">
                <Link href={`/dashboard/transactions/${row.original.id}`}>
                    <Button variant="ghost" aria-label="View Transaction">
                        <Edit2 size={18} />
                    </Button>
                </Link>
            </div>
        ),
    },
];

export default transactionColumns;

const StatusChangeColumn = ({ transaction }: { transaction: Transaction }) => {
    const { mutate: updateTransaction, isPending: updatePending } = useUpdateTransactionById();
    const { mutate: confirmWithdrawal, isPending: withdrawalPending } = useConfirmWithdrawal();
    const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);

    const handleStatusChange = (status: TransactionStatus) => {
        if (transaction.type === TransactionType.WITHDRAWAL) {
            confirmWithdrawal({
                id: transaction.id,
                status: status
            });
        } else {
            updateTransaction({
                id: transaction.id,
                status: status
            });
        }
    };

    // Only show Accept/Reject for DEPOSIT and WITHDRAWAL and only if status is PENDING
    if (
        !(
            (transaction.type === TransactionType.WITHDRAWAL || transaction.type === TransactionType.DEPOSIT) &&
            transaction.status === TransactionStatus.PENDING
        )
    ) {
        return <div className="text-sm text-gray-500 text-center">N/A</div>;
    }

    const isPending = updatePending || withdrawalPending;

    return (
        <>
            <div className="flex gap-2">
                <Button
                    variant="success"
                    size="sm"
                    disabled={isPending}
                    onClick={() => setShowAcceptDialog(true)}
                >
                    {isPending ? "Processing..." : "Accept"}
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => setShowRejectDialog(true)}
                >
                    {isPending ? "Processing..." : "Reject"}
                </Button>
            </div>

            <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Accept Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to accept this transaction? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleStatusChange(TransactionStatus.COMPLETED)}
                            disabled={isPending}
                        >
                            {isPending ? "Processing..." : "Accept"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reject Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to reject this transaction? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleStatusChange(TransactionStatus.FAILED)}
                            disabled={isPending}
                        >
                            {isPending ? "Processing..." : "Reject"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};