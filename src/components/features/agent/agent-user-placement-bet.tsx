import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle, AlertCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Alert,
    AlertDescription
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import User from '@/models/user';
import { SchedulerType } from '@/models/market-item';
import { useAddAgentUserPlacementNotAllowed, useRemoveAgentUserPlacementNotAllowed } from '@/react-query/user-queries';
import Agent from '@/models/agent';

interface AgentPlacementManagementProps {
    user: Agent;
}

const AgentPlacementManagement: React.FC<AgentPlacementManagementProps> = ({ user }) => {
    const [selectedType, setSelectedType] = React.useState<SchedulerType | ''>('');

    const addAgentPlacement = useAddAgentUserPlacementNotAllowed();
    const removeAgentPlacement = useRemoveAgentUserPlacementNotAllowed();

    const handleAddPlacement = () => {
        if (selectedType && user.id) {
            addAgentPlacement.mutate({
                userId: user.id.toString(),
                placementNotAllowed: selectedType
            });
            setSelectedType('');
        }
    };

    const handleRemovePlacement = (type: SchedulerType) => {
        if (user.id) {
            removeAgentPlacement.mutate({
                userId: user.id.toString(),
                placementNotAllowed: type
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>Agent Placement Management</span>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                    Manage which agent placement types are not allowed for this user
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Select
                        value={selectedType}
                        onValueChange={(value) => setSelectedType(value as SchedulerType)}
                    >
                        <SelectTrigger className="w-full sm:w-[240px]">
                            <SelectValue placeholder="Select agent placement type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(SchedulerType).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleAddPlacement}
                        disabled={!selectedType || addAgentPlacement.isPending}
                        className="w-full sm:w-auto"
                    >
                        {addAgentPlacement.isPending ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Agent Restriction
                            </>
                        )}
                    </Button>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Current Agent Restrictions</h4>

                    {user.placementNotAllowed?.length === 0 || !user.placementNotAllowed ? (
                        <Alert variant="default" className="bg-muted">
                            <AlertDescription>
                                No agent placement types are currently restricted
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {user.placementNotAllowed.map((type) => (
                                <Badge
                                    key={type}
                                    variant="secondary"
                                    className="flex items-center gap-1 pl-3 pr-1 py-1"
                                >
                                    <span>{type}</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 hover:text-destructive"
                                        onClick={() => handleRemovePlacement(type)}
                                        disabled={removeAgentPlacement.isPending}
                                    >
                                        <XCircle className="h-4 w-4" />
                                        <span className="sr-only">Remove {type} agent restriction</span>
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AgentPlacementManagement;