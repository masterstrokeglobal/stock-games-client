import { ColumnDef } from "@tanstack/react-table";
import { CompanyQR } from "@/models/company-qr";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import Link from "next/link";
import { useUpdateCompanyQRById, useDeleteCompanyQRById } from "@/react-query/company-qr-queries";
import { Badge } from "@/components/ui/badge";
const ToggleActiveSwitch = ({ qr }: { qr: CompanyQR }) => {
  const { mutate: updateStatus, isPending } = useUpdateCompanyQRById();
  return (
    <Switch
      checked={qr.active}
      onCheckedChange={() =>
        updateStatus({ id: qr.id?.toString(), active: !qr.active })
      }
      disabled={isPending}
    />
  );
};

const DeleteCompanyQRButton = ({ qr }: { qr: CompanyQR }) => {
  const { mutate: deleteQR, isPending } = useDeleteCompanyQRById();
  return (
    <Button
      variant="destructive"
      onClick={() => deleteQR(qr.id?.toString() || "")}
      disabled={isPending}
    >
      Delete
    </Button>
  );
};

const companyQRColumns: ColumnDef<CompanyQR>[] = [
  {
    header: "QR",
    accessorKey: "qr",
    cell: ({ row }) => <img className="size-12" src={row.original.qr} alt="QR" />,
  },
  {
    header: "MAX LIMIT",
    accessorKey: "maxLimit",
    cell: ({ row }) => <div>{row.original.maxLimit}</div>,
  },
  {
    header: "ACTIVE",
    accessorKey: "active",
    cell: ({ row }) => <ToggleActiveSwitch qr={row.original} />,
  },
  {
    header: "TYPE",
    accessorKey: "type",
    cell: ({ row }) => <Badge>{row.original.type}</Badge>,
  },
  {
    header: "BANK NAME",
    accessorKey: "bankName",
    cell: ({ row }) => <div>{row.original.bankName || "N/A"}</div>,
  },
  {
    header: "ACCOUNT NUMBER",
    accessorKey: "accountNumber",
    cell: ({ row }) => <div>{row.original.accountNumber || "N/A"}</div>,
  },
  {
    header: "IFSC CODE",
    accessorKey: "ifscCode",
    cell: ({ row }) => <div>{row.original.ifscCode || "N/A"}</div>,
  },
  {
    header: "CREATED AT",
    accessorKey: "createdAt",
    cell: ({ row }) =>
      row.original.createdAt ? (
        <span>{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</span>
      ) : null,
  },
  {
    header: "ACTIONS",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link href={`/dashboard/company-qr/${row.original.id}`}>
          <Button>Edit</Button>
        </Link>
        <DeleteCompanyQRButton qr={row.original} />
      </div>
    ),
  },
];

export default companyQRColumns;
