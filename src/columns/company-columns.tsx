import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { Company } from "@/models/company";
import { Dialog } from "@/components/ui/dialog";
import { useDeleteCompanyById } from "@/react-query/company-queries";
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
import { useAmp } from "next/amp";

const companyColumns: ColumnDef<Company>[] = [
    {
        header: "NAME",
        accessorKey: "name",
        cell: ({ row }) => <div className="w-64 truncate">{row.original.name}</div>,
    },
    {
        header: "DOMAIN",
        accessorKey: "domain",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.domain}</div>,
    },
    {
        header: "CONTACT PERSON",
        accessorKey: "contactPersonName",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.contactPersonName}</div>,
    },
    {
        header: "EMAIL",
        accessorKey: "contactPersonEmail",
        cell: ({ row }) => <div className="text-[#6B7280]">{row.original.contactPersonEmail}</div>,
    },
    {
        header: "ADDRESS",
        accessorKey: "address",
        cell: ({ row }) => <div className="text-[#6B7280] w-48 truncate">{row.original.address}</div>,
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
        cell: ({ row }) => <ActionColumn company={row.original} />,
    },
];

const ActionColumn = ({ company }: { company: Company }) => {
    const { mutate: deleteCompany, isPending: deleting } = useDeleteCompanyById();

    const handleDeleting = () => {
        if (company.id) {
            deleteCompany(company.id.toString(), {});
        }
    };

    return (
        <Dialog>
            <AlertDialog>
                <div className="flex space-x-4 w-36 justify-end">
                    <Link href={`/dashboard/company/${company.id}`}>
                        <Button variant="ghost" size="icon" aria-label="Edit Company">
                            <Edit2 className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Link href={`/dashboard/company/${company.id}/view`}>
                        <Button variant="ghost" size="icon" aria-label="View Company">
                            <Eye className="w-5 h-5" />
                        </Button>
                    </Link>

                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            aria-label="Delete Company"
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
                            This action cannot be undone. This will permanently delete the company and remove its data
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
                                Delete Company
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Dialog>
    );
};

export default companyColumns;