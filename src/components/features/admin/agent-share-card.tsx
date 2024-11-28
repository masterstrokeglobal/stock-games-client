import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Users } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
    agentCode: string;
};

const ReferralCard = ({ agentCode }: Props) => {

    // Generate game link from the agent code
    const gameLink = `https://yourgame.com/join/${agentCode}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(gameLink);
            toast.success("Link copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    if (!agentCode) {
        return null; // Or a fallback UI if you prefer
    }

    return (
        <Card className="w-full mx-auto border bg-white">
            <CardHeader className="space-y-1 pb-2">
                <div className="flex justify-center mb-2">
                    <Users className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-xl font-bold text-center">Invite Players</CardTitle>
                <p className="text-center text-gray-500 text-sm">
                    Share this link with users to join your game community
                </p>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-white rounded border text-sm overflow-x-auto">
                            {gameLink}
                        </code>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleCopy}
                            className="shrink-0"
                            aria-label="Copy link"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                    <div className="space-y-1">
                        <p className="font-medium">Benefits for your users:</p>
                        <ul className="pl-4 space-y-1">
                            <li>• Access to exclusive game features</li>
                            <li>• Special welcome bonus</li>
                            <li>• Direct support from you as their agent</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 pt-1">
                    <p>Your Agent ID: {agentCode}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReferralCard;