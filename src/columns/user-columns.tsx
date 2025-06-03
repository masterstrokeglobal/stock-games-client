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
import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";
import User from "@/models/user";
import { useDeleteUserById } from "@/react-query/user-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Eye, Loader2, Trash2 } from 'lucide-react';
import Link from "next/link";

// ===================== User Table =====================

// Define all possible sort options
export enum SortOption {
    // User basic fields
    USERNAME_ASC = 'username_asc',
    USERNAME_DESC = 'username_desc',
    EMAIL_ASC = 'email_asc',
    EMAIL_DESC = 'email_desc',
    PHONE_ASC = 'phone_asc',
    PHONE_DESC = 'phone_desc',
    SIGNUP_DATE_ASC = 'signup_date_asc',
    SIGNUP_DATE_DESC = 'signup_date_desc',
  
    // Transaction-related aggregates
    FTD_DATE_ASC = 'ftd_date_asc',
    FTD_DATE_DESC = 'ftd_date_desc',
    LAST_DEPOSIT_DATE_ASC = 'last_deposit_date_asc',
    LAST_DEPOSIT_DATE_DESC = 'last_deposit_date_desc',
    LIFETIME_DEPOSIT_COUNT_ASC = 'lifetime_deposit_count_asc',
    LIFETIME_DEPOSIT_COUNT_DESC = 'lifetime_deposit_count_desc',
    LIFETIME_DEPOSIT_AMOUNT_ASC = 'lifetime_deposit_amount_asc',
    LIFETIME_DEPOSIT_AMOUNT_DESC = 'lifetime_deposit_amount_desc',
    LIFETIME_WITHDRAWAL_COUNT_ASC = 'lifetime_withdrawal_count_asc',
    LIFETIME_WITHDRAWAL_COUNT_DESC = 'lifetime_withdrawal_count_desc',
    LIFETIME_WITHDRAWAL_AMOUNT_ASC = 'lifetime_withdrawal_amount_asc',
    LIFETIME_WITHDRAWAL_AMOUNT_DESC = 'lifetime_withdrawal_amount_desc',
  
    // Affiliate and balance fields
    AFFILIATE_ASC = 'affiliate_asc',
    AFFILIATE_DESC = 'affiliate_desc',
    SUB_AFFILIATE_ASC = 'sub_affiliate_asc',
    SUB_AFFILIATE_DESC = 'sub_affiliate_desc',
    BALANCE_ASC = 'balance_asc',
    BALANCE_DESC = 'balance_desc'
  }
  
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
    cell: ({ row }) => <span>{row.original.depositBonusPercentage}</span>,
  },
  {
    header: "Placement Not Allowed",
    accessorKey: "placementAllowed",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        {row.original.placementNotAllowed.map((type) => (
          <Badge key={type} variant="default">{type}</Badge>
        ))}
        {row.original.placementNotAllowed.length === 0 && <span className="text-[#6B7280]">No Restriction</span>}
      </div>
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
    cell: ({ row }) => <ActionColumn user={row.original} />,
  },
];
export default userColumns;

const ActionColumn = ({ user }: { user: User }) => {
  const { mutate: deleteUser, isPending: deleting } = useDeleteUserById();
  const { userDetails } = useAuthStore();
  const currentUser = userDetails as Admin;

  const handleDeleting = () => {
    if (user.id) {
      deleteUser(user.id.toString(), {});
    }
  };

  const showDelete = currentUser.role !== AdminRole.AGENT;

  return (
    <AlertDialog>
      <div className="flex space-x-4 w-36 justify-end">
        <Link href={`/dashboard/users/${user.id}`}>
          <Button size="icon" variant="ghost" aria-label="View User">
            <Eye className="w-5 h-5" />
          </Button>
        </Link>
        {showDelete && (
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              aria-label="Delete User"
              disabled={deleting}
            >
              {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            </Button>
          </AlertDialogTrigger>
        )}

        {/* {isAdmin && (
          <Link href={`/dashboard/users/${user.id}/ip-logs`}>
            <Button size="icon" variant="ghost" aria-label="View User IP Logs" title='View User IP Logs'>
              <LogsIcon className="w-5 h-5" />
            </Button>
          </Link>
        )} */}
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
            <Button variant="destructive" onClick={handleDeleting}>
              Delete User
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};



// Define AffiliateUser type (keep this the same)
export type AffiliateUser = {
    username: string;
    email: string;
    phone: string;
    signupDate: string;
    ftdDate: string;
    lastDepositDate: string;
    affiliate: string;
    subAffiliate: string;
    lifetimeDepositCount: number;
    lifetimeDepositAmount: number;
    lifetimeWithdrawalCount: number;
    lifetimeWithdrawalAmount: number;
    balance: number;
}

// // New sortable header creator
// const CreateSortableHeader = ({ label, field }: { label: string, field: string }) => {
//   const [sortBy, setSortBy] = useQueryState('sortBy', {
//     defaultValue: JSON.stringify([]),
//   });

//   const currentSort = sortBy;

//   const isSorted = currentSort.includes(field);
//   const sortOrder = isSorted ? (currentSort.includes(`${field}_ASC`) ? 'ASC' : 'DESC') : null;

//   const toggleSort = () => {
//     const newOrder = !isSorted || sortOrder === 'DESC' ? 'ASC' : 'DESC';
//     setSortBy(`${field}_${newOrder}`);
//   };

//   return (
//     <Button
//       variant="ghost"
//       onClick={toggleSort}
//       className="flex items-center space-x-2"
//     >
//       <span>{label}</span>
//       {isSorted ? (
//         sortOrder === 'ASC' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
//       ) : (
//         <ArrowUpDown className="w-4 h-4" />
//       )}
//     </Button>
//   );
// };

export const affiliateUserColumns: ColumnDef<AffiliateUser>[] = [
  {
    header: "USERNAME",
    accessorKey: 'username',
  },
  {
    header: "EMAIL",
    accessorKey: 'email',
  },
  {
    header: "PHONE",
    accessorKey: 'phone',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.phone || 'N/A'}</div>,
  },
  {
    header: "SIGNUP DATE",
    accessorKey: 'createdAt',
    cell: ({ row }) => <div className="text-[#6B7280]">{dayjs(row.original.signupDate).format("DD-MM-YYYY")}</div>,
  },
  {
    header: "FTD DATE",
    accessorKey: 'ftdDate',
    cell: ({ row }) => (
      <div className="text-[#6B7280] text-nowrap">
        {row.original.ftdDate ? dayjs(row.original.ftdDate).format("DD-MM-YYYY") : 'N/A'}
      </div>
    ),
  },
  {
    header: "LAST DEPOSIT DATE",
    accessorKey: 'lastDepositDate',
    cell: ({ row }) => (
      <div className="text-[#6B7280] text-nowrap">
        {row.original.lastDepositDate ? dayjs(row.original.lastDepositDate).format("DD-MM-YYYY") : 'N/A'}
      </div>
    ),
  },
  {
    header: "AFFILIATE",
    accessorKey: 'affiliate',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.affiliate || 'N/A'}</div>,
  },
  {
    header: "SUB AFFILIATE",
    accessorKey: 'subAffiliate',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.subAffiliate || 'N/A'}</div>,
  },

  {
    header: "LIFETIME DEPOSIT COUNT",
    accessorKey: 'lifetimeDepositCount',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.lifetimeDepositCount || 'N/A'}</div>,
  },
  {
    header: "LIFETIME DEPOSIT AMOUNT",
    accessorKey: 'lifetimeDepositAmount',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.lifetimeDepositAmount || 'N/A'}</div>,
  },
  {
    header: "LIFETIME WITHDRAWAL COUNT",
    accessorKey: 'lifetimeWithdrawalCount',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.lifetimeWithdrawalCount || 'N/A'}</div>,
  },
  {
    header: "LIFETIME WITHDRAWAL AMOUNT",
    accessorKey: 'lifetimeWithdrawalAmount',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.lifetimeWithdrawalAmount || 'N/A'}</div>,
  },
  {
    header: "BALANCE",
    accessorKey: 'balance',
    cell: ({ row }) => <div className="text-[#6B7280]">{row.original.balance || 'N/A'}</div>,
  },
];
