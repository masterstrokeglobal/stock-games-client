import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus } from '@/models/transaction';
import dayjs from 'dayjs';

type Props = {
    transactions: Transaction[];
};

const TransactionTable = ({ transactions }: Props) => {
    const getRowStyles = (status: TransactionStatus) => {
        const statusStyles = {
            [TransactionStatus.COMPLETED]: 'bg-green-50',
            [TransactionStatus.FAILED]: 'bg-red-50',
            [TransactionStatus.PENDING]: 'bg-yellow-50',
        };

        return `${statusStyles[status] || ''}`;
    };

    const getStatusColor = (status: TransactionStatus) => {
        const statusColor = {
            [TransactionStatus.COMPLETED]: 'text-green-500',
            [TransactionStatus.FAILED]: 'text-red-500',
            [TransactionStatus.PENDING]: 'text-yellow-500',
        };

        return `${statusColor[status] || ''}`;
    }

    return (
        <div className="rounded-lg border bg-transparent">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent border-gray-200">
                        <TableHead className="font-medium">Date/Time</TableHead>
                        <TableHead className="font-medium">Amount</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction, index) => (
                        <TableRow
                            key={index}
                            className={`${getRowStyles(transaction.status)} hover:bg-gray-50/5 transition-colors`}
                        >
                            <TableCell>{dayjs(transaction.createdAt).format('MMM D, YYYY h:mm A')}</TableCell>
                            <TableCell className="font-medium">{transaction.amount}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={getStatusColor(transaction.status)}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TransactionTable;