import { Card } from '@/components/ui/card';
import User from '@/models/user';
import React from 'react';

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <Card className="bg-white mb-4 rounded-lg p-6 ">
            <div className="flex flex-col space-y-2">
        
                <p className="text-lg font-semibold text-gray-900">
                    <strong className="text-gray-800 font-semibold">Name: </strong>
                    {user?.name || 'Name not available'}</p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Email:</strong> {user?.email || 'Email not provided'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Phone:</strong> {user?.phone || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Username:</strong> {user?.username || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Company:</strong> {user?.company?.name || 'N/A'}
                </p>
            </div>
        </Card>
    );
};

export default UserCard;
