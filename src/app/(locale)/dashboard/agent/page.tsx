"use client";

import { Card } from "@/components/ui/card";
import ReferralCard from "@/components/features/admin/agent-share-card";
import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import { AdminRole } from "@/models/admin";
import { User } from "lucide-react";
import AgentWalletCard from "@/components/features/agent/agent-wallet-card";

const AgentDashboard = () => {
    const { userDetails } = useAuthStore();
    const agent = userDetails as Admin;

    // Early return if no user details
    if (!userDetails) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    // Verify this is an agent account
    if (agent.role !== AdminRole.AGENT) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Access denied. Agent privileges required.</p>
            </div>
        );
    }



    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center space-x-4">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                    <p className="text-gray-500">
                        Welcome back, {agent.name}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats cards could go here */}
            </div>

            {agent.referenceCode ? (
                <div className="mt-6">
                    <ReferralCard agentCode={agent.referenceCode} />
                </div>
            ) : (
                <Card className="p-4 text-center text-gray-500">
                    No referral code available. Please contact support.
                </Card>
            )}

            {agent.id && <AgentWalletCard agentId={agent.id?.toString()} />}
        </div>
    );
};

export default AgentDashboard;