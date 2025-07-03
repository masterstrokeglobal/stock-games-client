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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CryptoWallet } from "@/react-query/crypto-wallet";
import { useDeleteCryptoWallet } from "@/react-query/crypto-wallet-queries";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Loader2, Trash2 } from "lucide-react";

export const cryptoWalletColumns: ColumnDef<CryptoWallet>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "cryptoToken",
    header: "Crypto Token",
    cell: ({ row }) => {
      const cryptoToken = row.original.cryptoToken;
      return `${cryptoToken.name}`;
    },
  },
  {
    accessorKey: "walletId",
    header: "Wallet ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return dayjs(row.original.createdAt).format("DD/MM/YYYY HH:mm");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const cryptoWallet = row.original;
      return <ActionButton cryptoWallet={cryptoWallet} />;
    },
  },
];


const ActionButton = ({ cryptoWallet }: { cryptoWallet: CryptoWallet }) => {
  const { mutate: deleteCryptoWallet, isPending } = useDeleteCryptoWallet();


  return (
    <div className="flex items-center gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the crypto wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCryptoWallet(cryptoWallet.id.toString())}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};