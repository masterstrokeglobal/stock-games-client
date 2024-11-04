import React from 'react';
import { Separator } from '@/components/ui/separator'; // Import Separator component
import { DollarSign, ArrowUpRight } from 'lucide-react'; // Import icons from lucide-react
import User from '@/models/user'; // Adjust import according to your structure

interface UserCardProps {
    user: User; // Accept User instance
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    // Dummy data for wallet totals
    const dummyWallet = {
        totalWallet: 2000.00,
        totalIncoming: 500.00,
        totalWithdrawals: 150.00,
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p className="mb-2"><strong>Company:</strong> {user.company?.name || 'N/A'}</p>
            <Separator className="my-4" />

            <h3 className="text-lg font-semibold mb-2">Wallet</h3>
            <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium">Total Wallet Amount:</span>
                <span className="ml-auto text-blue-700">${dummyWallet.totalWallet.toFixed(2)}</span>
            </div>
            <div className="flex items-center mb-2">
                <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">Total Incoming:</span>
                <span className="ml-auto text-green-700">${dummyWallet.totalIncoming.toFixed(2)}</span>
            </div>
            <div className="flex items-center mb-2">
                <ArrowUpRight className="w-5 h-5 text-green-500 mr-2" />
                <span className="font-medium">Total Withdrawals:</span>
                <span className="ml-auto text-red-700">${dummyWallet.totalWithdrawals.toFixed(2)}</span>
            </div>
            <Separator className="my-4" />
        </div>
    );
};

export default UserCard;
