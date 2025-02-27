import { Badge } from "@/components/ui/badge";
import { Transaction, TransactionStatus, TransactionType } from "@/models/transaction";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

const companyWalletColumns: ColumnDef<Transaction>[] = [
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
        header: "Bonus Percentage",
        accessorKey: "bonusPercentage",
        cell: ({ row }) => <div>{row.original.bonusPercentage}%</div>,
    },
    {
        header: "Created On",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span>{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</span>
        ),
    },

];

export default companyWalletColumns;
