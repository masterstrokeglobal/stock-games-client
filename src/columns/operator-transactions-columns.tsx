import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { useGetCurrentOperator, useSettleTransaction } from "@/react-query/operator-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckCircle } from "lucide-react";
import React from "react";

const operatorTransactionColumns: ColumnDef<Transaction>[] = [
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
   //depositer 
    {
        header: "Depositer",
        accessorKey: "user",
        cell: ({ row }) => <div>{row.original.depositorOperatorWallet?.operator?.name || 'N/A'}</div>,   
    },
    //withdrawer
    {
        header: "Creditor",
        accessorKey: "user",
        cell: ({ row }) => <div>{row.original.creditorOperatorWallet?.operator?.name || 'N/A'}</div>,
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
        header: "Settle",
        accessorKey: "settle",
        cell: ({ row }) => <SettleColumn transaction={row.original} />,
    }
];

export default operatorTransactionColumns;
const SettleColumn = ({ transaction }: { transaction: Transaction }) => {
    const { data: userDetails } = useGetCurrentOperator();
    const { mutate: settleTransaction, isPending } = useSettleTransaction();
    const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);

    // Only show for operator agents and if transaction is pending
    if (!userDetails?.isAgent || transaction.status !== TransactionStatus.PENDING) {
        return <div className="text-sm text-gray-500 text-center">N/A</div>;
    }

    const handleSettle = (status: TransactionStatus) => {
        settleTransaction({ transactionId: transaction.id, status });
        setShowAcceptDialog(false);
        setShowRejectDialog(false);
    };

    return (
        <>
            <div className="flex gap-2">
                <Button
                    variant="success"
                    size="sm"
                    disabled={isPending}
                    onClick={() => setShowAcceptDialog(true)}
                    className="flex items-center gap-2"
                >
                    <CheckCircle size={16} />
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
                            Are you sure you want to accept and settle this transaction? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => handleSettle(TransactionStatus.COMPLETED)}
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
                            onClick={() => handleSettle(TransactionStatus.FAILED)}
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

    if (!transaction.confirmationImageUrl) {
        return <div className="text-sm text-gray-500">No Image</div>;
    }

    return (
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger>
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
