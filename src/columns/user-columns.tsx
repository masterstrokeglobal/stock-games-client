import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import User from "@/models/user";
import { Trash2, Loader2, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { useDeleteUserById } from "@/react-query/user-queries"; // Ensure you have this hook implemented
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import { Badge } from "@/components/ui/badge";

const userColumns: ColumnDef<User>[] = [
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
        header: "Bonus Percentage",
        accessorKey: "bonusPercentage",
        cell: ({ row }) => <span>{row.original.depositBonusPercentage}</span>
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
        cell: ({ row }) => <ActionColumn user={row.original} />,
    },
];

const ActionColumn = ({ user }: { user: User }) => {
    const { mutate: deleteUser, isPending: deleting } = useDeleteUserById();
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as Admin;

    const handleDeleting = () => {
        if (user.id) {
            deleteUser(user.id.toString(), {}); // Call the delete function with the user's ID
        }
    };

    let showDelete = true;

    if (currentUser.role == AdminRole.AGENT) {
        showDelete = false;
    }

    return (
        <AlertDialog>
            <div className="flex space-x-4 w-36 justify-end">
                <Link href={`/dashboard/users/${user.id}`}>
                    <Button size="icon" variant="ghost" aria-label="View User">
                        <Eye className="w-5 h-5" />
                    </Button>
                </Link>
                {showDelete && <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete User"
                        disabled={deleting}
                    >
                        {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                    </Button>
                </AlertDialogTrigger>}
            </div>

            <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-gray-600">
                        This action cannot be undone. This will permanently delete the user account and remove their data
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
                            Delete User
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default userColumns;
