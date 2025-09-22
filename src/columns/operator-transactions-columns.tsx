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

const createOperatorTransactionColumns = (currentUserEmail?: string): ColumnDef<Transaction>[] => [
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
        cell: ({ row }) => {
            const transaction = row.original;
            let displayType = transaction.type.split("_").join(" ");
            let variant: "success" | "outline" | "destructive" = "outline";
            
            // Color coding for different transaction types
            if (transaction.type === "withdrawal") {
                variant = "success"; // Green for withdrawals (money to master wallet)
                displayType = "Internal Withdrawal";
            } else if (transaction.type === "deposit") {
                variant = "outline"; // Default for deposits
                displayType = "Internal Deposit";
            } else if (transaction.type === "operator_deposit" as any) {
                variant = "outline"; // Default for operator deposits
                displayType = "Operator Transfer";
            }
            
            return (
                <Badge className="text-nowrap" variant={variant}>
                    {displayType}
                </Badge>
            );
        },
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => {
            const transaction = row.original;
            
            if (transaction.type === TransactionType.POINTS_EARNED || transaction.type === TransactionType.POINTS_REDEEMED) {
                return <div className="text-nowrap">
                    {transaction.amount} Points
                </div>
            }
            
            // Color coding for amounts - check if current user is receiving money
            const isReceivingMoney = transaction.creditorOperatorWallet?.operator?.email === currentUserEmail;
            const amountClass = isReceivingMoney ? "text-green-600 font-semibold" : "text-gray-900";
            const prefix = isReceivingMoney ? "+₹" : "₹";
            
            return (
                <div className={`text-nowrap ${amountClass}`}>
                    {prefix}{Math.abs(transaction.amount).toFixed(2)}
                </div>
            );
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
        header: "From",
        accessorKey: "depositorOperatorWallet",
        cell: ({ row }) => {
            const transaction = row.original;
            const depositor = transaction.depositorOperatorWallet?.operator;
            if (!depositor) return <div className="text-gray-500">N/A</div>;
            
            return (
                <div className="text-sm">
                    <div className="font-medium">{depositor.name}</div>
                    <div className="text-gray-500 text-xs">{depositor.email}</div>
                </div>
            );
        },   
    },
    //withdrawer
    {
        header: "To",
        accessorKey: "creditorOperatorWallet",
        cell: ({ row }) => {
            const transaction = row.original;
            const creditor = transaction.creditorOperatorWallet?.operator;
            if (!creditor) return <div className="text-gray-500">N/A</div>;
            
            return (
                <div className="text-sm">
                    <div className="font-medium">{creditor.name}</div>
                    <div className="text-gray-500 text-xs">{creditor.email}</div>
                </div>
            );
        },
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
            <div className="text-sm whitespace-nowrap">
                <div>{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</div>
                <div className="text-gray-500 text-xs">{dayjs(row.original.createdAt).format("HH:mm:ss")}</div>
            </div>
        ),
    },
    {
        header: "Settle",
        accessorKey: "settle",
        cell: ({ row }) => <SettleColumn transaction={row.original} />,
    }
];

export default createOperatorTransactionColumns;
const SettleColumn = ({ transaction }: { transaction: Transaction }) => {
    const { data: userDetails } = useGetCurrentOperator();
    const { mutate: settleTransaction, isPending } = useSettleTransaction();
    const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);

    // Only show approve/reject buttons for Masters and above (not for Agents) and if transaction is pending
    if (userDetails?.isAgent || transaction.status !== TransactionStatus.PENDING) {
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
