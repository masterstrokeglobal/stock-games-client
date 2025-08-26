import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OperatorRole } from "@/models/operator";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Eye, Wallet } from 'lucide-react';
import Link from "next/link";

type Operator = {
    id: number;
    name: string;
    email: string;
    role: OperatorRole;
    percentage: number;
    companyId: number;
    balance: number;
    maxBalance: number;
    bettingStatus: boolean;
    transferStatus: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}
const operatorColumns: ColumnDef<Operator>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.name}</div>,
    },
    {
        header: "EMAIL",
        accessorKey: "email",
        cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.email}</div>,
    },
    {
        header: "ROLE",
        accessorKey: "role",
        cell: ({ row }) => {
            const roleColors = {
                super_duper_master: "bg-purple-100 text-purple-800",
                duper_master: "bg-blue-100 text-blue-800",
                master: "bg-green-100 text-green-800",
                agent: "bg-yellow-100 text-yellow-800",
            };
            const roleLabels = {
                super_duper_master: "Super Duper Master",
                duper_master: "Duper Master",
                master: "Master",
                agent: "Agent",
            };
            return (
                <Badge className={`whitespace-nowrap ${roleColors[row.original.role]}`}>
                    {roleLabels[row.original.role]}
                </Badge>
            );
        }
    },
    {
        header: "PERCENTAGE",
        accessorKey: "percentage",
        cell: ({ row }) => <div className="text-left">{row.original.percentage}%</div>,
    },
    {
        header: "BALANCE",
        accessorKey: "balance",
        cell: ({ row }) => <div className="text-left">{row.original.balance}</div>,
    },
    {
        header: "MAX BALANCE",
        accessorKey: "maxBalance",
        cell: ({ row }) => <div className="text-left">{row.original.maxBalance}</div>,
    },
    {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
            const statusColors = {
                active: "bg-green-100 text-green-800",
                inactive: "bg-red-100 text-red-800",
                suspended: "bg-yellow-100 text-yellow-800",
            };
            return (
                <Badge className={statusColors[row.original.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                    {row.original.status}
                </Badge>
            );
        }
    },
    {
        header: "BETTING",
        accessorKey: "bettingStatus",
        cell: ({ row }) => (
            <Badge className={row.original.bettingStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {row.original.bettingStatus ? "Enabled" : "Disabled"}
            </Badge>
        )
    },
    {
        header: "TRANSFER",
        accessorKey: "transferStatus",
        cell: ({ row }) => (
            <Badge className={row.original.transferStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {row.original.transferStatus ? "Enabled" : "Disabled"}
            </Badge>
        )
    },
    {
        header: "CREATED ON",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-[#6B7280]">
                {dayjs(row.original.createdAt).format("DD-MM-YYYY")}
            </span>
        ),
    },
    {
        header: "",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn operator={row.original} />,
    },
];

const ActionColumn = ({ operator }: { operator: Operator }) => {
    return (
        <div className="flex space-x-4 w-36 justify-end">
            <Link href={`/operator-dashboard/operator/${operator.id}`}>
                <Button size="icon" variant="ghost" aria-label="View Operator">
                    <Eye className="w-5 h-5" />
                </Button>
            </Link>
            <Link href={`/operator-dashboard/operator/${operator.id}/deposit`}>
                <Button size="icon" variant="ghost" aria-label="View Wallet">
                    <Wallet className="w-5 h-5" />
                </Button>
            </Link>
        </div>
    );
};

export default operatorColumns;