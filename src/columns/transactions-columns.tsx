import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { useConfirmWithdrawal, useUpdateTransactionById } from "@/react-query/transactions-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2 } from "lucide-react"; // Import necessary icons
import Link from "next/link"; // Adjust import path
import React from "react";

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
        header: "Image URL",
        accessorKey: "imageUrl",
        cell: ({ row }) => <ImageColumn transaction={row.original} />,
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
        header: "Agent",
        accessorKey: "agent",
        cell: ({ row }) => {
            if (row.original.agent) {
                return <Link href={`/dashboard/agents/${row.original.agent?.id}`}>
                    <Badge variant="outline">
                        {row.original.agent?.name ?? "N/A"}
                    </Badge>
                </Link>
            }
            return <div className="text-nowrap">N/A</div>
        }
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

const ImageColumn = ({ transaction }: { transaction: Transaction }) => {
    const downloadImage = () => {
        const link = document.createElement("a");
        if (!transaction?.confirmationImageUrl) return;
        link.href = transaction.confirmationImageUrl;
        link.target = "_blank";
        link.download = "transaction-image.jpg";
        link.click();
        link.remove();
    };
    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger >
                    <img
                        src={transaction.confirmationImageUrl}
                        alt="Transaction Image"
                        width={50}
                        height={50}
                        className="rounded-md"
                    />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction Image</DialogTitle>
                        <DialogDescription>
                            <img
                                src={transaction.confirmationImageUrl}
                                alt="Transaction Image"
                                className="rounded-md w-auto mx-auto h-[500px] object-contain"
                            />
                        </DialogDescription>

                        <Button
                            onClick={downloadImage}
                        >
                            Download Image
                        </Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};