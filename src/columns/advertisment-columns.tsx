import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Advertisement } from "@/models/advertisment";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2, Eye, ExternalLink, Trash, Loader2 } from 'lucide-react';
import Link from "next/link";
import Image from "next/image";
import { useUpdateAdvertisementById, useDeleteAdvertisementById } from "@/react-query/advertisment-queries";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

const advertisementColumns: ColumnDef<Advertisement>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-48 truncate font-medium">{row.original.name}</div>,
    },
    {
        header: "DESCRIPTION",
        accessorKey: "description",
        cell: ({ row }) => <div className="w-64 truncate text-[#6B7280]">{row.original.description}</div>,
    },
    {
        header: "IMAGE",
        accessorKey: "image",
        cell: ({ row }) => (
            <div className="h-12 w-12 relative rounded overflow-hidden">
                <Image
                    src={row.original.image || "/api/placeholder/48/48"}
                    alt={row.original.name}
                    width={48}
                    height={48}
                    className="object-cover"
                />
            </div>
        ),
    },
    {
        header: "TYPE",
        accessorKey: "type",
        cell: ({ row }) => <Badge variant="outline" className="text-[#6B7280]">{row.original.type}</Badge>,
    },
    {
        header: "LINK",
        accessorKey: "link",
        cell: ({ row }) => {

            return (
                row.original.link ? (
                    <div className="flex items-center text-[#6B7280]">
                        <div className="w-36 truncate">{row.original.link}</div>
                        <a href={row.original.link} target="_blank" rel="noopener noreferrer" className="ml-1">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>
                ) : (
                    <div className="text-[#6B7280]">
                        <span>No link</span>
                    </div>
                )
            );
        }
    },
    {
        header: "ACTIVE",
        accessorKey: "active",
        cell: ({ row }) => <ToggleActiveSwitch advertisement={row.original} />,
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
        cell: ({ row }) => <ActionColumn advertisement={row.original} />,
    },
];

const ToggleActiveSwitch = ({ advertisement }: { advertisement: Advertisement }) => {
    const { mutate: updateAdvertisement } = useUpdateAdvertisementById();

    const handleToggle = () => {
        if (advertisement.id) {
            updateAdvertisement({
                id: advertisement.id.toString(),
                active: !advertisement.active
            });
        }
    };

    return (
        <Switch checked={advertisement.active} onCheckedChange={handleToggle} />
    );
};


const DeleteAdvertisementButton = ({ advertisement }: { advertisement: Advertisement }) => {

    const { mutate, isPending } = useDeleteAdvertisementById();

    const handleDelete = () => {
        mutate(advertisement.id.toString());
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" disabled={isPending} size="icon" aria-label="Delete Advertisement">
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash className="w-5 h-5" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline" >Cancel</Button>
                    </AlertDialogCancel>
                    <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
                        {isPending ? <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Deleting...</span>
                        </> : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
const ActionColumn = ({ advertisement }: { advertisement: Advertisement }) => {
    return (
        <Dialog>
            <div className="flex space-x-4 w-36 justify-end">
                <Link href={`/dashboard/advertisements/${advertisement.id}`}>
                    <Button variant="ghost" size="icon" aria-label="Edit Advertisement">
                        <Edit2 className="w-5 h-5" />
                    </Button>
                </Link>
                <DeleteAdvertisementButton advertisement={advertisement} />
                <Link href={`/dashboard/advertisements/${advertisement.id}/view`}>
                    <Button variant="ghost" size="icon" aria-label="View Advertisement">
                        <Eye className="w-5 h-5" />
                    </Button>
                </Link>
            </div>
        </Dialog>
    );
};

export default advertisementColumns;