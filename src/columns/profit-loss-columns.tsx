import { ProfitLoss } from "@/models/profit-loss";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const profitLossColumns: ColumnDef<ProfitLoss>[] = [
    {
        header: "Company",
        accessorKey: "company",
        cell: ({ row }) => <span className="whitespace-nowrap">{row.original.company?.name}</span>,
    },
    {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => <span className="whitespace-nowrap">{dayjs(row.original.date).format('DD-MM-YYYY')}</span>,
    },
    {
        header: "Stock Profit Loss",
        accessorKey: "stockProfitLoss",
        cell: ({ row }) => row.original.stockProfitLoss.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },

   
    {
        header: "Other Profit Loss",
        accessorKey: "otherProfitLoss",
        cell: ({ row }) => row.original.otherProfitLoss.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },
  
    {
        header: "Total Bonus",
        accessorKey: "totalBonus",
        cell: ({ row }) => row.original.totalBonus.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },

    {
        header: "Total Profit Loss",
        accessorKey: "totalProfitLoss",
        cell: ({ row }) => row.original.netProfitOrLoss.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },
    
    {
        header: "Stock Share Amount (7%)",
        accessorKey: "stockSettlementAmount",
        cell: ({ row }) => row.original.stockSettlementAmount.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },
    {
        header: "Other Share Amount (3%)",
        accessorKey: "otherSettlementAmount",
        cell: ({ row }) => row.original.otherSettlementAmount.toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },
    {
        header: "Total Share Amount",
        accessorKey: "totalShareAmount",
        cell: ({ row }) => (row.original.stockSettlementAmount + row.original.otherSettlementAmount).toLocaleString('en-US', { style: 'currency', currency: 'INR' }),
    },
]
