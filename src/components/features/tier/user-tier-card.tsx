import LoadingScreen from "@/components/common/loading-screen";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tier } from '@/models/tier';
import { useGetUserTier } from "@/react-query/game-user-queries";
import { useGetTiers } from "@/react-query/tier-queries";
import Image from "next/image";
import { useEffect, useState } from 'react';

const ActiveTierCard = ( {className}:PropsWithClassName) => {
    // Internal state for tiers data
    const [activeTier, setActiveTier] = useState<Tier | null>(null);
    const [nextTier, setNextTier] = useState<Tier | null>(null);

    // Fetch user tier data
    const { data: userTier, isLoading: isUserTierLoading } = useGetUserTier();

    // Fetch all tiers data
    const { data: tiersData, isLoading: isTiersLoading } = useGetTiers({
        page: 1,
        limit: 100,
        search: "",
        orderBy: "createdAt",
        orderByField: "DESC"
    });

    // Process tiers data when available
    useEffect(() => {
        if (tiersData?.tiers && tiersData.tiers.length > 0) {

            if (userTier) {
                const currentTierIndex = tiersData.tiers.findIndex(
                    (tier) => tier.id === userTier.tierId
                );

                if (currentTierIndex !== -1) {
                    setActiveTier(tiersData.tiers[currentTierIndex]);

                    // Set next tier if available
                    if (currentTierIndex < tiersData.tiers.length - 1) {
                        setNextTier(tiersData.tiers[currentTierIndex + 1]);
                    }
                } else if (tiersData.tiers.length > 0) {
                    // Default to first tier if user tier not found
                    setActiveTier(tiersData.tiers[0]);
                    if (tiersData.tiers.length > 1) {
                        setNextTier(tiersData.tiers[1]);
                    }
                }
            }
        }
    }, [tiersData, userTier]);

    // Show loading state while data is being fetched
    if (isUserTierLoading || isTiersLoading) {
        return <LoadingScreen className="min-h-[200px]" />;
    }

    // Return empty state if no data available
    if (!activeTier) {
        return <Card className="p-4 text-center">No tier information available</Card>;
    }

    return (
        <Card className={cn("bg-primary-game mb-8 overflow-hidden rounded-xl border-2 border-accent-secondary ", className)}style={{boxShadow: "0px 0px 15px 0px rgba(97, 216, 234, 0.5)"}}>
            <div className="relative">
                {/* Main content container */}
                <div className="flex items-center xs:flex-row flex-col gap-4 md:gap-8 p-6 relative z-10">
                    {/* Left side - Tier badge and name */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative mb-4">
                            {/* Animated background effect */}
                            <div className="absolute inset-0 aspect-square object-cover scale-150">
                                <img
                                    src="/images/banner/tiers_program_bg.webp"
                                    alt="tiers_program_bg"
                                    className="w-full h-full animate-spin"
                                    style={{ animationDuration: '20s' }}
                                />
                            </div>

                            {/* Tier image */}
                            <Image
                                src={activeTier?.imageUrl}
                                alt={activeTier?.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 z-10 relative"
                                width={1020}
                                height={1020}
                            />
                        </div>

                        <h3 className="text-xl sm:text-2xl text-center font-semibold tracking-wider text-white mb-2 uppercase">
                            <span className="text-white/70 text-xs sm:text-lg">
                                {activeTier?.name}
                            </span>
                            <span className="text-yellow-500 text-xs block text-center">MY TIER</span>
                        </h3>
                    </div>

                    {/* Right side - Progress information */}
                    <div className="w-full md:w-auto flex-1 md:ml-auto">
                        {nextTier && (
                            <div className="flex flex-col gap-4">
                                {/* Next tier header */}
                                <div className="bg-[#00355b] w-fit mx-auto p-3 rounded-md">
                                    <div className="flex items-center gap-2">
                                        <img src={nextTier?.imageUrl} alt={nextTier?.name} className="w-6 h-6" />
                                        <span className="text-white font-medium whitespace-nowrap overflow-hidden truncate text-xs sm:text-base">To Reach Next {nextTier?.name} Tier</span>
                                    </div>
                                </div>

                                {/* Progress bars */}
                                <div className="space-y-6">
                                    {/* Points progress */}
                                    {nextTier?.minPoints > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-300 text-xs sm:text-sm">Points Progress</p>
                                                <p className="text-gray-300 text-xs sm:text-sm">
                                                    {userTier?.totalPoints || 0}/{nextTier?.minPoints} Points
                                                </p>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                                                    style={{
                                                        width: `${Math.min(((userTier?.totalPoints || 0) / nextTier?.minPoints) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Games progress */}
                                    {nextTier?.gamesRequired > 0 && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p className="text-gray-300 text-xs sm:text-sm">Games Progress</p>
                                                <p className="text-gray-300 text-xs sm:text-sm">
                                                    {userTier?.gamesPlayed || 0}/{nextTier?.gamesRequired} Points
                                                </p>
                                            </div>
                                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                                    style={{
                                                        width: `${Math.min(((userTier?.gamesPlayed || 0) / nextTier?.gamesRequired) * 100, 100)}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </Card>
    );
};

export default ActiveTierCard;