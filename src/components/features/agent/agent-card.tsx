import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Agent from '@/models/agent';
import dayjs from 'dayjs';
import { useAuthStore } from '@/context/auth-context';
import Admin from '@/models/admin';
import AgentChangePasswordDialog from './agent-change-password-dialog';
import { Button } from '@/components/ui/button';

interface AgentDetailsCardProps {
    agent: Agent;
}

const AgentDetailsCard: React.FC<AgentDetailsCardProps> = ({ agent }) => {
    const { userDetails } = useAuthStore();

    const admin = userDetails as Admin;
    return (
        <Card className="w-full ">
            <CardHeader>
                <CardTitle>Agent Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <span className="font-medium">Name:</span> {agent.name}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span> {agent.email}
                    </div>
                    {agent.company && (
                        <div>
                            <span className="font-medium">Company:</span> {agent.company.name}
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Reference Code:</span> {agent.referenceCode?.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Created:</span> {dayjs(agent.createdAt).format('DD-MM-YYYY')}
                    </div>
                </div>

                {(!admin.isAgent && agent.id) && <AgentChangePasswordDialog agentId={agent.id.toString()} >
                    <Button variant="outline" className='my-4'>Change Password</Button>
                </AgentChangePasswordDialog>}

            </CardContent>
        </Card>
    );
};

export default AgentDetailsCard;