import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2 } from "lucide-react"; // Import necessary icons
import Link from "next/link"; // Adjust import path

const agentWalletTransactionColumns: ColumnDef<Transaction>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
        header: "Agent/User",
        accessorKey: "agent",
        cell: ({ row }) => {
            if (row.original.type === TransactionType.DEPOSIT || row.original.type === TransactionType.WITHDRAWAL) {
                return <Link href={`/dashboard/users/${row.original.user?.id}`}>{row.original.user?.firstname || 'N/A'}</Link>;
            }
            return <Link href={`/dashboard/agents/${row.original.agent?.id}`}>{row.original.agent?.firstname || 'N/A'}</Link>;
        }
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
            let type: string = row.original.type;
            let variant: any = "secondary";

            switch (type) {
                case TransactionType.WITHDRAWAL:
                    variant = "success";
                    break;

                case TransactionType.DEPOSIT:
                    variant = "warning";
                    break;

                case TransactionType.ADMIN_DEPOSIT:
                    variant = "success";
                    break;

                case TransactionType.ADMIN_WITHDRAWAL:
                    variant = "warning";
                    break;

                case TransactionType.AGENT_DEPOSIT:
                    variant = "success";
                    break;

                case TransactionType.AGENT_WITHDRAWAL:
                    variant = "warning";
                    

                default:
                    break;
            }

            if (type === TransactionType.DEPOSIT) {
                type = "User Withdrawl";
            }

            if (type === TransactionType.WITHDRAWAL) {
                type = "User Deposit";
            }

            type = type.replace(/_/g, " ");

            return <Badge variant={variant} className="capitalize">
                {type}
            </Badge>
        },
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => <div>Rs. {row.original.amount.toFixed(2)}</div>,
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === TransactionStatus.COMPLETED ? "success" : "outline"}>
                {row.original.status}
            </Badge>
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
            <ActionColumn transaction={row.original} />
        ),
    },
];

export default agentWalletTransactionColumns;

const ActionColumn = ({ transaction }: { transaction: Transaction }) => {

    const { userDetails } = useAuthStore();

    const admin = userDetails as Admin;

    if (admin.isSuperAdmin)
        return (
            <div className="flex justify-end">
                <Link href={`/dashboard/company-wallet/${transaction.id}`}>
                    <Button variant="ghost" aria-label="View Transaction">
                        <Edit2 size={18} />
                    </Button>
                </Link>
            </div>
        );

    if (admin.isCompanyAdmin && (transaction.type === TransactionType.AGENT_DEPOSIT || transaction.type === TransactionType.AGENT_WITHDRAWAL))
        return (
            <div className="flex justify-end">
                <Link href={`/dashboard/agents/wallet/${transaction.id}`}>
                    <Button variant="ghost" aria-label="View Transaction">
                        <Edit2 size={18} />
                    </Button>
                </Link>
            </div>
        );

    if (admin.isAgent && (transaction.type === TransactionType.WITHDRAWAL || transaction.type === TransactionType.DEPOSIT))
        return (
            <div className="flex justify-end">
                <Link href={`/dashboard/agents/wallet/transactions/${transaction.id}`}>
                    <Button variant="ghost" aria-label="View Transaction">
                        <Edit2 size={18} />
                    </Button>
                </Link>
            </div>
        );

    return "-";
}