import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { MarketItem } from "@/models/market-item";
import { Dialog } from "@/components/ui/dialog";
import { useUpdateMarketItemById } from "@/react-query/market-item-queries";
import {  Edit2, Eye, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const marketItemColumns: ColumnDef<MarketItem>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-64 truncate">{row.original.name}</div>,
    },
    {
        header: "TYPE",
        accessorKey: "type",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.type}</div>,
    },
    {
        header: "CODE",
        accessorKey: "code",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.code}</div>,
    },
    {
        header: "ODDS MULTIPLIER",
        accessorKey: "oddsMultiplier",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.oddsMultiplier}</div>,
    },
    {
        header: "ACTIVE",
        accessorKey: "active",
        cell: ({ row }) => <ToggleActiveSwitch marketItem={row.original} />,
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
        cell: ({ row }) => <ActionColumn marketItem={row.original} />,
    },
];

const ToggleActiveSwitch = ({ marketItem }: { marketItem: MarketItem }) => {
    const { mutate: updateMarketItem } = useUpdateMarketItemById();

    const handleToggle = () => {
        if (marketItem.id) {
            updateMarketItem({
                id: marketItem.id.toString(), 
                active: !marketItem.active,
            });
        }
    };

    return (
        <Switch checked={marketItem.active} onCheckedChange={handleToggle} />
    );
};

const ActionColumn = ({ marketItem }: { marketItem: MarketItem }) => {
    return (
        <Dialog>
            <AlertDialog>
                <div className="flex space-x-4 w-36 justify-end">
                    <Link href={`/dashboard/market-items/${marketItem.id}`}>
                        <Button variant="ghost" size="icon" aria-label="Edit Market Item">
                            <Edit2 className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/market-items/${marketItem.id}/view`}>
                        <Button variant="ghost" size="icon" aria-label="View Market Item">
                            <Eye className="w-5 h-5" />
                        </Button>
                    </Link>

                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete Market Item"
                            disabled
                        >
                           <Trash2 className="w-5 h-5" />
                        </Button>
                    </AlertDialogTrigger>
                </div>

                <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-lg font-semibold">Delete Disabled</AlertDialogTitle>
                        <AlertDialogDescription className="mt-2 text-gray-600">
                            Deletion functionality is currently disabled.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4 flex justify-end space-x-3">
                        <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                            Close
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default marketItemColumns;
