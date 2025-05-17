import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tier } from "@/models/tier";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";


import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useDeleteTier } from "@/react-query/tier-queries";
import { Edit2Icon, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";

const tierColumns: ColumnDef<Tier>[] = [
    {
        header: "Name",
        accessorKey: "name"
    },

    {
        header: "Image",
        accessorKey: "image",
        cell: ({ row }) => (
            <Image src={row.original.imageUrl} alt={row.original.name} width={100} height={100} className='size-10 rounded-md ' />
        )
    },
   
    {
        header: "Min Points",
        accessorKey: "minPoints",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.minPoints ?? "-"}</span>
        )
    },
    {
        header: "Reedeem Points",
        accessorKey: "reedeempoints",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.redeemablePoints ?? "-"}</span>
        )
    },
    {
        header: "Login Points",
        accessorKey: "loginPoints",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.loginPoints ?? "-"}</span>
        )
    },
    {
        header: "First Game Points",
        accessorKey: "firstGamePoints",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.firstGamePoints ?? "-"}</span>
        )
    },
    {
        header: "Min Game Required",
        accessorKey: "minGameRequired",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.gamesRequired ?? "-"}</span>
        )
    },

    {
        header: "Points Per Hundred Rupees",
        accessorKey: "pointsPerHundredRupees",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.pointsPerHundredRupees ?? "-"}</span>
        )
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{dayjs(row.original.createdAt).format("DD/MM/YYYY")}</span>
        )
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{dayjs(row.original.updatedAt).format("DD/MM/YYYY")}</span>
        )
    },

    {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => <ActionColumn tier={row.original} />
    }
]


const ActionColumn = ({ tier }: { tier: Tier }) => {
    const { mutate: deleteTier, isPending: deleting } = useDeleteTier();

    const handleDeleting = () => {
        if (tier.id) {
            deleteTier(tier.id.toString(), {});
        }
    };

    return (
        <Dialog>
            <AlertDialog>
                <div className="flex space-x-4 w-36 justify-end">
                    <Link href={`/dashboard/tier/${tier.id}`}>
                        <Button variant="ghost" size="icon" aria-label="Edit Tier">
                            <Edit2Icon className="w-5 h-5" />
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


export default tierColumns;
