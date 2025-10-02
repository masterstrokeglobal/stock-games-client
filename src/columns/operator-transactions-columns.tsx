import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { useSettleTransaction } from "@/react-query/operator-queries";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckCircle } from "lucide-react";
import React from "react";

const createOperatorTransactionColumns = (currentUserEmail?: string, currentOperator?: any): ColumnDef<Transaction>[] => [
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
        cell: ({ row }) => <div>{row.original.counterpartyName || row.original.userName || row.original.user?.username || 'N/A'}</div>,
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
            const t = row.original as Transaction;
            const isUserDeposit = t.type === TransactionType.DEPOSIT && !!t.wallet;
            const isUserWithdrawal = t.type === TransactionType.WITHDRAWAL && !!t.wallet;
            const isInternal = !t.wallet;

            let displayType: string = t.type;
            let variant: "success" | "outline" | "destructive" = "outline";

            if (isUserDeposit) {
                displayType = "Deposit";
            } else if (isUserWithdrawal) {
                displayType = "Withdrawal";
                variant = "success";
            } else if (isInternal && t.type === TransactionType.DEPOSIT) {
                displayType = "Operator Transfer";
            } else if (isInternal && t.type === TransactionType.WITHDRAWAL) {
                displayType = "Operator Transfer";
            } else if ((t as any).type === "operator_deposit") {
                displayType = "Operator Transfer";
            } else {
                displayType = (t.type as string).split("_").join(" ");
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
    // From (intelligent mapping)
    {
        header: "From",
        accessorKey: "fromDisplay",
        cell: ({ row }) => {
            const t = row.original;
            const type = String(t.type).toLowerCase();
            const user = t.wallet?.user;
            const depositorOp = t.depositorOperatorWallet?.operator;
            // const creditorOp = t.creditorOperatorWallet?.operator;

            let name: string | undefined;
            let email: string | undefined;
            let roleText: string | undefined;

            const prettyRole = (role?: string) => role ? role.split("_").map(r => r[0]?.toUpperCase() + r.slice(1)).join(" ") : undefined;

            // Use the new counterparty fields first, then fallback to existing logic
            if (t.counterpartyName && t.counterpartyType === "user") {
                name = t.counterpartyName;
                roleText = "User";
            } else if (t.counterpartyName && t.counterpartyType === "operator") {
                name = t.counterpartyName;
                roleText = "Operator";
            } else if (t.counterpartyName && t.counterpartyType === "company") {
                name = "Company";
                roleText = "Company";
            } else if (type === "deposit") {
                // Agent/Company -> User
                name = depositorOp?.name || "Company Wallet";
                email = depositorOp?.email;
                roleText = depositorOp ? prettyRole(depositorOp.role) : "Company";
            } else if (type === "withdrawal") {
                // User -> Agent/Company
                name = t.userName || user?.username || "User";
                email = user?.email || undefined;
                roleText = "User";
            } else if (type === "winning" || type === "points_earned") {
                // Platform -> User
                name = "Platform";
                roleText = "Platform";
            } else if (type === "placement") {
                // User -> Platform
                name = t.userName || user?.username || "User";
                email = user?.email || undefined;
                roleText = "User";
            } else {
                // Fallbacks
                name = depositorOp?.name || t.userName || user?.username || undefined;
                email = depositorOp?.email || user?.email || undefined;
                roleText = depositorOp ? prettyRole(depositorOp.role) : (user ? "User" : undefined);
            }

            if (!name) return <div className="text-gray-500">N/A</div>;

            return (
                <div className="text-sm">
                    <div className="font-medium">{name}{roleText ? ` (${roleText})` : ""}</div>
                    {email && <div className="text-gray-500 text-xs">{email}</div>}
                </div>
            );
        },
    },
    // To (intelligent mapping)
    {
        header: "To",
        accessorKey: "toDisplay",
        cell: ({ row }) => {
            const t = row.original;
            const type = String(t.type).toLowerCase();
            const user = t.wallet?.user;
            // const depositorOp = t.depositorOperatorWallet?.operator;
            const creditorOp = t.creditorOperatorWallet?.operator;

            let name: string | undefined;
            let email: string | undefined;
            let roleText: string | undefined;

            const prettyRole = (role?: string) => role ? role.split("_").map(r => r[0]?.toUpperCase() + r.slice(1)).join(" ") : undefined;

            // Use the new counterparty fields first, then fallback to existing logic
            if (t.counterpartyName && t.counterpartyType === "user") {
                name = t.counterpartyName;
                roleText = "User";
            } else if (t.counterpartyName && t.counterpartyType === "operator") {
                name = t.counterpartyName;
                roleText = "Operator";
            } else if (t.counterpartyName && t.counterpartyType === "company") {
                name = "Company";
                roleText = "Company";
            } else if (type === "deposit") {
                // Agent/Company -> User
                name = t.userName || user?.username || creditorOp?.name || "User";
                email = user?.email || creditorOp?.email || undefined;
                roleText = user ? "User" : (creditorOp ? prettyRole(creditorOp.role) : undefined);
            } else if (type === "withdrawal") {
                // User -> Agent/Company
                name = creditorOp?.name || "Company Wallet";
                email = creditorOp?.email || undefined;
                roleText = creditorOp ? prettyRole(creditorOp.role) : "Company";
            } else if (type === "winning" || type === "points_earned") {
                // Platform -> User
                name = t.userName || user?.username || "User";
                email = user?.email || undefined;
                roleText = "User";
            } else if (type === "placement") {
                // User -> Platform
                name = "Platform";
                roleText = "Platform";
            } else {
                // Fallbacks
                name = creditorOp?.name || t.userName || user?.username || undefined;
                email = creditorOp?.email || user?.email || undefined;
                roleText = creditorOp ? prettyRole(creditorOp.role) : (user ? "User" : undefined);
            }

            if (!name) return <div className="text-gray-500">N/A</div>;

            return (
                <div className="text-sm">
                    <div className="font-medium">{name}{roleText ? ` (${roleText})` : ""}</div>
                    {email && <div className="text-gray-500 text-xs">{email}</div>}
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
        cell: ({ row }) => <SettleColumn transaction={row.original} currentOperator={currentOperator} />,
    }
];

export default createOperatorTransactionColumns;
const SettleColumn = ({ transaction, currentOperator }: { transaction: Transaction; currentOperator?: any }) => {
    const queryClient = useQueryClient();
    const { mutate: settleTransaction, isPending } = useSettleTransaction();
    const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);

    // Show approve/reject only for AGENT role and when transaction is pending.
    // Agents are allowed if they are the receiver (creditor) or sender (depositor) of the transaction.
    const isPendingTx = transaction.status === TransactionStatus.PENDING;
    const currentOperatorId = currentOperator?.id;
    const isAgent = currentOperator?.isAgent;
    const isReceiver = transaction?.creditorOperatorWallet?.operator?.id === currentOperatorId;
    const isSender = transaction?.depositorOperatorWallet?.operator?.id === currentOperatorId;

    // Hide entirely for non-agents (view-only for masters and above)
    if (!isAgent) {
        return <div className="text-sm text-gray-500 text-center">N/A</div>;
    }

    if (!isPendingTx) {
        return <div className="text-sm text-gray-500 text-center">N/A</div>;
    }

    if (!(isReceiver || isSender)) {
        return <div className="text-sm text-gray-500 text-center">N/A</div>;
    }

    const handleSettle = (status: TransactionStatus) => {
        settleTransaction({ 
            transactionId: transaction.id, 
            status 
        }, {
            onSuccess: () => {
                // Invalidate all transaction-related queries to refresh the data
                queryClient.invalidateQueries({
                    predicate: (query) => 
                        query.queryKey[0] === "hierarchical-transactions" ||
                        query.queryKey[0] === "operator-transactions" ||
                        query.queryKey[0] === "operator-wallet-transactions"
                });
                setShowAcceptDialog(false);
                setShowRejectDialog(false);
            }
        });
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
