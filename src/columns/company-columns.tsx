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
import { Company } from "@/models/company";
import { useDeleteCompanyById } from "@/react-query/company-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Edit2, Eye, Loader2, Trash2 } from 'lucide-react';
import Link from "next/link";

const companyColumns: ColumnDef<Company>[] = [
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
        header: "Bonus Percentage",
        accessorKey: "bonusPercentage",
        cell: ({ row }) => <Badge variant="secondary">{row.original.depositBonusPercentage}</Badge>
    },
    {
        header: "Bonus Enabled",
        accessorKey: "bonusEnabled",
        cell: ({ row }) => <DepositBonusColumn company={row.original} />

    },

    {
        header: "Placement Not Allowed",
        accessorKey: "placementAllowed",
        cell: ({ row }) => (
            // show in badges
            <div className="flex space-x-2">
                {row.original.placementNotAllowed?.map((type) => (
                    <Badge key={type} variant="default" >
                        {type}
                    </Badge>
                ))}
                {row.original.placementNotAllowed?.length === 0 && <span className="text-[#6B7280]">No Restriction</span>}
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
        header: "Users",
        accessorKey: "users",
        cell: ({ row }) => (
            <Link href={`/dashboard/users?company=${row.original.id}`}>
                <Button variant="secondary" size="sm" aria-label="View Users">
                    View Users
                </Button>
            </Link>
        ),
    },
    {
        header: "Agents",
        accessorKey: "agents",
        cell: ({ row }) => (
            <Link href={`/dashboard/company/${row.original.id}/agents`}>
               <Button variant="secondary" size="sm" aria-label="View Users">
                    View Agents
                </Button>
            </Link>
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
                <div className="flex space-x-4 min-w-36 justify-end">
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

const DepositBonusColumn = ({ company }: { company: Company }) => {
    return (
        <Badge variant={company.depositBonusPercentageEnabled ? 'success' : 'destructive'}>{company.depositBonusPercentageEnabled ? "active" : "inactive"
        }</Badge>
    )
};

export default companyColumns;