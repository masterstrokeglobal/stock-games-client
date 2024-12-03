import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Agent from '@/models/agent';
import dayjs from 'dayjs';

interface AgentDetailsCardProps {
    agent: Agent;
}

const AgentDetailsCard: React.FC<AgentDetailsCardProps> = ({ agent }) => {
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
                        <span className="font-medium">Reference Code:</span> {agent.referenceCode}
                    </div>
                    <div className="text-sm text-gray-500">
                        <span className="font-medium">Created:</span> {dayjs(agent.createdAt).format('DD-MM-YYYY')}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AgentDetailsCard;