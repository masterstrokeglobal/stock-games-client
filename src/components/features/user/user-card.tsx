import React, { useMemo } from 'react';
import { Separator } from '@/components/ui/separator'; // Import Separator component
import { DollarSign, ArrowUpRight } from 'lucide-react'; // Import icons from lucide-react
import User from '@/models/user'; // Adjust import according to your structure
import { useGetUserProfitLoss } from '@/react-query/payment-queries';

interface UserCardProps {
    user: User; // Accept User instance
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    // Dummy data for wallet totals


    const { data ,isSuccess,isLoading} = useGetUserProfitLoss(user.id?.toString() || '');

    const wallet = useMemo(() => {
        if  (!isSuccess || isLoading) {
            return {
                totalWallet: 0,
                totalIncoming: 0,
                totalWithdrawals: 0,
            };
        }

        const walletData = data?.data;
        console.log(walletData);
        return {
            totalWallet: walletData?.totalWallet || 0,
            totalIncoming: walletData?.totalIncoming || 0,
            totalWithdrawals: walletData?.totalWithdrawals || 0,
        };
    }, [data]);

    return (
        <div className="bg-white rounded-lg  flex flex-col">
            <p className="mb-2"><strong>Name:</strong> {user.name}</p>
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p className="mb-2"><strong>Company:</strong> {user.company?.name || 'N/A'}</p>
            <Separator className="my-4" />
        </div>
    );
};

export default UserCard;
