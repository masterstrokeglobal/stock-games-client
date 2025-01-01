import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { MarketItem } from "@/models/market-item";
import { useUpdateMarketItemById } from "@/react-query/market-item-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2, Eye } from 'lucide-react';
import Link from "next/link";

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
            </div>
        </Dialog>
    );
};

export default marketItemColumns;
