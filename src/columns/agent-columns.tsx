import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { Eye, Users2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Agent from "@/models/agent";

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