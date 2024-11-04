import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import Admin, { AdminRole } from "@/models/admin";
import { Dialog } from "@/components/ui/dialog";
import { useDeleteAdminById } from "@/react-query/admin-queries"; // You'll need to create this hook
import { Edit2, Trash2, Loader2, Eye } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const adminColumns: ColumnDef<Admin>[] = [
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
        cell: ({ row }) => (
            <Badge
                variant={row.original.role === AdminRole.SUPER_ADMIN ? "default" : "secondary"}
            >
                {row.original.role === AdminRole.SUPER_ADMIN ? 'Super Admin' : 'Company Admin'}
            </Badge>
        ),
    },
    {
        header: "COMPANY ID",
        accessorKey: "companyId",
        cell: ({ row }) => (
            <Link href={`/dashboard/companies/${row.original.company?.id}`}>
                <div className="text-[#6B7280]">
                    {row.original.company?.name || 'N/A'}
                </div>
            </Link>
        ),
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
        cell: ({ row }) => <ActionColumn admin={row.original} />,
    },
];

const ActionColumn = ({ admin }: { admin: Admin }) => {
    const { mutate: deleteAdmin, isPending: deleting } = useDeleteAdminById();

    const handleDeleting = () => {
        if (admin.id) {
            deleteAdmin(admin.id.toString(), {});
        }
    };

    return (
        <Dialog>
            <AlertDialog>
                <div className="flex space-x-4 w-36 justify-end">
                    <Link href={`/dashboard/admins/${admin.id}`}>
                        <Button variant="ghost" size="icon" aria-label="Edit Admin">
                            <Edit2 className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/admins/${admin.id}/view`}>
                        <Button variant="ghost" size="icon" aria-label="View Admin">
                            <Eye className="w-5 h-5" />
                        </Button>
                    </Link>

                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete Admin"
                            disabled={deleting}
                        >
                            {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </Button>
                    </AlertDialogTrigger>
                </div>

                <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="mt-2 text-gray-600">
                            This action cannot be undone. This will permanently delete the admin account and remove their data
                            from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex justify-end space-x-3">
                        <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                variant="destructive"
                                onClick={handleDeleting}
                            >
                                Delete Admin
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default adminColumns;