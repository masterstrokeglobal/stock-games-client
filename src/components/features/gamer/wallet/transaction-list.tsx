import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus } from '@/models/transaction';
import dayjs from 'dayjs';

type Props = {
    transactions: Transaction[];
};

const TransactionTable = ({ transactions }: Props) => {
    const getStatusStyles = (status: TransactionStatus) => {
        const styles = {
            [TransactionStatus.COMPLETED]: 'text-green-300',
            [TransactionStatus.FAILED]: 'text-red-300 ',
            [TransactionStatus.PENDING]: 'text-yellow-200 ',
        };
        
        return styles[status] || '';
    };
    
    return (
        <div className="w-full rounded-xl ">
            <Table>
                <TableHeader className='mb-3'>
                    <TableRow className="hover:bg-transparent border-b-0 border-none pb-4">
                        <TableHead className="text-gray-300">Date/Time</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction, index) => (
                        <TableRow
                            key={index}
                            className="hover:bg-blue-900/20 py-2 transition-colors odd:bg-[#14244C]  duration-200 border-b-0"
                        >
                            <TableCell className="text-gray-300 rounded">
                                {dayjs(transaction.createdAt).format('MMM D,')}
                                <br/>
                                {dayjs(transaction.createdAt).format('YYYY h:mm A')}
                            </TableCell>
                            <TableCell className="font-medium text-white">
                                {transaction.amount}
                            </TableCell>
                            <TableCell className='rounded'>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(transaction.status)}`}>
                                    {transaction.status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TransactionTable;