import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

// Define the wallet transaction interface based on the API response structure
export interface OperatorWalletTransaction {
    id: number;
    amount: number;
    type: 'operator_deposit' | 'transfer_out' | 'transfer_in' | 'company_recharge' | 'wallet_recharge';
    status: 'pending' | 'completed' | 'failed';
    description?: string;
    depositorOperatorWallet?: {
        id: number;
        operator: {
            id: number;
            name: string;
            email: string;
        };
    };
    creditorOperatorWallet?: {
        id: number;
        operator: {
            id: number;
            name: string;
            email: string;
        };
    };
    companyWallet?: {
        id: number;
        balance: number;
    };
    createdAt: string;
    updatedAt: string;
    pgId?: string;
    confirmationImageUrl?: string;
}

const operatorWalletTransactionColumns: ColumnDef<OperatorWalletTransaction>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },
    {
        header: "Transaction ID",
        accessorKey: "pgId",
        cell: ({ row }) => (
            <div className="w-48 truncate text-sm">
                {row.original.pgId || 'Internal'}
            </div>
        ),
    },
    {
        header: "Type",
        accessorKey: "type",
        cell: ({ row }) => {
            const typeColorMap = {
                operator_deposit: "success",
                wallet_recharge: "success",
                transfer_in: "success",
                transfer_out: "destructive", 
                company_recharge: "default"
            } as const;
            
            const typeDisplayMap = {
                operator_deposit: "Operator Deposit",
                wallet_recharge: "Wallet Recharge",
                transfer_in: "Transfer In",
                transfer_out: "Transfer Out",
                company_recharge: "Company Recharge"
            };
            
            return (
                <Badge 
                    variant={typeColorMap[row.original.type] || "outline"}
                    className="text-nowrap"
                >
                    {typeDisplayMap[row.original.type] || row.original.type.replace('_', ' ')}
                </Badge>
            );
        },
    },
    {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row }) => {
            const isCredit = ['operator_deposit', 'wallet_recharge', 'transfer_in', 'company_recharge'].includes(row.original.type);
            return (
                <div className={`text-nowrap font-medium ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : '-'}₹{Math.abs(row.original.amount).toFixed(2)}
                </div>
            );
        }
    },
    {
        header: "From",
        accessorKey: "fromOperator",
        cell: ({ row }) => {
            const { depositorOperatorWallet, companyWallet, type } = row.original;
            
            if (type === 'company_recharge' || companyWallet) {
                return (
                    <div className="text-sm">
                        <span className="font-medium">Company</span>
                        <div className="text-xs text-gray-500">Company Recharge</div>
                    </div>
                );
            }
            
            if (depositorOperatorWallet?.operator) {
                return (
                    <div className="text-sm">
                        <span className="font-medium">{depositorOperatorWallet.operator.name}</span>
                        <div className="text-xs text-gray-500">{depositorOperatorWallet.operator.email}</div>
                    </div>
                );
            }
            
            return <div className="text-sm text-gray-500">N/A</div>;
        },
    },
    {
        header: "To",
        accessorKey: "toOperator",
        cell: ({ row }) => {
            const { creditorOperatorWallet, type } = row.original;
            
            if (type === 'wallet_recharge') {
                return (
                    <div className="text-sm">
                        <span className="font-medium">Self</span>
                        <div className="text-xs text-gray-500">Wallet Recharge</div>
                    </div>
                );
            }
            
            if (creditorOperatorWallet?.operator) {
                return (
                    <div className="text-sm">
                        <span className="font-medium">{creditorOperatorWallet.operator.name}</span>
                        <div className="text-xs text-gray-500">{creditorOperatorWallet.operator.email}</div>
                    </div>
                );
            }
            
            return <div className="text-sm text-gray-500">N/A</div>;
        },
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
            const statusColorMap = {
                completed: "success",
                pending: "warning",
                failed: "destructive"
            } as const;
            
            return (
                <Badge variant={statusColorMap[row.original.status] || "outline"}>
                    {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
                </Badge>
            );
        },
    },
    {
        header: "Description",
        accessorKey: "description",
        cell: ({ row }) => (
            <div className="max-w-48 truncate text-sm">
                {row.original.description || 'N/A'}
            </div>
        ),
    },
    {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <div className="text-sm whitespace-nowrap">
                <div>{dayjs(row.original.createdAt).format("DD-MM-YYYY")}</div>
                <div className="text-xs text-gray-500">
                    {dayjs(row.original.createdAt).format("HH:mm:ss")}
                </div>
            </div>
        ),
    },
];

export default operatorWalletTransactionColumns;
