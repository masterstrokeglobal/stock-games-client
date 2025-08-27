import { Button } from "@/components/ui/button";
import User from "@/models/user";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Eye, Wallet } from 'lucide-react';
import Link from "next/link";

const operatorUserColumns: ColumnDef<User>[] = [
  {
    header: "NAME",
    accessorKey: "name",
    cell: ({ row }) => <div className="w-48 truncate">{row.original.name}</div>,
  },
  {
    header: "EMAIL",
    accessorKey: "email",
    cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.email ?? "N/A"}</div>,
  },
  {
    header: "USERNAME",
    accessorKey: "username",
    cell: ({ row }) => <div className="w-48 truncate">{row.original.username}</div>,
  },
  {
    header: "PHONE",
    accessorKey: "phone",
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.phone || 'N/A'}</div>,
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
    cell: ({ row }) => <OperatorActionColumn user={row.original} />,
  },
];

const OperatorActionColumn = ({ user }: { user: User }) => {
  return (
    <div className="flex space-x-2 w-24 justify-end">
      <Link href={`/operator-dashboard/users/${user.id}`}>
        <Button size="icon" variant="ghost" aria-label="View User">
          <Eye className="w-5 h-5" />
        </Button>
      </Link>
      <Link href={`/operator-dashboard/users/${user.id}/wallet`}>
        <Button size="icon" variant="ghost" aria-label="Manage Wallet">
          <Wallet className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};

export default operatorUserColumns;
