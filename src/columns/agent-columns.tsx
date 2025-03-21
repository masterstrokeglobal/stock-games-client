import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { Eye, Users2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Agent from "@/models/agent";
import { Badge } from "@/components/ui/badge";

const agentColumns: ColumnDef<Agent>[] = [
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
        header: "REFERENCE CODE",
        accessorKey: "referenceCode",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.referenceCode}</div>,
    },
    {
        header: "COMPANY",
        accessorKey: "company",
        cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.company?.name || 'N/A'}</div>,
    },

    {
        header: "Placement Not Allowed",
        accessorKey: "placementAllowed",
        cell: ({ row }) => (
            // show in badges
            <div className="flex space-x-2">
                {row.original.placementNotAllowed.map((type) => (
                    <Badge key={type} variant="default" >
                        {type}
                    </Badge>
                ))}
                {row.original.placementNotAllowed.length === 0 && <span className="text-[#6B7280]">No Restriction</span>}
            </div>
        )
    },
    {
        header: "Transactions",
        accessorKey: "transactions",
        cell: ({ row }) => (
            <Link href={`/dashboard/agents/wallet?agentId=${row.original.id}`}>
                <Button variant="secondary" size='sm' aria-label="View Transactions">
                    View Transactions
                </Button>
            </Link>
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
        cell: ({ row }) => <ActionColumn agent={row.original} />,
    },
];

const ActionColumn = ({ agent }: { agent: Agent }) => {
    return (
        <div className="flex space-x-4 w-36 justify-end">
            <Link href={`/dashboard/agents/${agent.id}`}>
                <Button size="icon" variant="ghost" aria-label="View Agent">
                    <Eye className="w-5 h-5" />
                </Button>
            </Link>
            <Link href={`/dashboard/agents/${agent.id}/users`}>
                <Button size="icon" variant="ghost" aria-label="View Users">
                    <Users2 className="w-5 h-5" />
                </Button>
            </Link>
        </div>
    );
};

export default agentColumns;