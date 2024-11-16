import { Separator } from '@/components/ui/separator'; // Import Separator component
import User from '@/models/user'; // Adjust import according to your structure
import React from 'react';

interface UserCardProps {
    user: User; // Accept User instance
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {

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
