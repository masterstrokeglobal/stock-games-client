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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import Bonus from '@/models/bonus';
import { useDeleteBonusById } from '@/react-query/bonus-queries';
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2, Eye, Loader2, Trash2 } from 'lucide-react';
import Link from "next/link";

const bonusColumns: ColumnDef<Bonus>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.id}</div>,
    },
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-64 truncate">{row.original.name}</div>,
    },
    {
        header: "CATEGORY",
        accessorKey: "category",
        cell: ({ row }) => (
            <Badge variant="outline">
                {row.original.category.charAt(0) + row.original.category.slice(1).toLowerCase().replace('_', ' ')}
            </Badge>
        ),
    },
    {
        header: "AMOUNT",
        accessorKey: "amount",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {row.original.percentage ? `${row.original.amount}%` : `Rs.${row.original.amount}`}
            </div>
        ),
    },
    {
        header: "LIMITS",
        accessorKey: "limits",
        cell: ({ row }) => (
            <div className="text-gray-700 font-semibold whitespace-nowrap  ">
                {row.original.minAmount ? `Min: Rs.${row.original.minAmount}` : ''}
                {row.original.minAmount && row.original.maxAmount ? ' | ' : ''}
                {row.original.maxAmount ? `Max: Rs.${row.original.maxAmount}` : ''}
                {!row.original.minAmount && !row.original.maxAmount && 'No limits'}
            </div>
        ),
    },
    {
        header: "PERIOD",
        accessorKey: "period",
        cell: ({ row }) => (
            <div className="text-[#6B7280] font-semibold whitespace-nowrap">
                {row.original.startDate ? dayjs(row.original.startDate).format("DD-MM-YYYY") : 'No start'}
                {' to '}
                {row.original.endDate ? dayjs(row.original.endDate).format("DD-MM-YYYY") : 'No end'}
            </div>
        ),
    },
    {
        header: "STATUS",
        accessorKey: "active",
        cell: ({ row }) => (
            <Badge variant={row.original.active ? 'success' : 'destructive'}>
                {row.original.active ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        header: "FREQUENCY",
        accessorKey: "frequency",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {row.original.frequency ?
                    row.original.frequency.charAt(0) + row.original.frequency.slice(1).toLowerCase().replace('_', ' ') :
                    'Not specified'}
            </div>
        ),
    },
    {
        header: "MAX COUNT",
        accessorKey: "maxCount",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.maxCount || 1}</div>,
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
        cell: ({ row }) => <ActionColumn bonus={row.original} />,
    },
];

const ActionColumn = ({ bonus }: { bonus: Bonus }) => {
    const { mutate: deleteBonus, isPending: deleting } = useDeleteBonusById();

    const handleDeleting = () => {
        if (bonus.id) {
            deleteBonus(bonus.id.toString(), {});
        }
    };

    return (
        <Dialog>
            <AlertDialog>
                <div className="flex space-x-4 min-w-36 justify-end">
                    <Link href={`/dashboard/bonus/${bonus.id}`}>
                        <Button variant="ghost" size="icon" aria-label="Edit Bonus">
                            <Edit2 className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/bonus/${bonus.id}/view`}>
                        <Button variant="ghost" size="icon" aria-label="View Bonus">
                            <Eye className="w-5 h-5" />
                        </Button>
                    </Link>

                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete Bonus"
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
                            This action cannot be undone. This will permanently delete the bonus and remove its data
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
                                Delete Bonus
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default bonusColumns;