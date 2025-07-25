import { ColumnDef } from "@tanstack/react-table";

export type AviatorPlacement = {
  id: number;
  roundId: number;
  amount: number;
  marketItem: {
    id: number;
    name?: string;
    code?: string;
  } | null;
  isWinner: boolean;
  createdAt: string | Date;
  boostMultiplier: number;
  cashoutMultiplier: number;
};

const aviatorColumns: ColumnDef<AviatorPlacement>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "roundId",
    header: "Round ID",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "marketItem",
    header: "Market",
    cell: ({ row }) => {
      const marketItem = row.original.marketItem;
      if (!marketItem) return "-";
      return (
        <span>
          {marketItem.name || "-"}
          {marketItem.code ? ` (${marketItem.code.toUpperCase()})` : ""}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "boostMultiplier",
    header: "Boost Multiplier",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "cashoutMultiplier",
    header: "Cashout Multiplier",
    cell: ({ getValue }) => getValue(),
  },
  {
    accessorKey: "isWinner",
    header: "Winner",
    cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
  },
  {
    accessorKey: "createdAt",
    header: "Placed At",
    cell: ({ getValue }) => {
      const value = getValue();
      const date = typeof value === "string" ? new Date(value) : value;
      return date instanceof Date && !isNaN(date.getTime())
        ? date.toLocaleString()
        : "-";
    },
  },
];

export default aviatorColumns;  