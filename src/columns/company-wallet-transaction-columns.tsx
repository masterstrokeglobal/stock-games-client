import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2 } from "lucide-react"; // Import necessary icons
import Link from "next/link"; // Adjust import path

const companyWalletTransactionColumns: ColumnDef<Transaction>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
        header: "Company",
        accessorKey: "user",
        cell: ({ row }) => <Link href={`/dashboard/company/${row.original.company?.id}/view`}>{row.original.company?.name || 'N/A'}</Link>,
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => (
            <Badge variant={row.original.type === TransactionType.DEPOSIT ? "success" : "destructive"}>
                {row.original.type}
            </Badge>
        ),
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

export default companyWalletTransactionColumns;


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

    return "-";
}