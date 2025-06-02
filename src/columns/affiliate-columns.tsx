import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import Affiliate, { AffiliateRole } from "@/models/affiliate";
import { useDeleteAffiliate } from "@/react-query/affiliate-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2, Loader2, Trash2, Users } from 'lucide-react';
import Link from "next/link";

const affiliateColumns: ColumnDef<Affiliate>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.name}</div>,
    },
    {
        header: "ROLE",
        accessorKey: "role",
        cell: ({ row }) => (
            <Badge variant={row.original.role === AffiliateRole.MASTER_AFFILIATE ? "default" : "outline"} className="whitespace-nowrap">
                {row.original.role === AffiliateRole.MASTER_AFFILIATE ? "Master Affiliate" : "Sub Affiliate"}
            </Badge>
        ),
    },
    {
        header: "USERNAME",
        accessorKey: "username",
        cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.username}</div>,
    },
    {
        header: "REFERENCE CODE",
        accessorKey: "referenceCode",
        cell: ({ row }) => <div className="w-48 truncate">{row.original.referenceCode}</div>,
    },
    {
        header: "PARENT AFFILIATE",
        accessorKey: "parentAffiliate",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {row.original.parentAffiliate ? row.original.parentAffiliate.name : 'N/A'}
            </div>
        ),
    },
    {
        header: "REFERRAL BONUS",
        accessorKey: "referralBonus",
        cell: ({ row }) => (
            <span className="whitespace-nowrap">
                {!row.original.isPercentage ? "₹ " : ""}
                {row.original.referralBonus}{row.original.isPercentage ? '%' : ''}
            </span>
        ),
    },
    {
        header: "USERS",
        accessorKey: "users",
        cell: ({ row }) => (
            <Link href={`/dashboard/affiliate/users?affiliateId=${row.original.id}`} className="flex items-center">
                <Button>
                    <Users className="h-4 w-4 mr-2" />

                    <span className="text-xs font-semibold ">
                        Check &nbsp;
                        {row.original.userCount || 0}
                        &nbsp;Users</span>
                </Button>
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
        cell: ({ row }) => <ActionColumn affiliate={row.original} />,
    },
];

const ActionColumn = ({ affiliate }: { affiliate: Affiliate }) => {
    const { mutate: deleteAffiliate, isPending: deleting } = useDeleteAffiliate();
    const { userDetails } = useAuthStore();
    const currentUser = userDetails as Admin;

    const handleDeleting = () => {
        if (affiliate.id) {
            deleteAffiliate(affiliate.id.toString(), {});
        }
    };

    let showDelete = true;

    if (currentUser.role === AdminRole.AGENT) {
        showDelete = false;
    }

    return (
        <AlertDialog>
            <div className="flex space-x-4 w-36 justify-end">
                <Link href={`/dashboard/affiliate/${affiliate.id}`}>
                    <Button size="icon" variant="ghost" aria-label="View Affiliate">
                        <Edit2 className="w-5 h-5" />
                    </Button>
                </Link>
                {showDelete && <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete Affiliate"
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
                        This action cannot be undone. This will permanently delete the affiliate account and remove their data
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
                            Delete Affiliate
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default affiliateColumns;