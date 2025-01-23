import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Contact from "@/models/contact";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from 'lucide-react';
import Link from "next/link";


const contactColumns: ColumnDef<Contact>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.user?.name}</div>,
    },
    {
        header: "EMAIL",
        accessorKey: "email",
        cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.user?.email}</div>,
    },
    {
        header: "SUBJECT",
        accessorKey: "subject",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.subject}</div>,
    },
    {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {

            return (
                <Badge >
                    {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                </Badge>
            );
        },
    },
    {
        header: "",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn contact={row.original} />,
    },
];

const ActionColumn = ({ contact }: { contact: Contact }) => {

    return (
        <div className="flex space-x-4 w-36 justify-end">
            <Link href={`/dashboard/contact/${contact.id}`}>
                <Button size="icon" variant="ghost" aria-label="View Contact">
                    <Eye className="w-5 h-5" />
                </Button>
            </Link>
        </div>

    );
};

export default contactColumns;