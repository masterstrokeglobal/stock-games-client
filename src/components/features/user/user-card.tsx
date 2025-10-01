import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import User from '@/models/user';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useResetUserPassword } from '@/react-query/user-queries';
import { toast } from 'sonner';
import { OperatorRole } from '@/models/operator';
import { useAuthStore } from '@/context/auth-context';
import Operator from '@/models/operator';

interface UserCardProps {
    user: User & {
        wallet?: {
            mainBalance?: number;
        };
    };
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const resetPasswordMutation = useResetUserPassword();
    const { userDetails } = useAuthStore();

    const operatorDetails = userDetails as unknown as Operator;

    const handlePasswordReset = async () => {
        if (!newPassword.trim()) {
            toast.error("Please enter a new password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            if (!user.id) {
                toast.error("User ID not available");
                return;
            }
            
            await resetPasswordMutation.mutateAsync({
                userId: user.id.toString(),
                password: newPassword
            });
            setNewPassword('');
            setIsDialogOpen(false);
        } catch (error) {
            console.log(error);
            // Error handling is done in the mutation hook
        }
    };

    return (
        <Card className="bg-white mb-4 rounded-lg p-6 ">
            <div className="flex flex-col space-y-2">
        
                <p className="text-lg font-semibold text-gray-900">
                    <strong className="text-gray-800 font-semibold">Name: </strong>
                    {user?.firstname || 'Name not available'}</p>
                {/* <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Email:</strong> {user?.email || 'Email not provided'}
                </p> */}
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Phone:</strong> {user?.phone || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Username:</strong> {user?.username || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Last Login:</strong> {user?.lastLoginAt ? dayjs(user.lastLoginAt).format("DD-MM-YYYY HH:mm:ss") : 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Last Login Ip:</strong> {user?.lastLoginIp || 'N/A'}
                </p>
                <p className="text-sm text-gray-700">
                    <strong className="text-gray-800">Main Balance:</strong> {
                        user?.wallet?.mainBalance ?? 'N/A'
                    }
                </p>
                
                {/* Password Reset Section */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            {operatorDetails?.role === OperatorRole.AGENT && (
                            <Button variant="outline" size="sm">
                                Reset Password
                            </Button>
                            )
                        }
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Reset User Password</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="newPassword" className="text-right">
                                        New Password
                                    </Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="col-span-3"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsDialogOpen(false)}
                                    disabled={resetPasswordMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handlePasswordReset}
                                    disabled={resetPasswordMutation.isPending || !newPassword.trim()}
                                >
                                    {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Card>
    );
};

export default UserCard;
