"use client";

import ReferralCard from "@/components/features/admin/agent-share-card";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/context/auth-context";
import Affiliate from "@/models/affiliate";
import { User } from "lucide-react";

const AffiliateProfilePage = () => {
    const { userDetails, loading } = useAuthStore();
    const affiliate = userDetails as unknown as Affiliate;

    // Early return if no user details
    if (!userDetails || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }


    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center space-x-4">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h1>
                    <p className="text-gray-500">
                        Welcome back, {affiliate.name}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats cards could go here */}
            </div>

            {affiliate.referenceCode ? (
                <div className="mt-6">
                    <ReferralCard agentCode={affiliate.referenceCode} />
                </div>
            ) : (
                <Card className="p-4 text-center text-gray-500">
                    No referral code available. Please contact support.
                </Card>
            )}

        </div>
    );
};

export default AffiliateProfilePage;